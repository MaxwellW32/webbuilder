import { checkIfFileExists } from '@/serverFunctions/handleFiles';
import { getPathBaseName } from '@/useful/usefulFunctions';
import dynamic from 'next/dynamic';

export default function globalDynamicComponents(relativeFilePath: string) {
    const dynamicComponents: { [key: string]: () => Promise<React.ComponentType<{}> | undefined> } = {
    }//<marker>

    return dynamicComponents
}
