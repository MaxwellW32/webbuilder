import React from 'react'
import styles from "./recreateThis.module.css"

export default function RecreateThis({ text1, text2 }: { text1: string, text2: string }) {
    return (
        <div className={styles.mainDiv}>Component: Wooo {text1} {text2}</div>
    )
}
