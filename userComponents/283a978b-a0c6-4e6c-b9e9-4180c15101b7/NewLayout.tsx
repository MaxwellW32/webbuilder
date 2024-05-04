import React from 'react'
import styles from "./newLayout.module.css"

type textOrder = {
    one?: string
    two?: string
    three?: string
    four?: string
    five?: string
    six?: string
    seven?: string
    eight?: string
    nine?: string
    ten?: string
    headingOne?: string
    headingTwo?: string
    headingThree?: string
    headingFour?: string
    headingFive?: string
    headingSix?: string
    headingSeven?: string
    headingEight?: string
    headingNine?: string
    headingTen?: string
}

export default function NewLayout({ textOrder }: { textOrder: textOrder }) {
    return (
        <div>
            <div style={{ display: "flex", flexWrap: "wrap", height: "200px" }} className={styles.mainDiv}>
                <div style={{ flex: "1 1 300px", backgroundColor: "red" }}>{textOrder["headingOne"]}</div>
                <div style={{ flex: "1 1 300px", backgroundColor: "green" }}>{textOrder["headingTwo"]}</div>
            </div>

            <div>
                <p>More Paragraphs</p>

                <p>{textOrder["one"]}</p>

                <p>{textOrder["two"]}</p>
            </div>
        </div>
    )
}
