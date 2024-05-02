import React from "react"
import Link from "next/link"

export default function LinkExample({ link }: { link: { src: string, text: string } }) {
    return (
        <div>
            <Link href={link.src}>
                <button>{link.text}</button>
            </Link>
        </div>
    )
}
