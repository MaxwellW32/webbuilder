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

export default function TextOrder({ textOrder }: { textOrder: textOrder }) {
    return (
        <div>
            <h1>{textOrder["headingOne"]}</h1>

            <div>
                <h3>{textOrder["headingTwo"]}</h3>

                <p>{textOrder["one"]}</p>

                <p>{textOrder["two"]}</p>
            </div>
        </div>
    )
}
