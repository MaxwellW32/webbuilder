"use client"
import { addCategory } from '@/serverFunctions/handleCategories'
import { deleteSuggestion, getSuggestions } from '@/serverFunctions/handleSuggestions'
import { suggestion } from '@/types'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'

export default function SuggestionsAdminPanel() {
    const [suggestions, suggestionsSet] = useState<suggestion[]>([])
    const [startUsingThisView, startUsingThisViewSet] = useState(false)

    //load up search
    useEffect(() => {
        if (!startUsingThisView) return

        async function runSearch() {
            suggestionsSet(await getSuggestions())
        }
        runSearch()

    }, [startUsingThisView])

    function handleSubmit(option: "accept" | "deny", passedSuggestion: suggestion) {
        if (option === "deny") {
            //email user they got rejected

        } else {
            //accept
            addCategory({ name: passedSuggestion.suggestion })

            deleteSuggestion({ id: passedSuggestion.id })

            toast.success("category accepted")
        }
    }

    return (
        <div style={{ display: "grid" }}>
            {!startUsingThisView ? (
                <>
                    <h2>Search User Suggestions</h2>

                    <button className='mainButton' onClick={() => startUsingThisViewSet(true)}>Search</button>
                </>
            ) : (
                <>
                    <div>
                        <h3>Suggestion Names</h3>

                        <div style={{ display: "grid", gap: "1rem" }}>
                            {suggestions.map(eachSuggestion => {
                                return (
                                    <div key={eachSuggestion.id} style={{ display: "grid", gap: "1rem", }}>
                                        <p style={{ padding: "1rem", backgroundColor: "var(--gray2)" }}>{eachSuggestion.suggestion}</p>

                                        <div style={{ display: "flex", flexWrap: "wrap", gap: ".5rem", justifySelf: "center", alignItems: "center" }}>
                                            <button className='mainButton' style={{ backgroundColor: "var(--successColor)" }} onClick={() => handleSubmit("accept", eachSuggestion)}>Approve</button>
                                            <button className='closeButton' onClick={() => handleSubmit("deny", eachSuggestion)}>Deny</button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
