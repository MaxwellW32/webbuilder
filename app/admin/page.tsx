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

                <section>
                    <h3>Handle Props</h3>

                    <AddOrEditProp />

                    <div style={{ display: "grid", gap: ".5rem", padding: "1rem" }}>
                        {seenProps.map(eachProp => {
                            return (
                                <AddOrEditProp key={eachProp.id} seenProp={eachProp} />
                            )
                        })}
                    </div>
                </section>
            </section>
        </main>
    )
}
