import path from "path"

export function replaceBaseFolderNameInPath(firstParam: string, filePath: string) {
    const pathObj = path.parse(filePath);

    // Replace the first folder name with an id
    pathObj.dir = path.join(firstParam, ...pathObj.dir.split(path.sep).slice(1));

    // Format the modified path object back to a file path
    const modifiedPath = normalizeFilePathToForwardSlashes(path.format(pathObj));

    return modifiedPath
}

export function getPathBaseName(filePath: string) {
    return path.basename(filePath)
}


export function normalizeFilePathToForwardSlashes(filePath: string) {
    return filePath.replace(/\\/g, '/');
}