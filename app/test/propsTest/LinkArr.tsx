import React from "react"
import Link from "next/link"

export default function LinkArr({ linkArr }: { linkArr: { src: string, text: string }[] }) {
    return (
        <div>
            {linkArr.map((eachLink, eachLinkIndex) => {
                return (
                    <Link href={eachLink.src}>
                        <button>{eachLink.text}</button>
                    </Link>
                )
            })}
        </div>
    )
}
