"use server"
import { db } from "@/db";
import { type collection, type userComponent, type layout, type newComponent, newComponentSchema } from "@/types";
import { userComponents } from "@/db/schema";
import { eq, isNotNull, isNull } from "drizzle-orm";
import fs from "fs/promises"
import path from "path"
import { v4 as uuidV4 } from "uuid"
import { replaceBaseFolderNameInPath } from "@/useful/usefulFunctions";

//remedy when users working
export async function addUserComponent(seenNewComponent: newComponent) {
    const validateNewComponent = newComponentSchema.safeParse(seenNewComponent)

    if (!validateNewComponent.success) {
        console.log(`$error adding component`, validateNewComponent.error.message);
    }

    const id = uuidV4()

    if (!seenNewComponent.nextLayout) return

    //rename basename for main folder
    seenNewComponent.nextLayout.mainFileName = replaceBaseFolderNameInPath(id, seenNewComponent.nextLayout.mainFileName)

    //change base in  collection paths to be from the id
    const newLayoutCollection = seenNewComponent.nextLayout.collection.map(eachCollection => {
        eachCollection.relativePath = replaceBaseFolderNameInPath(id, eachCollection.relativePath)
        return eachCollection
    })
    seenNewComponent.nextLayout.collection = newLayoutCollection

    const finalNewComponent: newComponent = {
        ...seenNewComponent,
        id: id,
        userId: 1,
    }

    await db.insert(userComponents).values(finalNewComponent);
}

export async function getUserComponents(getNeedsToBeApproved = false, seenLimit = 50, seenOffset = 0): Promise<userComponent[]> {
    if (getNeedsToBeApproved) {
        const results = await db.query.userComponents.findMany({
            where: isNotNull(userComponents.nextLayout), //form admin - get needs to be approved
        });

        return results

    } else {
        const results = await db.query.userComponents.findMany({
            limit: seenLimit,
            offset: seenOffset,
            where: isNotNull(userComponents.currentLayout), //has already been approved before
        });

        return results
    }
}

export async function acceptUserComponent(component: userComponent) {
    //use next layout 
    const currentLayout = component.nextLayout
    if (currentLayout === null) return

    //write files to userfolder
    await recreateComponentFolderStructure(currentLayout.collection, "userComponents")


    //update the globalcomponents obj
    await appendGlobalComponentsFile(component.id)

    //change next layout to null, write to currentlayout
    await db.update(userComponents)
        .set({
            currentLayout: currentLayout,
            nextLayout: null,
        })
        .where(eq(userComponents.id, component.id));

    //redeploy site every 24 hrs
}

export async function recreateComponentFolderStructure(collection: collection[], folderToStart: string) {//repalce with component when ready
    const basePath = path.join(process.cwd(), folderToStart);

    await Promise.all(
        collection.map(async eachCollection => {
            // Construct the absolute path of the file
            const filePath = path.join(basePath, eachCollection.relativePath);
            const folderPath = path.dirname(filePath);

            try {
                // Create the folder if it doesn't exist
                await fs.mkdir(folderPath, { recursive: true });

                // Write the file to the correct path
                await fs.writeFile(filePath, eachCollection.content);

                console.log(`Created file: ${filePath}`);
            } catch (err) {
                console.error(`Error creating file ${filePath}: ${err}`);
            }
        })
    )
}


export async function appendGlobalComponentsFile(id: string) {//repalce with component when ready
    try {
        const basePath = path.join(process.cwd(), "utility", "globalComponents.tsx");

        let fileContent = await fs.readFile(basePath, 'utf8');

        const markerIndex = fileContent.indexOf('}//<marker>');

        if (markerIndex === -1) {
            console.error('Marker not found in file.');
            return
        }

        // Find the index of the newline character before the marker
        let newlineIndex = fileContent.lastIndexOf('\n', markerIndex);


        // Append the string before the marker
        // fileContent = fileContent.slice(0, newlineIndex) + '\n' + `"${id}": dynamic(() => import(\`@/userComponents/${id}/\${fileName}\`), { ssr: false }),` + fileContent.slice(newlineIndex);

        if (newlineIndex !== -1) {
            fileContent = fileContent.slice(0, newlineIndex) + '\n' + `"${id}": async () => { return await checkIfFileExists(relativeFilePath) ? dynamic(() => import(\`@/userComponents/${id}/\${getPathBaseName(relativeFilePath)}\`), { ssr: false }) : undefined },` + fileContent.slice(newlineIndex);
        }

        await fs.writeFile(basePath, fileContent);

        console.log('Record appended to dynamicComponents successfully.');

    } catch (error) {
        console.error('Error appending record to dynamicComponents:', error);
    }
}


