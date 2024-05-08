import UserComponentsAdminPanel from '@/components/forUserComponents/UserComponentsAdminPanel'
import { authOptions } from '@/lib/auth'
import React from 'react'
import { getServerSession } from "next-auth";
import DisplayNotSignedIn from '@/components/displayNotSignedIn/DisplayNotSignedIn';
import SuggestionsAdminPanel from '@/components/suggestions/SuggestionsAdminPanel';
import AddOrEditProp from '@/components/props/AddOrEditProp';
import { getProps } from '@/serverFunctions/handleProps';

export default async function Page() {
    //validate admin
    const session = await getServerSession(authOptions)
    if (!session) {
        return <DisplayNotSignedIn text='Plase sign in to access admin panel' />
    }

    if (session.user.role !== "admin") {
        return (
            <div><p>Need to be admin to access this page</p></div>
        )
    }

    const seenProps = await getProps()

    return (
        <main>
            <section>
                <h1>Admin Dashboard</h1>
            </section>

            <section>
                <h3>Accept requests</h3>

                <UserComponentsAdminPanel />

                <SuggestionsAdminPanel />
            </section>

            <section>
                <h3>Add to Site</h3>

                <section style={{ display: "grid", gap: "1rem" }}>
                    <h3>Handle Props</h3>

                    <AddOrEditProp />

                    <div className='noScrollBar' style={{ display: "flex", overflowX: "auto", gap: ".5rem" }}>
                        {seenProps.map(eachProp => {
                            return (
                                <div style={{ flexShrink: 0 }}>
                                    <AddOrEditProp key={eachProp.id} seenProp={eachProp} />
                                </div>
                            )
                        })}
                    </div>

                </section>
            </section>
        </main>
    )
}
