import React, { useRef } from 'react'

export default function MakeElement({ elNumber }: { elNumber: number }) {
    const rndR = useRef(Math.floor(Math.random() * 256))
    const rndG = useRef(Math.floor(Math.random() * 256))
    const rndB = useRef(Math.floor(Math.random() * 256))

    return (
        <div style={{ backgroundColor: `rgb(${rndR.current},${rndG.current},${rndB.current})`, padding: "1rem", display: "grid", justifyItems: "center", alignItems: "center" }}>
            Element - {elNumber}
        </div>
    )
}
