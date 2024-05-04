import React from "react"
import Link from "next/link"

export default function LinkObjArr({ linkObjArr }: { linkObjArr: { src: string, text: string }[] }) {
    return (
        <div>
            {linkObjArr.map((eachLinkObj, eachLinkObjIndex) => {
                return (
                    <Link key={eachLinkObjIndex} href={eachLinkObj.src} target="_blank">
                        <button>{eachLinkObj.text}</button>
                    </Link>
                )
            })}
        </div>
    )
}
