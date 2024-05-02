import React from 'react'
import styles from "./newLayout.module.css"

export default function NewLayout() {
    return (
        <div style={{ display: "flex", flexWrap: "wrap", height: "200px" }} className={styles.mainDiv}>
            <div style={{ flex: "1 1 300px", backgroundColor: "red" }}></div>
            <div style={{ flex: "1 1 300px", backgroundColor: "green" }}></div>
        </div>
    )
}
