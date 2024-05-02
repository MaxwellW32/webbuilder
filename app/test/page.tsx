"use client"
import { checkIfFileExists } from '@/serverFunctions/handleFiles'
import { getPathBaseName } from '@/useful/usefulFunctions'
import globalDynamicComponents from '@/utility/globalComponents'
import React, { useEffect, useState } from 'react'

export default function page() {
    return (
        <main>
            <section>
                {/* <button className='mainButton' onClick={async () => {
                    console.log(`$globalDynamicComponents("RecreateThis")`, await globalDynamicComponents("userComponents/b3cb6db0-0cf9-4649-842b-d36eec3951d8/RecreateThis.tsx")["b3cb6db0-0cf9-4649-842b-d36eec3951d8"]());
                }}>Check</button> */}

                {/* <button className='mainButton' onClick={async () => {
                    console.log(`$checkIfFileExists("/userComponents/b3cb6db0-0cf9-4649-842b-d36eec3951d8/RecreateThis.tsx")`, await checkIfFileExists("userComponents/b3cb6db0-0cf9-4649-842b-d36eec3951d8/RecreateThis.tsx"));
                }}>Check if file exists</button> */}

                {/* <button className='mainButton' onClick={async () => {
                    console.log(`$getPathBaseName`, getPathBaseName(`userComponents/b3cb6db0-0cf9-4649-842b-d36eec3951d8/RecreateThis.tsx`));
                }}>Get base name</button> */}
            </section>
        </main>
    )
}
