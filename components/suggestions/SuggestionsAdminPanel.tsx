"use client"
import { addCategory } from '@/serverFunctions/handleCategories'
import { deleteSuggestion, getSuggestions } from '@/serverFunctions/handleSuggestions'
import { suggestion } from '@/types'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import Moment from 'react-moment'
import AddOrEditProp from '../props/AddOrEditProp'
import { addTheme } from '@/serverFunctions/handleThemes'

export default function SuggestionsAdminPanel() {
    const [suggestions, suggestionsSet] = useState<suggestion[]>()
    const [startUsingThisView, startUsingThisViewSet] = useState(false)
    const [viewingMoreInfoForProps, viewingMoreInfoForPropsSet] = useState<{ [key: string]: boolean }>({})

    //load up search
    useEffect(() => {
        if (!startUsingThisView) return

        handleSearch()
    }, [startUsingThisView])

    async function handleSearch() {
        suggestionsSet(await getSuggestions())
    }

    function handleSubmit(option: "accept" | "deny", passedSuggestion: suggestion) {
        if (passedSuggestion.type === "category") {
            if (option === "accept") {
                //accept
                addCategory({ name: passedSuggestion.suggestion })

                deleteSuggestion({ id: passedSuggestion.id })

                toast.success("category accepted")

            } else {
                //deny
                handleDelete()
            }
        } else if (passedSuggestion.type === "prop") {
            if (option === "accept") {
                //accept

                //turn back viewing more to false
                if (viewingMoreInfoForProps[passedSuggestion.id]) {
                    viewingMoreInfoForPropsSet(prevObj => {
                        const newObj = { ...prevObj }
                        newObj[passedSuggestion.id] = false
                        return newObj
                    })
                }

                deleteSuggestion({ id: passedSuggestion.id })

                toast.success("prop accepted")

            } else {
                handleDelete()
            }

        } else if (passedSuggestion.type === "theme") {
            if (option === "accept") {
                //accept
                addTheme({ name: passedSuggestion.suggestion })

                deleteSuggestion({ id: passedSuggestion.id })

                toast.success("theme accepted")

            } else {
                //deny
                handleDelete()
            }
        }
    }

    async function handleDelete() {
        //notify user were denied
    }

    return (
        <div style={{ display: "grid", gap: "1rem" }}>
            {!startUsingThisView ? (
                <>
                    <h2>Search User Suggestions</h2>

                    <button className='mainButton' onClick={() => startUsingThisViewSet(true)}>Search</button>
                </>
            ) : (
                <>
                    {suggestions === undefined ? (
                        <p>Loading...</p>
                    ) : suggestions.length > 0 ? (
                        <>
                            <h2>Suggestions seen</h2>

                            <div style={{ display: "grid", gap: "1rem" }}>
                                {suggestions.map((eachSuggestion, eachSuggestionIndex) => {
                                    return (
                                        <div key={eachSuggestion.id} style={{ display: "grid", gap: "1rem", backgroundColor: "var(--color1)", padding: "1rem" }}>
                                            <h3 style={{ textTransform: "capitalize" }}>Suggesting A {eachSuggestion.type}</h3>

                                            <textarea rows={5} style={{ padding: "1rem", backgroundColor: "var(--color3)", color: "#fff" }}
                                                onChange={(e) => {
                                                    suggestionsSet(prevSuggestions => {
                                                        if (prevSuggestions === undefined) return prevSuggestions

                                                        const newSuggestions = [...prevSuggestions]
                                                        newSuggestions[eachSuggestionIndex].suggestion = e.target.value

                                                        return newSuggestions
                                                    })
                                                }}>{eachSuggestion.suggestion}</textarea>

                                            <p><Moment calendar>{eachSuggestion.datePosted}</Moment></p>

                                            {viewingMoreInfoForProps[eachSuggestion.id] && (
                                                <AddOrEditProp />
                                            )}

                                            <div style={{ display: "flex", flexWrap: "wrap", gap: ".5rem", justifySelf: "center", alignItems: "center" }}>
                                                <button className='mainButton' onClick={() => handleSubmit("accept", eachSuggestion)}>Approve</button>

                                                <button className='smallButton' onClick={() => handleSubmit("deny", eachSuggestion)}>Deny</button>

                                                {eachSuggestion.type === "prop" && (
                                                    <button className='smallButton' onClick={() => viewingMoreInfoForPropsSet(prevObj => {
                                                        const newObj = { ...prevObj }
                                                        newObj[eachSuggestion.id] = true
                                                        return newObj
                                                    })}>Add Info</button>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            <button style={{ marginTop: "1rem" }} className='mainButton' onClick={handleSearch}>Search Again</button>
                        </>
                    ) : (
                        <>
                            <button className='smallButton' onClick={handleSearch}> No Suggestions - retry?</button>
                        </>
                    )}
                </>
            )}
        </div>
    )
}
