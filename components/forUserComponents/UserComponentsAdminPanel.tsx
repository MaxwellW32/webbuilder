"use client"
import { acceptUserComponent, getUserComponents } from '@/serverFunctions/handleUserComponents'
import { userComponent } from '@/types'
import React, { useEffect, useState } from 'react'
import path from "path"
import { toast } from 'react-hot-toast'

export default function UserComponentsAdminPanel() {
    const [unnaprovedUserComponents, unnaprovedUserComponentsSet] = useState<userComponent[]>([])
    const [startUsingThisView, startUsingThisViewSet] = useState(false)

    useEffect(() => {
        if (!startUsingThisView) return

        async function runSearch() {
            unnaprovedUserComponentsSet(await getUserComponents(true))
        }
        runSearch()

    }, [startUsingThisView])

    function handleSubmit(option: "accept" | "deny", passedUserComponent: userComponent) {
        if (option === "deny") {
            //email user they got rejected

        } else {
            //accept
            acceptUserComponent(passedUserComponent)

            toast.success("accepted")
        }
    }

    return (
        <div style={{ display: "grid" }}>
            {!startUsingThisView ? (
                <>
                    <h2>Search Unnaproved Components</h2>

                    <button className='mainButton' onClick={() => startUsingThisViewSet(true)}>Search</button>
                </>
            ) : (
                <>
                    <div style={{ display: "grid", gap: "1rem" }}>
                        {unnaprovedUserComponents.map(eachUserComponent => {
                            return (
                                <div key={eachUserComponent.id} style={{ display: "grid", gap: "1rem", backgroundColor: "var(--gray2)", paddingBottom: "1rem" }}>
                                    {eachUserComponent.nextLayout!.collection.map((eachCollection, eachCollectionIndex) => {
                                        return (
                                            <div key={eachCollectionIndex} style={{ color: "#fff", }}>
                                                <p style={{ padding: "1rem", textAlign: 'center', backgroundColor: "var(--secondaryColor)" }}>{path.basename(eachCollection.relativePath)}</p>

                                                <div style={{ backgroundColor: "#000", padding: "1rem", whiteSpace: 'pre-wrap' }}>
                                                    {eachCollection.content}
                                                </div>
                                            </div>
                                        )
                                    })}

                                    <div style={{ display: "flex", flexWrap: "wrap", gap: ".5rem", justifySelf: "center", alignItems: "center" }}>
                                        <button className='mainButton' style={{ backgroundColor: "var(--successColor)" }} onClick={() => handleSubmit("accept", eachUserComponent)}>Approve</button>
                                        <button className='closeButton' onClick={() => handleSubmit("deny", eachUserComponent)}>Deny</button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </>
            )}
        </div>
    )
}
