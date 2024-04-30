import React from 'react'

export default function NavEl({ childEl }: { childEl: JSX.Element }) {
    return (
        <nav>
            {childEl}
        </nav>
    )
}
