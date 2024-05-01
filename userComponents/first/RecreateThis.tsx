import React from 'react'
import styles from "./recreateThis.module.css"
import Important from './importantComp/Important'

export default function RecreateThis({ text1, text2 }: { text1: string, text2: string }) {
    return (
        <div className={styles.mainDiv}>
            Component: RecreateThis {text1} {text2}
            <Important />
        </div>
    )
}
