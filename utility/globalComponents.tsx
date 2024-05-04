import { checkIfFileExists } from '@/serverFunctions/handleFiles';
import { getPathBaseName } from '@/useful/usefulFunctions';
import dynamic from 'next/dynamic';

export default function globalDynamicComponents(relativeFilePath: string) {
    const dynamicComponents: { [key: string]: () => Promise<React.ComponentType<{}> | undefined> } = {
"55c5addd-552d-4865-93a3-28306f4dd50a": async () => { return await checkIfFileExists(relativeFilePath) ? dynamic(() => import(`@/userComponents/55c5addd-552d-4865-93a3-28306f4dd50a/${getPathBaseName(relativeFilePath)}`), { ssr: false }) : undefined },
"283a978b-a0c6-4e6c-b9e9-4180c15101b7": async () => { return await checkIfFileExists(relativeFilePath) ? dynamic(() => import(`@/userComponents/283a978b-a0c6-4e6c-b9e9-4180c15101b7/${getPathBaseName(relativeFilePath)}`), { ssr: false }) : undefined },
"e2a2154c-3168-4364-99e1-53fe3212e3dd": async () => { return await checkIfFileExists(relativeFilePath) ? dynamic(() => import(`@/userComponents/e2a2154c-3168-4364-99e1-53fe3212e3dd/${getPathBaseName(relativeFilePath)}`), { ssr: false }) : undefined },
    }//<marker>

    return dynamicComponents
}
