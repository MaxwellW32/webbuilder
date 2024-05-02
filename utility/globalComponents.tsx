import { checkIfFileExists } from '@/serverFunctions/handleFiles';
import { getPathBaseName } from '@/useful/usefulFunctions';
import dynamic from 'next/dynamic';

export default function globalDynamicComponents(relativeFilePath: string) {
    const dynamicComponents: { [key: string]: () => Promise<React.ComponentType<{}> | undefined> } = {
"1cc543f9-a193-4f08-bf36-a2239e3b7c6d": async () => { return await checkIfFileExists(relativeFilePath) ? dynamic(() => import(`@/userComponents/1cc543f9-a193-4f08-bf36-a2239e3b7c6d/${getPathBaseName(relativeFilePath)}`), { ssr: false }) : undefined },
    }//<marker>

    return dynamicComponents
}
