"use client"
import React, { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { checkIfFileExists } from '@/serverFunctions/handleFiles';
import path from "path"
import { getUserComponents } from '@/serverFunctions/handleUserComponents';
import { userComponent } from '@/types';
import globalDynamicComponents from '@/utility/globalComponents';

export default function Page() {
    type builtComponent = (userComponent & { component: React.ComponentType<{}> | undefined })
    const [userComponentsBuilt, userComponentsBuiltSet] = useState<builtComponent[]>([]);

    const [componentProps, componentPropsSet] = useState<{ [key: string]: {} }>({
        "first": {
            text1: "hey max working props",
            text2: "Wooo!",
        },
        "second": {
            text1: "nice job",
            text2: "clean!"
        }
    })

    //load up components
    useEffect(() => {
        const startOff = async () => {
            const aprovedUserComponents = await getUserComponents()

            const newBuiltComponents: builtComponent[] = await Promise.all(aprovedUserComponents.map(async eachComponent => {
                const fullPath = path.join("userComponents", eachComponent.currentLayout!.mainFileName)

                const Component = await globalDynamicComponents(fullPath)[eachComponent.id]()

                return {
                    ...eachComponent,
                    component: Component
                }
            }))

            userComponentsBuiltSet(newBuiltComponents)
        }
        startOff()
    }, [])

    return (
        <div>
            <p>Home page</p>

            {userComponentsBuilt.map((eachComponent, eachComponentIndex) => {
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

