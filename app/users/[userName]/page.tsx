import ViewUser from '@/components/users/ViewUser'
import { getSpecificUser } from '@/serverFunctions/handleUsers'
import React from 'react'

export default async function Page({ params }: { params: { userName: string } }) {
  const user = await getSpecificUser(params.userName, "username")
  if (user === undefined) return (<p>User not found</p>)

  return (
    <main>
      <ViewUser user={user} />
    </main>
  )
}
