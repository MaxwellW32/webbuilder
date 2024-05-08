"use client"
import { newProp, newPropsSchema, prop } from '@/types'
import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import styles from "./page.module.css"
import { addProp, updateProp } from '@/serverFunctions/handleProps'

export default function AddOrEditProp({ seenProp }: { seenProp?: prop }) {

    const [initialForm, initialFormSet] = useState<prop | newProp>(seenProp ? { ...seenProp } : {
        name: "",
        explanation: "",
        example: "",
        obj: {},
        typeScriptDefinition: ""
    })
    const [formObj, formObjSet] = useState({ ...initialForm })
    const [formErrors, formErrorsSet] = useState<{ [key: string]: string | null }>({})
    const [wantsToAddProp, wantsToAddPropSet] = useState(false)

    function checkIfValid(seenFormObj: newProp, seenName: keyof newProp) {
        // @ts-ignore
        const testSchema = newPropsSchema.pick({ [seenName]: true }).safeParse(seenFormObj);

        if (testSchema.success) {//worked
            formErrorsSet(prevObj => {
                const newObj = { ...prevObj }
                //@ts-ignore
                newObj[seenName] = null

                return newObj
            })

        } else {
            formErrorsSet(prevObj => {
                const newObj = { ...prevObj }

                let errorMessage = ""

                //@ts-ignore
                JSON.parse(testSchema.error.message).forEach(eachErrorObj => {
                    errorMessage += eachErrorObj.message
                })

                //@ts-ignore
                newObj[seenName] = errorMessage

                return newObj
            })
        }
    }

    async function handleSubmit(wantsToSubmit = false) {
        if (!wantsToSubmit) return

        if (!newPropsSchema.safeParse(formObj).success) return

        try {
            if (seenProp) {
                //update
                await updateProp(formObj as prop)

                //invalidate all components using the prop - theyll need to update
            } else {
                //add
                await addProp(formObj)
                formObjSet({ ...initialForm })
            }


            toast.success(seenProp ? "prop updated" : "prop submitted")

        } catch (error) {
            console.log(`$error adding userComponent`, error);
        }
    };


    return (
        <main style={{ display: "grid" }}>
            {wantsToAddProp ? (
                <>
                    <section>
                        <h1>Upload a prop</h1>
                    </section>

                    <form action={() => { }} className={styles.form}>
                        <div>
                            <label htmlFor="name">Enter a unique name for this component</label>

                            <input id="name" type="text" placeholder={`what's a prop name?`} value={formObj.name}
                                onChange={(e) => {
                                    formObjSet(prevObj => {
                                        const newObj = { ...prevObj }
                                        newObj.name = e.target.value
                                        return newObj
                                    })
                                }}
                                onBlur={() => {
                                    checkIfValid(formObj, "name")
                                }} />

                            {formErrors["name"] && (<p style={{ fontSize: "var(--smallFontSize)" }}>{formErrors["name"]}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="explanation">Explain what this prop does</label>

                            <input id="explanation" type="text" placeholder={`Explain this prop`} value={formObj.explanation}
                                onChange={(e) => {
                                    formObjSet(prevObj => {
                                        const newObj = { ...prevObj }
                                        newObj.explanation = e.target.value
                                        return newObj
                                    })
                                }}
                                onBlur={() => {
                                    checkIfValid(formObj, "explanation")
                                }} />

                            {formErrors["explanation"] && (<p style={{ fontSize: "var(--smallFontSize)" }}>{formErrors["explanation"]}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="example">Enter an example of this props use - entire function</label>

                            <textarea rows={5} id="example" style={{ backgroundColor: "#000", color: "#fff" }} placeholder={`Enter example`} value={formObj.example}
                                onChange={(e) => {
                                    formObjSet(prevObj => {
                                        const newObj = { ...prevObj }
                                        newObj.example = e.target.value
                                        return newObj
                                    })
                                }}
                                onBlur={() => {
                                    checkIfValid(formObj, "example")
                                }} />

                            {formErrors["example"] && (<p style={{ fontSize: "var(--smallFontSize)" }}>{formErrors["example"]}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="obj">Enter prop obj - {"(how the prop is called)"}</label>

                            <textarea rows={5} id="obj" style={{ backgroundColor: "#000", color: "#fff" }} placeholder={`Enter obj`} value={JSON.stringify(formObj.obj)}
                                onChange={(e) => {
                                    formObjSet(prevObj => {
                                        const newObj = { ...prevObj }

                                        newObj.obj = eval("(" + e.target.value + ")")

                                        return newObj
                                    })
                                }}
                                onBlur={() => {
                                    checkIfValid(formObj, "obj")
                                }} />

                            {formErrors["obj"] && (<p style={{ fontSize: "var(--smallFontSize)" }}>{formErrors["obj"]}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="typeScriptDefinition">Enter the typescript definition for this prop</label>

                            <textarea rows={5} id="typeScriptDefinition" style={{ backgroundColor: "#000", color: "#fff" }} placeholder={`Enter typeScriptDefinition`} value={formObj.typeScriptDefinition}
                                onChange={(e) => {
                                    formObjSet(prevObj => {
                                        const newObj = { ...prevObj }
                                        newObj.typeScriptDefinition = e.target.value
                                        return newObj
                                    })
                                }}
                                onBlur={() => {
                                    checkIfValid(formObj, "typeScriptDefinition")
                                }} />

                            {formErrors["typeScriptDefinition"] && (<p style={{ fontSize: "var(--smallFontSize)" }}>{formErrors["typeScriptDefinition"]}</p>
                            )}
                        </div>

                        <button className='mainButton' type="submit" onClick={() => handleSubmit(true)} disabled={!newPropsSchema.safeParse(formObj).success}>Submit</button>
                    </form>

                    {seenProp !== undefined && (
                        <button style={{ justifySelf: "center" }} className='smallButton' onClick={() => { wantsToAddPropSet(false) }}>Cancel Editing</button>
                    )}
                </>
            ) : (
                <>
                    <button className='smallButton' onClick={() => { wantsToAddPropSet(true) }}>{seenProp ? `Edit prop ${seenProp.name}` : `Add a prop`}</button>
                </>
            )}
        </main>
    )
}
