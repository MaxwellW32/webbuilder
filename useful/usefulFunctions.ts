import path from "path"
import fs from "fs/promises"

export function replaceBaseFolderNameInPath(stringToReplaceWith: string, filePath: string) {
    const splitArr = filePath.split(/[\/\\]/)
    splitArr[0] = stringToReplaceWith
    const finalPath = splitArr.join("/")

    return finalPath
}

export function getPathBaseName(filePath: string) {
    return path.basename(filePath)
}


export function normalizeFilePathToForwardSlashes(filePath: string) {
    return filePath.replace(/\\/g, '/');
}

