import React from 'react'

export default function NewChildElementsLayout2({ children }: { children: React.ReactNode }) {
    return (
        <div style={{ display: "#fff" }}>
            <p>component 2 uses child layouts as well</p>

            <p>Above</p>

            {children}

            <p>Below</p>
        </div>
    )
}
