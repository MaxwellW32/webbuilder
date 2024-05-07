import { checkIfFileExists } from '@/serverFunctions/handleFiles';
import { getPathBaseName } from '@/useful/usefulFunctions';
import dynamic from 'next/dynamic';

export default function globalDynamicComponents(relativeFilePath: string) {
    const dynamicComponents: { [key: string]: () => Promise<React.ComponentType<{}> | undefined> } = {
"82cce3c6-2df9-4f98-b345-ad231cbdc1ae": async () => { return await checkIfFileExists(relativeFilePath) ? dynamic(() => import(`@/userComponents/82cce3c6-2df9-4f98-b345-ad231cbdc1ae/${getPathBaseName(relativeFilePath)}`), { ssr: false }) : undefined },
"12b97f5d-b4ed-4fbc-9cf0-a31becaafab4": async () => { return await checkIfFileExists(relativeFilePath) ? dynamic(() => import(`@/userComponents/12b97f5d-b4ed-4fbc-9cf0-a31becaafab4/${getPathBaseName(relativeFilePath)}`), { ssr: false }) : undefined },
"c1b65ae9-5e7e-467d-925a-0e5485fc91f5": async () => { return await checkIfFileExists(relativeFilePath) ? dynamic(() => import(`@/userComponents/c1b65ae9-5e7e-467d-925a-0e5485fc91f5/${getPathBaseName(relativeFilePath)}`), { ssr: false }) : undefined },
"81e8c6af-4ed5-444f-9aa3-68e7e9f081fb": async () => { return await checkIfFileExists(relativeFilePath) ? dynamic(() => import(`@/userComponents/81e8c6af-4ed5-444f-9aa3-68e7e9f081fb/${getPathBaseName(relativeFilePath)}`), { ssr: false }) : undefined },
"92098c93-bc9d-4b0f-a6a4-35f098c46489": async () => { return await checkIfFileExists(relativeFilePath) ? dynamic(() => import(`@/userComponents/92098c93-bc9d-4b0f-a6a4-35f098c46489/${getPathBaseName(relativeFilePath)}`), { ssr: false }) : undefined },
"34b1f67d-1feb-4955-a3be-f976db591bfc": async () => { return await checkIfFileExists(relativeFilePath) ? dynamic(() => import(`@/userComponents/34b1f67d-1feb-4955-a3be-f976db591bfc/${getPathBaseName(relativeFilePath)}`), { ssr: false }) : undefined },
"82cce3c6-2df9-4f98-b345-ad231cbdc1ae": async () => { return await checkIfFileExists(relativeFilePath) ? dynamic(() => import(`@/userComponents/82cce3c6-2df9-4f98-b345-ad231cbdc1ae/${getPathBaseName(relativeFilePath)}`), { ssr: false }) : undefined },
    }//<marker>

    return dynamicComponents
}
