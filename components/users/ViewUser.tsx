"use client"
import ViewResizableUserComponent from '@/components/forUserComponents/ViewResizableUserComponent'
import ShowMore from '@/components/showMore/ShowMore'
import { getUserComponentsFromUser } from '@/serverFunctions/handleUserComponents'
import { getSpecificUser } from '@/serverFunctions/handleUsers'
import { user, userComponent } from '@/types'
import Link from 'next/link'
import React, { useEffect, useMemo, useState } from 'react'

export default function ViewUser({ user }: { user: user }) {
    const [viewSize, viewSizeSet] = useState<"phone" | "tablet" | "desktop">("desktop")
    const [componentsAddedByUser, componentsAddedByUserSet] = useState<userComponent[]>()

    return (
        <main style={{ display: "grid", gap: ".5rem" }}>
            {user.name && <h1>Welcome {user.name}</h1>}

            {componentsAddedByUser === undefined ? (
                <>
                    <button className='smallButton' onClick={async () => {
                        const seenComponents = await getUserComponentsFromUser({ id: user.id })
                        componentsAddedByUserSet(seenComponents)
                    }}>See Added Components</button>
                </>
            ) : componentsAddedByUser.length > 0 ? (
                <>
                    <h2>Added Components</h2>

                    <div style={{ display: "grid", gap: "1rem" }}>
                        {componentsAddedByUser.map(eachComponent => {
                            return (
                                <div key={eachComponent.id} style={{ display: "grid" }}>
                                    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center" }}>
                                        <button style={{ backgroundColor: viewSize === "phone" ? "var(--color2)" : "" }} className='smallButton' onClick={() => { viewSizeSet("phone") }}>
                                            <svg style={{ fill: "#fff" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M80 0C44.7 0 16 28.7 16 64V448c0 35.3 28.7 64 64 64H304c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H80zM192 400a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" /></svg>
                                        </button>

                                        <button style={{ backgroundColor: viewSize === "tablet" ? "var(--color2)" : "" }} className='smallButton' onClick={() => { viewSizeSet("tablet") }}>
                                            <svg style={{ fill: "#fff" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H64zM176 432h96c8.8 0 16 7.2 16 16s-7.2 16-16 16H176c-8.8 0-16-7.2-16-16s7.2-16 16-16z" /></svg>
                                        </button>

                                        <button style={{ backgroundColor: viewSize === "desktop" ? "var(--color2)" : "" }} className='smallButton' onClick={() => { viewSizeSet("desktop") }}>
                                            <svg style={{ fill: "#fff" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M64 0C28.7 0 0 28.7 0 64V352c0 35.3 28.7 64 64 64H240l-10.7 32H160c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H346.7L336 416H512c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H64zM512 64V352H64V64H512z" /></svg>
                                        </button>
                                    </div>

                                    <div style={{ display: "flex", overflowX: "auto", backgroundColor: "var(--color3)", color: "#fff" }}>
                                        <Link href={`/userComponents/edit/${eachComponent.id}`}>
                                            <button className='smallButton'>Edit</button>
                                        </Link>
                                    </div>

                                    <ViewResizableUserComponent userComponent={eachComponent} style={{ height: "200px" }} externalViewSize={viewSize} />
                                </div>
                            )
                        })}
                    </div>
                </>
            ) : (
                <>
                    <p>Nothing added just yet</p>
                </>
            )}
        </main>
    )
}
