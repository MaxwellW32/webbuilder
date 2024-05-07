"use client"
import React, { useState } from 'react'
import { useAtom } from 'jotai'
import MainNav1 from './mainnav1/MainNav1'
import { defaultImage, screenSizeGlobal } from '@/utility/globalState'
import { user } from '@/types'
import Link from 'next/link'
import Image from 'next/image'
import { signIn, signOut } from 'next-auth/react'

export default function NavClientWrapper({ user }: { user: user | undefined }) {
  const [screenSize] = useAtom(screenSizeGlobal)
  const [showingMore, showingMoreSet] = useState(false)

  return (
    <MainNav1
      navColors={{ primaryColor: "var(--color1)", secondaryColor: "var(--color3)" }}
      menuInfoArr={[
        {
          title: "Home",
          link: "/",
        },
        {
          title: "Sketch",
          link: "/sketch",
        },
        {
          title: "Add",
          link: "--",
          subMenu: [
            {
              link: "/userComponents/new",
              title: "Component"
            },
            {
              link: "/suggestions",
              title: "Suggestion"
            }
          ]
        }
      ]}

      themeSwitcherEl={(
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {user ? (
            <div style={{ position: "relative" }}>
              <div style={{ display: "grid", gridTemplateColumns: "auto auto auto", gap: ".3rem", alignItems: "center", cursor: "pointer" }} onClick={() => showingMoreSet(prev => !prev)}>
                <Link onClick={(e) => e.stopPropagation()} href={`/users/${user.userName}`}>
                  <Image alt='profile image' src={user.image ?? defaultImage} width={30} height={30} className='profileImage' />
                </Link>

                {!screenSize.phone && user.name && <p>{user.name}</p>}

                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
              </div>

              {showingMore && (
                <div onClick={() => showingMoreSet(false)} style={{ position: "fixed", top: 0, left: 0, bottom: 0, right: 0, backgroundColor: "rgba(0,0,0,0.3)", width: "100vw", height: "100vh" }}>
                  <ul style={{ position: "absolute", backgroundColor: "var(--color3)", width: "min(200px, 50vw)", right: 0, top: "3.5rem", padding: "1rem", display: "grid", gap: "1rem" }} onClick={() => showingMoreSet(false)}>
                    <button className='smallButton' onClick={() => { signOut() }}>Sign Out</button>

                    <Link style={{ display: "flex", cursor: "pointer", alignItems: 'center', gap: ".3rem" }} href={`/users/${user.userName}`}>
                      Profile

                      <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path d="M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464H398.7c-8.9-63.3-63.3-112-129-112H178.3c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3z" /></svg>
                    </Link>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <button onClick={() => { signIn() }}>Sign In</button>
          )}

          {/* <svg style={{ height: "1rem" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M361.5 1.2c5 2.1 8.6 6.6 9.6 11.9L391 121l107.9 19.8c5.3 1 9.8 4.6 11.9 9.6s1.5 10.7-1.6 15.2L446.9 256l62.3 90.3c3.1 4.5 3.7 10.2 1.6 15.2s-6.6 8.6-11.9 9.6L391 391 371.1 498.9c-1 5.3-4.6 9.8-9.6 11.9s-10.7 1.5-15.2-1.6L256 446.9l-90.3 62.3c-4.5 3.1-10.2 3.7-15.2 1.6s-8.6-6.6-9.6-11.9L121 391 13.1 371.1c-5.3-1-9.8-4.6-11.9-9.6s-1.5-10.7 1.6-15.2L65.1 256 2.8 165.7c-3.1-4.5-3.7-10.2-1.6-15.2s6.6-8.6 11.9-9.6L121 121 140.9 13.1c1-5.3 4.6-9.8 9.6-11.9s10.7-1.5 15.2 1.6L256 65.1 346.3 2.8c4.5-3.1 10.2-3.7 15.2-1.6zM160 256a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zm224 0a128 128 0 1 0 -256 0 128 128 0 1 0 256 0z" /></svg> */}
        </div>
      )}

      mobileNavButtonEl={<svg style={{ margin: "0 auto", height: "1rem" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z" /></svg>}

      navSize={screenSize}
    />
  )
}
