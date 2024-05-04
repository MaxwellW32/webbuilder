"use client"
import { useEffect, useState } from "react"
import styles from "./styles.module.css"

export default function ShowMore({ label, content, svgColor, wantsToShowAll, startShowing }: { label: string, content: JSX.Element, svgColor?: string, wantsToShowAll?: boolean, startShowing?: boolean }) {
    const [showing, showingSet] = useState(false)

    //change Showing from above
    useEffect(() => {
        if (startShowing === undefined) return
        showingSet(startShowing)
    }, [startShowing])

    return (
        <div style={{ display: "grid" }} className={styles.mainDiv}>
            <div style={{ display: "flex", gap: ".5rem", alignItems: "center", cursor: "pointer", padding: "1rem" }} onClick={() => showingSet(prev => !prev)}>
                <p>{label}</p>

                <div style={{ rotate: showing ? "90deg" : "", transition: "rotate 400ms" }}>
                    <svg style={{ fill: svgColor ?? "" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" /></svg>
                </div>
            </div>

            <div style={{ padding: '1rem', display: !showing ? "none" : "", overflow: "hidden", width: showing && wantsToShowAll ? "max-content" : "" }}>
                <div className={`${showing ? styles.animateIn : ""}`} style={{}}>
                    {content}
                </div>
            </div>
        </div>
    )
}
