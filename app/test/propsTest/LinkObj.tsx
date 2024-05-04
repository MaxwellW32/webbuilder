import React from "react"
import Link from "next/link"

export default function LinkObj({ linkObj }: { linkObj: { src: string, text: string } }) {
    return (
        <div>
            <Link href={linkObj.src} target="_blank">
                <button>{linkObj.text}</button>
            </Link>
        </div>
    )
}
