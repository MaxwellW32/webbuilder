"use client"

import { useAtom } from "jotai"
import { screenSizeGlobal } from "./globalState"
import { useEffect } from "react"


export default function AtomLoader() {
    const [screenSize, screenSizeSet] = useAtom(screenSizeGlobal)

    //handle reizing
    const findScreenSize = () => {
        // const matchPhone = window.matchMedia("(max-width: 768px)")
        let localDesktop = false
        let localTablet = false
        let localPhone = false


        if (window.innerWidth > 1023) {
            localDesktop = true
        } else if (window.innerWidth > 500) {
            localTablet = true
        } else {
            localPhone = true
        }

        let prevScreenSize = {
            desktop: false,
            tablet: false,
            phone: false
        }

        screenSizeSet(prev => {
            prevScreenSize = prev

            return prev
        })

        if (localDesktop && !prevScreenSize.desktop) {
            screenSizeSet(prev => {
                prev = { desktop: false, tablet: false, phone: false }

                prev.desktop = true
                return { ...prev }
            })
        }

        if (localTablet && !prevScreenSize.tablet) {
            screenSizeSet(prev => {
                prev = { desktop: false, tablet: false, phone: false }

                prev.tablet = true
                return { ...prev }
            })
        }

        if (localPhone && !prevScreenSize.phone) {
            screenSizeSet(prev => {
                prev = { desktop: false, tablet: false, phone: false }

                prev.phone = true
                return { ...prev }
            })
        }
    }
    useEffect(() => {
        findScreenSize()
        window.addEventListener("resize", findScreenSize)

        return () => {
            window.removeEventListener("resize", findScreenSize)
        }
    }, [])

    return null
}



