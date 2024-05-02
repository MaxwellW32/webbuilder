import UserComponentsAdminPanel from '@/components/forUserComponents/UserComponentsAdminPanel'
import React from 'react'

export default function Page() {
    //validate admin

    return (
        <main>
            <section>
                <h1>Admin Dashboard</h1>
            </section>

            <section>
                <UserComponentsAdminPanel />
            </section>
        </main>
    )
}
