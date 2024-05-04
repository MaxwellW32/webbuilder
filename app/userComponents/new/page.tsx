"use client"
import { addUserComponent, recreateComponentFolderStructure } from '@/serverFunctions/handleUserComponents';
import { category, collection, layout, newUserComponent, newUserComponentSchema, prop } from '@/types';
import React, { useEffect, useMemo, useState } from 'react'
import path from "path"
import styles from "./page.module.css"
import { toast } from 'react-hot-toast'
import ShowMore from '@/components/showMore/ShowMore';
import { useSession, signIn } from "next-auth/react"
import DisplayNotSignedIn from '@/components/displayNotSignedIn/DisplayNotSignedIn';
import SelectAnItemWithSearch from '@/components/SelectAnItemWithSearch';
import { getCategories, getSpecificCategory } from '@/serverFunctions/handleCategories';
import { v4 as uuidV4 } from "uuid"
import Image from "next/image"
import { getProps } from '@/serverFunctions/handleProps';
import { addPropToUserComponent } from '@/serverFunctions/handleUserComponentsToProps';

export default function Page() {
    type formInputType = {
        userId: string | null;
        categoryId: number | null;

        id: string;
        nextLayout: layout | null;
        name: string;
    }

    const [initialForm, initialFormSet] = useState<formInputType>({
        userId: null,
        categoryId: null,

        id: uuidV4(),
        nextLayout: null,
        name: ""
    })
    const [formObj, formObjSet] = useState({ ...initialForm })
    const [formErrors, formErrorsSet] = useState<{ [key: string]: string | null }>({})
    const [props, propsSet] = useState<prop[]>([])
    const { data: session } = useSession()

    //write userID
    useEffect(() => {
        if (!session) return

        formObjSet(prevObj => {
            const newObj = { ...prevObj }
            newObj.userId = session.user.id
            return newObj
        })
    }, [session])

    //get props
    useEffect(() => {
        if (!session) return

        const search = async () => {
            propsSet(await getProps())
        }
        search()
    }, [])

    const propsBeingUsed = useMemo<prop[] | null>(() => {
        if (formObj.nextLayout === null) return null

        const foundProps: prop[] = []

        formObj.nextLayout.collection.forEach(eachCollection => {
            if (eachCollection.relativePath === formObj.nextLayout!.mainFileName) {

                props.forEach(eachProp => {
                    if (eachCollection.content.includes(eachProp.name)) {
                        foundProps.push(eachProp)
                    }
                })
            }
        })

        return foundProps

    }, [formObj.nextLayout?.mainFileName, props])

    if (!session) {
        return (
            <DisplayNotSignedIn text='Plase sign in to add Components' />
        )
    }

    function checkIfValid(seenFormObj: formInputType, seenName: keyof formInputType) {
        // @ts-ignore
        const testSchema = newUserComponentSchema.pick({ [seenName]: true }).safeParse(seenFormObj);

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

    async function handleSubmit(wantsToSubmit = false) {
        if (!wantsToSubmit || formObj.nextLayout === null || formObj.nextLayout.mainFileName === "" || formObj.categoryId === null || !formObj.userId) return

        const finalObj: newUserComponent = { ...formObj, userId: formObj.userId, categoryId: formObj.categoryId }

        if (!newUserComponentSchema.safeParse(finalObj).success) return

        try {
            const seenAddedUserComponent = await addUserComponent(finalObj)

            //add possible props to many many table
            if (propsBeingUsed) {
                await Promise.all(propsBeingUsed.map(async eachProp => {
                    return await addPropToUserComponent({ id: eachProp.id }, { id: seenAddedUserComponent.id })
                }))

                console.log(`$added props to component`);
            }

            formObjSet({ ...initialForm })

            toast.success("submitted for review")
        } catch (error) {
            console.log(`$error adding userComponent`, error);
        }
    };


    return (
        <main style={{ display: "grid" }}>
            <section>
                <h1>Upload a component</h1>
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
                    <>
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

                        {propsBeingUsed && propsBeingUsed.length > 0 && (
                            <div>
                                <label htmlFor="propsUsed">Global Props seen in default/main component</label>

                                <div style={{ display: "flex", flexWrap: "wrap", gap: ".5rem" }}>
                                    {propsBeingUsed.map(eachProp => {
                                        return (
                                            <div key={eachProp.id} style={{ fontWeight: "bold" }}>{eachProp.name}</div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {formObj.nextLayout.mainFileName && (propsBeingUsed === null || propsBeingUsed.length === 0) && (
                            <div>
                                <p>Not seeing any global props in component</p>

                                <p>We suggest using global props so users can live edit your component</p>

                                <p>See global props below</p>
                            </div>
                        )}
                    </>
                )}

                <div>
                    <SelectAnItemWithSearch
                        labelText={["Choose a layout category for this component", "layout category chosen"]}

                        displaySearchResultFunction={(seenObj) => {
                            return <div>{seenObj.name}</div>
                        }}

                        chosenItemSetterFunction={(seenObj) => {
                            formObjSet(prevObj => {
                                const newObj = { ...prevObj }
                                newObj.categoryId = seenObj.id
                                return newObj
                            })
                        }}

                        genralSearchFunction={getCategories}

                        specificSearchFunction={(search: string) => {
                            return getSpecificCategory({ usingId: false, search: search })
                        }}

                        findMoreButton={{
                            text: "Suggest Some Categories",
                            link: '/suggestions'
                        }}
                    />
                </div>

                <button className='mainButton' type="submit" onClick={() => handleSubmit(true)} disabled={!newUserComponentSchema.safeParse(formObj).success}>Submit</button>
            </form>

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
                            rule: "Ensure your component isn't influenced by global styles - all styling should come from inline styles / module.css files"
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
                <p>Use these props in your component so users can live preview your component</p>
                <p>Feel free to add a prop for future components</p>

                <ul className='noScrollBar' style={{ marginTop: "1rem", display: "flex", overflowX: "auto", gap: "1rem", }}>
                    {props.map((eachProp, eachPropIndex) => {
                        return (
                            <li key={eachPropIndex} style={{ display: "grid", alignContent: "flex-start", gap: ".5rem", position: "relative", flex: "1 0 auto" }}>
                                <p style={{ fontWeight: "bold" }}>{eachProp.name}</p>

                                <ShowMore svgColor='#000' label="More Info" content={
                                    <>
                                        <p>{eachProp.explanation}</p>

                                        <div className='smallButtonLink' style={{}} onClick={() => {
                                            navigator.clipboard.writeText(eachProp.typeScriptDefinition);

                                            toast.success("copied!")
                                        }}>
                                            <p>Copy typescript definition</p>

                                            <button>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M208 0H332.1c12.7 0 24.9 5.1 33.9 14.1l67.9 67.9c9 9 14.1 21.2 14.1 33.9V336c0 26.5-21.5 48-48 48H208c-26.5 0-48-21.5-48-48V48c0-26.5 21.5-48 48-48zM48 128h80v64H64V448H256V416h64v48c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V176c0-26.5 21.5-48 48-48z" /></svg>
                                            </button>
                                        </div>

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
        </main>
    )
}
