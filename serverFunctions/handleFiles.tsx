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




//check for basefilename from path