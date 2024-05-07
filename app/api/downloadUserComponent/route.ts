import JSZip from "jszip";
import path from "path"
import fs from "fs/promises"

export async function GET(request: Request,) {
    const { searchParams } = new URL(request.url);
    const seenID = searchParams.get("id");
    if (!seenID) throw new Error("need Id");

    const fullPath = path.join(process.cwd(), "userComponents", seenID);
    const zip = new JSZip();

    // Function to recursively add files and directories to the zip object
    const addFolderToZip = async (folderPath: string, relativePath: string) => {
        const files = await fs.readdir(folderPath);

        for (const file of files) {
            const filePath = path.join(folderPath, file);
            const relativeFilePath = path.join(relativePath, file);
            const stats = await fs.stat(filePath);

            console.log(`$filePath`, filePath);
            console.log(`$relative path`, relativeFilePath);

            if (stats.isDirectory()) {
                await addFolderToZip(filePath, relativeFilePath);
            } else {
                const fileData = await fs.readFile(filePath);
                zip.file(relativeFilePath, fileData);
            }
        }
    };

    // Add the entire folder to the zip object
    await addFolderToZip(fullPath, "");

    const archive = await zip.generateAsync({ type: "blob" });

    return new Response(archive);
}
