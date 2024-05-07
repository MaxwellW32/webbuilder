import React from 'react'

export default function NewChildElementsLayout({ children }: { children: React.ReactNode }) {
    return (
        <div style={{ display: "#fff" }}>
            <p>This component uses child layouts</p>

            <p>Above children</p>

            {children}

            <p>Below children</p>
        </div>
    )
}
