"use server"
import fs from "fs/promises"
import path from "path"

export async function checkIfFileExists(filePath: string) {
    try {
        await fs.access(filePath, fs.constants.F_OK);
        return true;
    } catch (error) {
        //@ts-ignore
        if (error.code === 'ENOENT') {
            return false;
        } else {
            throw error;
        }
    }
}

export async function deleteDirectory(filePath: string) {
    console.log(`$called to delete`, filePath);
    const fullPath = path.join(process.cwd(), filePath)
    await fs.rm(fullPath, { force: true, recursive: true })
}