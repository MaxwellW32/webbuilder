"use client"
import React, { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { checkIfFileExists } from '@/serverFunctions/handleFiles';
import path from "path"
import ChildEl from '@/components/childEl/ChildEl';

type userComponent = {
    id: string,
    name: string,
    component: React.ComponentType<{}> | undefined
}

export default function Page() {
    const [userComponents, userComponentsSet] = useState<userComponent[]>([]);

    const [componentProps, componentPropsSet] = useState<{ [key: string]: {} }>({
        "first": {
            text1: "hey max working props",
            text2: "Wooo!",
        },
        "second": {
            text1: "nice job",
            text2: "clean!"
        },
        "third": {
            childEl: <ChildEl />
        }
    })

    //load up components
    useEffect(() => {
        const startOff = async () => {
            const FileInfoArr = [
                {
                    id: "first",
                    name: 'RecreateThis',
                    fileEnding: ".tsx",
                },
                {
                    id: "second",
                    name: 'RecreateThis',
                    fileEnding: ".tsx",
                },
                {
                    id: "third",
                    name: 'NavEl',
                    fileEnding: ".tsx",
                }
            ]

            const newArr = await Promise.all(FileInfoArr.map(async eachFileInfoObj => {
                const componentExists = await checkIfFileExists(path.join("userComponents", eachFileInfoObj.id, `${eachFileInfoObj.name}${eachFileInfoObj.fileEnding}`))

                if (componentExists) {
                    return {
                        id: eachFileInfoObj.id,
                        name: eachFileInfoObj.name,
                        component: dynamic(() => import(`@/userComponents/${eachFileInfoObj.id}/${eachFileInfoObj.name}`), { ssr: false })
                    }
                } else {
                    return {
                        id: eachFileInfoObj.id,
                        name: eachFileInfoObj.name,
                        component: undefined
                    }
                }
            }))

            userComponentsSet(newArr)
        }
        startOff()
    }, [])

    return (
        <div>
            {userComponents.map((eachComponent, eachComponentIndex) => {
                const props = componentProps[eachComponent.id]
                const component = eachComponent.component ? <eachComponent.component {...props} /> : <div>Component not found</div>

                return (
                    <div key={eachComponentIndex}>
                        <h2>name: {eachComponent.name}</h2>

                        {component}
                    </div>
                )
            })}
        </div>
    );
};

