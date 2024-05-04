import ShowMore from "../showMore/ShowMore";

export default function InputList({ passedObj, objectSetter, parentKey }: { passedObj: { [key: string]: any }, objectSetter: React.Dispatch<React.SetStateAction<{ [key: string]: any; }>>, parentKey?: string }) {

    return (
        <div style={{ display: "grid", gap: "1rem" }}>
            {Object.entries(passedObj).map(([eachKey, eachValue]) => {
                const keyPath = parentKey ? `${parentKey}.${eachKey}` : eachKey;

                if (typeof eachValue === "object" && eachValue) {

                    return (
                        <div key={eachKey} style={{ display: "grid" }}>
                            <ShowMore label={`edit ${eachKey}`} content={
                                <InputList passedObj={eachValue} objectSetter={objectSetter} parentKey={keyPath} />
                            } />
                        </div>
                    )

                } else if (typeof eachValue === "string" || typeof eachValue === "number") {
                    return (
                        <div key={eachKey} style={{ display: "grid" }}>
                            <label>{eachKey}</label>

                            <input name={eachKey} type={"text"} value={eachValue} onChange={(e) => {
                                const newValue = e.target.value;

                                objectSetter(prevState => {
                                    const newState = { ...prevState }
                                    const keys = keyPath.split('.');
                                    let currentState = newState;
                                    for (let i = 0; i < keys.length - 1; i++) {
                                        currentState = currentState[keys[i]];
                                    }
                                    currentState[keys[keys.length - 1]] = typeof eachValue === "string" ? newValue : parseInt(newValue);
                                    return newState;
                                });
                            }} />
                        </div>
                    );

                } else return null;
            })}
        </div>
    );
}
