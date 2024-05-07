"use client"
import { userComponent } from '@/types'
import React, { useMemo, useState, useEffect, useRef } from 'react'
import styles from "./viewUserComponent.module.css"
import { websiteUrl } from '@/utility/globalState'

export default function ViewResizableUserComponent({ userComponent, externalViewSize, ...elProps }: { userComponent: userComponent, externalViewSize?: "phone" | "tablet" | "desktop" } & React.HTMLAttributes<HTMLDivElement>) {
    const [viewSize, viewSizeSet] = useState<"phone" | "tablet" | "desktop">(externalViewSize ? externalViewSize : "desktop")

    //keep synced to external viewstyles
    useEffect(() => {
        if (externalViewSize === undefined) return

        viewSizeSet(externalViewSize)
    }, [externalViewSize])

    const currentStyles = useMemo<React.CSSProperties>(() => {
        if (viewSize === "phone") {
            return {}
        } else if (viewSize === "tablet") {
            return {}
        } else {
            return {}
        }
    }, [viewSize])

    const activeDimensions = useMemo(() => {
        if (viewSize === "phone") {
            return {
                width: 360,
                height: 640
            }
        } else if (viewSize === "tablet") {
            return {
                width: 768,
                height: 1024
            }
        } else {
            return {
                width: 1440,
                height: 900
            }
        }
    }, [viewSize]);

    return (
        <div {...elProps} style={{ display: "grid", ...elProps?.style }}>
            {externalViewSize === undefined && (
                <div className={styles.viewSelector} style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center" }}>
                    <button style={{ backgroundColor: viewSize === "phone" ? "var(--color2)" : "" }} className='smallButton' onClick={() => { viewSizeSet("phone") }}>
                        <svg style={{ fill: "#fff" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M80 0C44.7 0 16 28.7 16 64V448c0 35.3 28.7 64 64 64H304c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H80zM192 400a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" /></svg>
                    </button>
                    <button style={{ backgroundColor: viewSize === "tablet" ? "var(--color2)" : "" }} className='smallButton' onClick={() => { viewSizeSet("tablet") }}>
                        <svg style={{ fill: "#fff" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H64zM176 432h96c8.8 0 16 7.2 16 16s-7.2 16-16 16H176c-8.8 0-16-7.2-16-16s7.2-16 16-16z" /></svg>
                    </button>
                    <button style={{ backgroundColor: viewSize === "desktop" ? "var(--color2)" : "" }} className='smallButton' onClick={() => { viewSizeSet("desktop") }}>
                        <svg style={{ fill: "#fff" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M64 0C28.7 0 0 28.7 0 64V352c0 35.3 28.7 64 64 64H240l-10.7 32H160c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H346.7L336 416H512c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H64zM512 64V352H64V64H512z" /></svg>
                    </button>
                </div>
            )}

            <div className={`${styles.componentViewerCont} niceScrollbar`} style={{ overflow: "auto" }}>
                <iframe src={`${websiteUrl}/userComponents/view/${userComponent.id}`} width={activeDimensions.width}>
                </iframe>
            </div>
        </div>
    )
}
