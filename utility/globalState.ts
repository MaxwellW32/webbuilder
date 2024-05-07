import { atom, useAtom } from 'jotai'

export const screenSizeGlobal = atom<{
    desktop: boolean
    tablet: boolean,
    phone: boolean
}>({
    desktop: false,
    tablet: false,
    phone: false
});

export const themeGlobal = atom<boolean | undefined>(undefined);


export const defaultImage = "https://images.pexels.com/photos/264907/pexels-photo-264907.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"

export const websiteUrl = process.env.NEXT_PUBLIC_IN_DEVELOPMENT === undefined ? "https://reactwebbuilder.vercel.app" : "http://localhost:3000"
