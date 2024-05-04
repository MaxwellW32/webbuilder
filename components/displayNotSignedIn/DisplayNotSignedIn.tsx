"use client"
import React from 'react'
import { signIn } from "next-auth/react"

export default function DisplayNotSignedIn({ text = "Please sign in" }: { text?: string }) {
    return (
        <div>
            <p>{text}</p>

            <button className='mainButton' onClick={() => signIn()}>Sign in</button>
        </div>
    )
}
