import React from "react"

export default function ElementArr({ elementArr }: { elementArr: JSX.Element[] }) {
    return (
        <div>
            {elementArr.map((eachElement, eachElementIndex) => {
                return (
                    <React.Fragment key={eachElementIndex} >
                        {eachElement}
                    </React.Fragment>
                )
            })}
        </div>
    )
}
