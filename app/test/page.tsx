"use client"
import { checkIfFileExists } from '@/serverFunctions/handleFiles'
import { getPathBaseName } from '@/useful/usefulFunctions'
import globalDynamicComponents from '@/utility/globalComponents'
import React, { useEffect, useState } from 'react'
import TextOrder from './propsTest/TextOrder'
import TestComp from './TestComp'
import NewLayout from '@/exampleDesignsToRemake/newFolder/NewLayout'
import Element from './propsTest/element/Element'
import MakeElement from '@/components/starters/MakeElement'

export default function Page() {
    return (
        <main>
            {/* <div className='noExternalStyles'>
                <Element element={<MakeElement elNumber={1} />} />
            </div> */}

            <ExampleComp>
                <div style={{ backgroundColor: "#fff", padding: "3rem" }}>Child Element</div>
            </ExampleComp>
        </main>
    )
}


function ExampleComp({ children }: { children: React.ReactNode }) {

    return (
        <div style={{ backgroundColor: "green", display: "grid", justifyItems: "center" }}>
            <p>Parent Element Above</p>
            {children}
            <p>Parent Element Below</p>
        </div>
    )

}