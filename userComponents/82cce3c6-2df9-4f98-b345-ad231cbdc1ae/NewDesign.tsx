import React from 'react'
import styles from "./newDesign.module.css"
import SubComponentOne from './subComponentOneDiff/SubComponentOne'
import SubComponentTwo from './subComponentOneDiff/subComponentTwoDiff/SubComponentTwo'

export default function NewDesign() {
    return (
        <div className={styles.main}>
            <p>Paragraph 1</p>
            <SubComponentOne />

            <p>Paragraph 2</p>
            <SubComponentTwo />

            <p>Paragraph 3</p>
        </div>
    )
}
