export default function TextArr({ textArr }: { textArr: string[] }) {
    return (
        <div>
            {textArr.map((eachText, eachTextIndex) => {
                return (
                    <p key={eachTextIndex}>{eachText}</p>
                )
            })}
        </div>
    )
}
