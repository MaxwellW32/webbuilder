"use server"
import { db } from "@/db";
import { type collection, type userComponent, type layout, type newUserComponent, newUserComponentSchema, category, user, userComponentSchema } from "@/types";
import { userComponents } from "@/db/schema";
import { eq, isNotNull, isNull, and, desc } from "drizzle-orm";
import fs from "fs/promises"
import path from "path"
import { v4 as uuidV4 } from "uuid"
import { replaceBaseFolderNameInPath } from "@/useful/usefulFunctions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { deleteDirectory } from "./handleFiles";

//remedy when users working
export async function addUserComponent(userSubmittedNewComponent: newUserComponent): Promise<userComponent> {
    const session = await getServerSession(authOptions)
    if (!session) throw new Error("not signed in")

    const id = uuidV4()

    const finalNewComponent = {
        ...userSubmittedNewComponent,
        id: id,
        userId: session.user.id,
    }

    newUserComponentSchema.parse(finalNewComponent)

    if (!finalNewComponent.nextLayout) throw new Error("now layout submitted")

    //rename basename for main folder
    finalNewComponent.nextLayout.mainFileName = replaceBaseFolderNameInPath(id, finalNewComponent.nextLayout.mainFileName)// newDesign/NewDesign.tsx

    //change base in  collection paths to be from the id
    //write new base path collection to nextLayout
    finalNewComponent.nextLayout.collection = finalNewComponent.nextLayout.collection.map(eachCollection => {
        eachCollection.relativePath = replaceBaseFolderNameInPath(id, eachCollection.relativePath)
        return eachCollection
    })

    const [result] = await db.insert(userComponents).values(finalNewComponent).returning();

    return result
}

export async function updateUserComponent(seenUserComponent: Partial<userComponent>) {
    const session = await getServerSession(authOptions)
    if (!session) throw new Error("not signed in")

    if (seenUserComponent.id === undefined || seenUserComponent.userId === undefined) throw new Error("Values not supplied for id or userid")

    if (session.user.role !== "admin" && seenUserComponent.userId !== session.user.id) throw new Error("Not correct user to update this component")

    userComponentSchema.partial().parse(seenUserComponent)

    //rename base name
    if (seenUserComponent.nextLayout) {
        //rename basename for main folder
        seenUserComponent.nextLayout.mainFileName = replaceBaseFolderNameInPath(seenUserComponent.id, seenUserComponent.nextLayout.mainFileName)// newDesign/NewDesign.tsx

        //change base in  collection paths to be from the id
        //write new base path collection to nextLayout
        seenUserComponent.nextLayout.collection = seenUserComponent.nextLayout.collection.map(eachCollection => {
            eachCollection.relativePath = replaceBaseFolderNameInPath(seenUserComponent.id!, eachCollection.relativePath)
            return eachCollection
        })
    }


    await db.update(userComponents)
        .set({
            ...seenUserComponent
        })
        .where(eq(userComponents.id, seenUserComponent.id));
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

export async function deleteUserComponent(userComponentId: Pick<userComponent, "id" | "userId">,) {
    const session = await getServerSession(authOptions)
    if (!session) throw new Error("not signed in")

    if (session.user.role !== "admin" && session.user.id !== userComponentId.userId) throw new Error("no authority to delete post")

    userComponentSchema.pick({ id: true, userId: true }).parse(userComponentId)

    await db.delete(userComponents).where(eq(userComponents.id, userComponentId.id));
}

export async function getSpecificUserComponent(userComponentsId: Pick<userComponent, "id">): Promise<userComponent | undefined> {
    const result = await db.query.userComponents.findFirst({
        where: eq(userComponents.id, userComponentsId.id)
    });

    return result

}

export async function getUserComponentsFromCategory(categoryId: Pick<category, "id">, seenLimit = 50, seenOffset = 0): Promise<userComponent[]> {
    const results = await db.query.userComponents.findMany({
        limit: seenLimit,
        offset: seenOffset,
        where: and(isNotNull(userComponents.currentLayout), eq(userComponents.categoryId, categoryId.id)) //has already been approved and is correct category
    });

    return results
}

export async function getUserComponentsFromUser(userId: Pick<user, "id">, seenLimit = 50, seenOffset = 0): Promise<userComponent[]> {
    const results = await db.query.userComponents.findMany({
        limit: seenLimit,
        offset: seenOffset,
        where: eq(userComponents.userId, userId.id),
    });

    return results
}

export async function acceptUserComponent(component: userComponent) {
    //use next layout 
    const currentLayout = component.nextLayout
    if (currentLayout === null) return

    //delete folder if existing already
    await deleteDirectory(path.join("userComponents", component.id))

    //write files to userfolder
    await recreateComponentFolderStructure(currentLayout.collection, "userComponents")

    //update the globalcomponents obj only when new
    if (component.currentLayout === null) await appendGlobalComponentsFile(component.id)

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
            const filePath = path.join(basePath, eachCollection.relativePath);
            const folderPath = path.dirname(filePath);

            try {
                // Create the folder if it doesn't exist
                await fs.mkdir(folderPath, { recursive: true });
                console.log(`$made directory`, folderPath);

                // Write the file to the correct path
                await fs.writeFile(filePath, eachCollection.content);
                console.log(`wrote the file: ${filePath}`);

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
        if (newlineIndex !== -1) {
            fileContent = fileContent.slice(0, newlineIndex) + '\n' + `"${id}": async () => { return await checkIfFileExists(relativeFilePath) ? dynamic(() => import(\`@/userComponents/${id}/\${getPathBaseName(relativeFilePath)}\`), { ssr: false }) : undefined },` + fileContent.slice(newlineIndex);
        }

        await fs.writeFile(basePath, fileContent);

        console.log('Record appended to dynamicComponents successfully.');

    } catch (error) {
        console.error('Error appending record to dynamicComponents:', error);
    }
}

export async function removeIdFromGlobalComponentsFile(id: string) {
    try {
        const basePath = path.join(process.cwd(), "utility", "globalComponents.tsx");

        let fileContent = await fs.readFile(basePath, 'utf8');

        // Split the file content by lines
        const lines = fileContent.split('\n');

        // Find the index of the line that contains the ID
        const index = lines.findIndex(line => line.includes(`"${id}":`));

        if (index !== -1) {
            // Remove the line containing the ID
            lines.splice(index, 1);

            // Join the lines back into a single string
            fileContent = lines.join('\n');

            // Write the modified content back to the file
            await fs.writeFile(basePath, fileContent);

            console.log(`Line containing ID "${id}" removed from globalComponents.tsx successfully.`);
        } else {
            console.log(`ID "${id}" not found in globalComponents.tsx.`);
        }

    } catch (error) {
        console.error('Error removing line from globalComponents.tsx:', error);
    }
}



