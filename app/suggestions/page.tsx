"use client"
import { newSuggestion, newSuggestionsSchema, suggestionType } from '@/types';
import React, { useEffect, useState } from 'react'
import styles from "./page.module.css"
import { toast } from 'react-hot-toast'
import { addCategory } from '@/serverFunctions/handleCategories';
import { addSuggestion } from '@/serverFunctions/handleSuggestions';
import { useSession, signIn } from "next-auth/react"
import DisplayNotSignedIn from '@/components/displayNotSignedIn/DisplayNotSignedIn';

export default function Page({ searchParams }: { searchParams: { type: string } }) {
    type formInputType = {
        userId: string | null;
        type: suggestionType | null;
        suggestion: string;
    }

    const [initialForm, initialFormSet] = useState<formInputType>({
        userId: null,
        type: null,
        suggestion: "",
    })
    const [formObj, formObjSet] = useState({ ...initialForm })
    const [formErrors, formErrorsSet] = useState<{ [key: string]: string | null }>({})
    const { data: session } = useSession()

    //add user id to formobj
    useEffect(() => {
        if (!session) return

        formObjSet(prevObj => {
            const newObj = { ...prevObj }
            newObj.userId = session.user.id
            return newObj
        })
    }, [session])

    //check for searchParams
    useEffect(() => {
        if (searchParams.type === undefined) return
        const seenFromSearchParams = searchParams.type.toLowerCase()
        const seenTheme: suggestionType | null = seenFromSearchParams === "category" ? "category" : seenFromSearchParams === "theme" ? "theme" : seenFromSearchParams === "prop" ? "prop" : null
        if (seenTheme !== null) {
            formObjSet(prevObj => {
                const newObj = { ...prevObj }
                newObj.type = seenTheme
                return newObj
            })
        }
    }, [])
    if (!session) {
        return (
            <DisplayNotSignedIn text='Please sign in to add suggestions' />
        )
    }

    function checkIfValid(seenFormObj: formInputType, seenName: keyof formInputType) {
        // @ts-ignore
        const testSchema = newSuggestionsSchema.pick({ [seenName]: true }).safeParse(seenFormObj);

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
        try {
            if (!wantsToSubmit) return

            if (!formObj.type || !formObj.userId) return

            const finalObj: newSuggestion = { ...formObj, userId: formObj.userId, type: formObj.type }

            if (!newSuggestionsSchema.safeParse(finalObj).success) return

            await addSuggestion(finalObj)

            toast.success(`${finalObj.type} suggestion submitted`)

            formObjSet({ ...initialForm })

        } catch (error) {
            console.log(`$error adding suggestion`, error);
        }
    };

    return (
        <main style={{ display: "grid" }}>
            <form action={() => { }} className={styles.form}>
                {formObj.type === "category" ? (
                    <div>
                        <label htmlFor="suggestion">Make a suggestion for a category name - E.g Two Column Layout</label>

                        <input id="suggestion" type="text" placeholder={`what's a good Category name?`} value={formObj.suggestion}
                            onChange={(e) => {
                                formObjSet(prevObj => {
                                    const newObj = { ...prevObj }
                                    newObj.suggestion = e.target.value
                                    return newObj
                                })
                            }}
                            onBlur={() => {
                                checkIfValid(formObj, "suggestion")
                            }} />

                        {formErrors["suggestion"] && (<p style={{ fontSize: "var(--smallFontSize)" }}>{formErrors["suggestion"]}</p>
                        )}
                    </div>
                ) : (
                    <div>
                        <button className='smallButton' onClick={() => {
                            formObjSet(prevObj => {
                                const newObj = { ...prevObj }
                                newObj.type = "category"
                                return newObj
                            })
                        }}>Suggest a new Layout Category</button>
                    </div>
                )}

                {formObj.type === "prop" ? (
                    <div>
                        <label htmlFor="prop">Enter a prop definition <span style={{ fontSize: "var(--smallFontSize)", fontWeight: "normal" }}>- typescript</span></label>

                        <div style={{ display: "flex", overflowX: "auto", fontSize: "var(--smallFontSize)" }} className='noScrollBar'>
                            <span style={{ flexShrink: 0 }}>E.g {`function LinkObj(`}</span><span style={{ color: "var(--color2)", flexShrink: 0 }}>{"{ linkObj }: { linkObj: { src: string, text: string } }"}</span><span style={{ flexShrink: 0 }}>{`)`}</span>
                        </div>

                        <input id="prop" type="text" placeholder={`what's a good global prop?`} value={formObj.suggestion}
                            onChange={(e) => {
                                formObjSet(prevObj => {
                                    const newObj = { ...prevObj }
                                    newObj.suggestion = e.target.value
                                    return newObj
                                })
                            }}
                            onBlur={() => {
                                checkIfValid(formObj, "suggestion")
                            }} />

                        {formErrors["suggestion"] && (<p style={{ fontSize: "var(--smallFontSize)" }}>{formErrors["suggestion"]}</p>
                        )}
                    </div>
                ) : (
                    <div>
                        <button className='smallButton' onClick={() => {
                            formObjSet(prevObj => {
                                const newObj = { ...prevObj }
                                newObj.type = "prop"
                                return newObj
                            })
                        }}>Suggest a new Component Prop</button>
                    </div>
                )}


                {formObj.type === "theme" ? (
                    <div>
                        <label htmlFor="theme">Enter a Theme Name</label>

                        <p>E.g Modern/Playful/Corporate</p>

                        <input id="theme" type="text" placeholder={`what's a good global theme?`} value={formObj.suggestion}
                            onChange={(e) => {
                                formObjSet(prevObj => {
                                    const newObj = { ...prevObj }
                                    newObj.suggestion = e.target.value
                                    return newObj
                                })
                            }}
                            onBlur={() => {
                                checkIfValid(formObj, "suggestion")
                            }} />

                        {formErrors["suggestion"] && (<p style={{ fontSize: "var(--smallFontSize)" }}>{formErrors["suggestion"]}</p>
                        )}
                    </div>
                ) : (
                    <div>
                        <button className='smallButton' onClick={() => {
                            formObjSet(prevObj => {
                                const newObj = { ...prevObj }
                                newObj.type = "theme"
                                return newObj
                            })
                        }}>Suggest a new Theme</button>
                    </div>
                )}

                <button className='mainButton' type="submit" onClick={() => {
                    handleSubmit(true)
                }} disabled={!newSuggestionsSchema.safeParse(formObj).success}>Submit</button>
            </form>
        </main>
    )
}
