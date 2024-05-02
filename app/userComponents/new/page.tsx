"use client"
import { addUserComponent, recreateComponentFolderStructure } from '@/serverFunctions/handleUserComponents';
import { collection, layout, newComponent, newComponentSchema } from '@/types';
import React, { useState } from 'react'
import path from "path"
import styles from "./page.module.css"
import { toast } from 'react-hot-toast'
import ShowMore from '@/components/showMore/ShowMore';

export default function Page() {
    const [initialForm, initialFormSet] = useState<newComponent>({
        id: "999",//dummy data
        userId: 1,//dummy data

        categoryId: 1,//dummy data
        nextLayout: null,
        name: ""
    })
    const [formObj, formObjSet] = useState({ ...initialForm })
    const [formErrors, formErrorsSet] = useState<{ [key: string]: string | null }>({})

    function checkIfValid(seenFormObj: newComponent, seenName: keyof newComponent) {
        // @ts-ignore
        const testSchema = newComponentSchema.pick({ [seenName]: true }).safeParse(seenFormObj);

        if (testSchema.success) {//worked
            formErrorsSet(prevObj => {
                const newObj = { ...prevObj }
                //@ts-ignore
                newObj[seenName] = null

                return newObj
            })

        } else {
            formErrorsSet(prevObj => {
                const newObj = { ...prevObj }

                let errorMessage = ""

                //@ts-ignore
                JSON.parse(testSchema.error.message).forEach(eachErrorObj => {
                    errorMessage += eachErrorObj.message
                })

                //@ts-ignore
                newObj[seenName] = errorMessage

                return newObj
            })
        }
    }


    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const files = e.target.files;
        if (!files || files.length < 1) return

        console.log(`$files`, files);

        const newCollection: collection[] = []

        await Promise.all(
            new Array(files.length).fill("").map(async (each, eachIndex) => {
                const file = files[eachIndex];

                const fileContent = await file.text()

                // console.log(`$fileContent`, fileContent);
                newCollection[eachIndex] = { ...newCollection[eachIndex], content: fileContent }

                //add relativepath to collection
                newCollection[eachIndex] = { ...newCollection[eachIndex], relativePath: file.webkitRelativePath }

                return fileContent
            })
        )

        formObjSet(prevObj => {
            const newObj = { ...prevObj }

            if (newObj.nextLayout === null) {//do nothing
                newObj.nextLayout = {
                    mainFileName: "",
                    collection: newCollection
                }

                return newObj

            } else {
                newObj.nextLayout.collection = newCollection
                return newObj
            }
        })
    };

    async function handleSubmit() {
        if (formObj.nextLayout === null || formObj.nextLayout.mainFileName === "" || !newComponentSchema.safeParse(formObj).success) return

        try {
            await addUserComponent(formObj)

            toast.success("submitted for review")
        } catch (error) {

        }
    };

    return (
        <main style={{ display: "grid" }}>
            <section>
                <h1>Upload a component</h1>
            </section>

            <section>
                <h3>Rules When Uploading</h3>

                <ul style={{ display: "grid", maxHeight: "150px", overflowY: "auto" }}>
                    {[
                        {
                            rule: "Native Next JS imports only - E.g Image/Link - No external libraries"
                        },
                        {
                            rule: "Import related components/styles locally E.g `./SecondComponent.tsx`"
                        },
                        {
                            rule: "Your component must be be resizable for all screen sizes - Desktop, Tablet, Mobile"
                        },

                    ].map((eachRule, eachRuleIndex) => {
                        return (
                            <li key={eachRuleIndex}>{eachRule.rule}</li>
                        )
                    })}
                </ul>
            </section>

            <section style={{ display: "grid" }}>
                <h3>Expected Props</h3>
                <p>Use these props so users can preview your component</p>
                <p>Feel free to add a prop for future components</p>

                <ul className='noScrollBar' style={{ marginTop: "1rem", display: "flex", overflowX: "auto", gap: "1rem", }}>
                    {[
                        {
                            prop: "text",
                            reason: "Allows text into a paragraph or link",
                            example: `export default function Text({ text }: { text: string }) {
                                return (
                                    <div>
                                        <p>{text}</p>
                                    </div>
                                )
                            }`
                        },
                        {
                            prop: "textArr",
                            reason: "A collection of text elements",
                            example: `export default function TextArr({ textArr }: { textArr: string[] }) {
                                return (
                                    <div>
                                        {textArr.map((eachText, eachTextIndex) => {
                                            return (
                                                <p key={eachTextIndex}>{eachText}</p>
                                            )
                                        })}
                                    </div>
                                )
                            }
                            `
                        },
                        {
                            prop: "link",
                            reason: "Allows a src for a link or button",
                            example: `import React from "react"
                            import Link from "next/link"
                            
                            export default function LinkExample({ link }: { link: { src: string, text: string } }) {
                                return (
                                    <div>
                                        <Link href={link.src}>
                                            <button>{link.text}</button>
                                        </Link>
                                    </div>
                                )
                            }`
                        },
                        {
                            prop: "linkArr",
                            reason: "A collection of link elements",
                            example: `import React from "react"
                            import Link from "next/link"
                            
                            export default function LinkArr({ linkArr }: { linkArr: { src: string, text: string }[] }) {
                                return (
                                    <div>
                                        {linkArr.map((eachLink, eachLinkIndex) => {
                                            return (
                                                <Link href={eachLink.src}>
                                                    <button>{eachLink.text}</button>
                                                </Link>
                                            )
                                        })}
                                    </div>
                                )
                            }
                            `
                        },
                        {
                            prop: "imageObj",
                            reason: "Alt, Src, and Dimension for an image",
                            example: `import Image from "next/image";

                            export default function ImageObj({ imageObj }: { imageObj: {alt: string, src: string, width: number, height: number}}) {
                                return (
                                    <div>
                                        <Image alt={imageObj.alt} src={imageObj.src} width={imageObj.width} height={imageObj.height}/>
                                    </div>
                                )
                            }`
                        },
                        {
                            prop: "imageObjArr",
                            reason: "A collection of Image Objects",
                            example: `import Image from "next/image";

                            export default function ImageObjArr({ imageObjArr }: { imageObjArr: { alt: string, src: string, width: number, height: number }[] }) {
                                return (
                                    <div>
                                        {imageObjArr.map((eachImage, eachImageIndex) => {
                                            return (
                                                <Image key={eachImageIndex} alt={eachImage.alt} src={eachImage.src} width={eachImage.width} height={eachImage.height} />
                                            )
                                        })}
                                    </div>
                                )
                            }`
                        },
                        {
                            prop: "element",
                            reason: "A component/JSX.element",
                            example: `import Image from "next/image";

                            export default function Element({ element }: { element: JSX.Element}) {
                                return (
                                    <div>
                                       {element}
                                    </div>
                                )
                            }`
                        },
                        {
                            prop: "elementArr",
                            reason: "A collection of elements",
                            example: `import React from "react"

                            export default function ElementArr({ elementArr }: { elementArr: JSX.Element[] }) {
                                return (
                                    <div>
                                        {elementArr.map((eachElement, eachElementIndex) => {
                                            return (
                                                <React.Fragment key={eachElementIndex} >
                                                    {eachElement}
                                                </React.Fragment>
                                            )
                                        })}
                                    </div>
                                )
                            }
                            `
                        },
                        {
                            prop: "children",
                            reason: "Pass all children through the component",
                            example: `export default function Children({ children }: { children: React.ReactNode }) {
                                return (
                                    <div>
                                        {children}
                                    </div>
                                )
                            }
                            `
                        },
                        {
                            prop: "navObj",
                            reason: "An object containing the menus, submenus and graphics needed for the nav",
                            example: `import Link from "next/link"
                            import styles from "./navObj.module.css"
                            
                            type navObj = {
                                logo: JSX.Element,
                                navButton: JSX.Element,
                                menuGraphic: JSX.Element,
                                menuItems: menuItem[]
                            }
                            
                            type menuItem = {
                                title: string,
                                link: string
                                subMenu?: subMenuItem[]
                            }
                            
                            type subMenuItem = {
                                title: string,
                                link: string,
                                subSubMenu?: subSubMenuItem[]
                            }
                            
                            type subSubMenuItem = {
                                title: string,
                                link: string
                            }
                            
                            const navObjExample: navObj = {
                                logo: <></>,
                                menuGraphic: <></>, //chevrons
                                navButton: <></>,
                                menuItems: [
                                    {
                                        title: "home",
                                        link: "/",
                                        subMenu: [
                                            {
                                                title: "about me",
                                                link: "/aboutMe",
                                                subSubMenu: [
                                                    {
                                                        title: "education",
                                                        link: "/education"
                                                    },
                                                ]
                                            },
                                        ]
                                    }
                                ]
                            }
                            
                            export default function NavObj({ navObj }: { navObj: navObj }) {
                                return (
                                    <nav>
                                        {navObj.logo}
                            
                                        <ul className={styles.menu}>
                                            {navObj.menuItems.map((eachMenuItem, eachMenuItemIndex) => {
                                                return (
                                                    <li key={eachMenuItemIndex}>
                                                        <Link href={eachMenuItem.link}>{eachMenuItem.title}</Link> {navObj.menuGraphic}
                            
                                                        <ul className={styles.subMenu}>
                                                            {eachMenuItem.subMenu?.map((eachSubmenuItem, eachSubmenuItemIndex) => {
                                                                return (
                                                                    <li key={eachSubmenuItemIndex}>
                                                                        <Link href={eachSubmenuItem.link}>{eachSubmenuItem.title}</Link> {navObj.menuGraphic}
                            
                                                                        <ul className={styles.subSubMenu}>
                                                                            {eachSubmenuItem.subSubMenu?.map((eachSubSubMenuItem, eachSubSubMenuItemIndex) => {
                                                                                return (
                                                                                    <li key={eachSubSubMenuItemIndex}>
                                                                                        <Link href={eachSubSubMenuItem.link}>{eachSubSubMenuItem.title}</Link> {navObj.menuGraphic}
                                                                                    </li>
                                                                                )
                                                                            })}
                                                                        </ul>
                                                                    </li>
                                                                )
                                                            })}
                                                        </ul>
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    </nav>
                                )
                            }
                            `
                        },
                    ].map((eachProp, eachPropIndex) => {
                        return (
                            <li key={eachPropIndex} style={{ display: "grid", alignContent: "flex-start", gap: ".5rem", position: "relative", flex: "1 0 auto" }}>
                                <p style={{ fontWeight: "bold" }}>{eachProp.prop}</p>

                                <ShowMore svgColor='#000' label="More Info" content={
                                    <>
                                        <p>{eachProp.reason}</p>

                                        <ShowMore svgColor='#000' label="example" wantsToShowAll={true} content={
                                            <p style={{ padding: "1rem", backgroundColor: "#000", color: "#fff", whiteSpace: "pre-wrap" }}>{eachProp.example}</p>
                                        } />
                                    </>
                                } />
                            </li>
                        )
                    })}
                </ul>
            </section>

            <form action={() => { }} className={styles.form}>
                <div>
                    <label htmlFor="name">Enter a unique name for this component</label>

                    <input id="name" type="text" placeholder={`what's a good project name?`} value={formObj.name}
                        onChange={(e) => {
                            formObjSet(prevObj => {
                                const newObj = { ...prevObj }
                                newObj.name = e.target.value
                                return newObj
                            })
                        }}
                        onBlur={() => {
                            checkIfValid(formObj, "name")
                        }} />

                    {formErrors["name"] && (<p style={{ fontSize: "var(--smallFontSize)" }}>{formErrors["name"]}</p>
                    )}
                </div>

                <div>
                    <label>Upload the folder containing your component</label>

                    <label htmlFor="fileUpload" className='mainButton' style={{ justifySelf: "flex-start" }}>
                        Upload
                    </label>

                    {/* @ts-ignore */}
                    <input id="fileUpload" type="file" directory="" webkitdirectory="" onChange={handleFileChange} hidden={true} />
                </div>

                {formObj.nextLayout && (
                    <div>
                        <label htmlFor="mainFile">Choose the default/main component</label>

                        <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
                            {formObj.nextLayout.collection.map((eachCollection, eachCollectionIndex) => {
                                return (
                                    <button className='smallButton' key={eachCollectionIndex} style={{ backgroundColor: eachCollection.relativePath === formObj.nextLayout!.mainFileName ? "#000" : "" }} onClick={() => {
                                        formObjSet(prevObj => {
                                            const newObj = { ...prevObj }
                                            if (newObj.nextLayout === null) {
                                                return prevObj
                                            } else {
                                                newObj.nextLayout.mainFileName = eachCollection.relativePath
                                            }

                                            return newObj
                                        })
                                    }}>{path.basename(eachCollection.relativePath)}</button>
                                )
                            })}
                        </div>
                    </div>
                )}

                <button className='mainButton' type="submit" onClick={handleSubmit} disabled={!newComponentSchema.safeParse(formObj).success}>Submit</button>
            </form>
        </main>
    )
}
