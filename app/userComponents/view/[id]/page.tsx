"use client"

import { getSpecificUserComponent } from '@/serverFunctions/handleUserComponents'
import { builtComponent } from '@/types'
import buildUserComponents from '@/useful/buildUserComponents'
import React, { useEffect, useState } from 'react'

export default function Page({ params }: { params: { id: string } }) {
    const [builtComponent, builtComponentSet] = useState<builtComponent>()

    //load up
    useEffect(() => {
        const startOff = async () => {
            const topNav = document.getElementById("mainNav")
            if (topNav !== null) {
                topNav.style.display = "none"
            }

            if (params.id === undefined) return

            const userComponent = await getSpecificUserComponent({ id: params.id })
            if (userComponent === undefined) return

            const [seenBuiltComponent] = await buildUserComponents([userComponent])

            builtComponentSet(seenBuiltComponent)
        }
        startOff()
    }, [])

    if (builtComponent && builtComponent.component) {
        return <builtComponent.component />
    } else {
        return null
    }
}
