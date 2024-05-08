"use client"
import { addUserComponent, deleteUserComponent, removeIdFromGlobalComponentsFile, updateUserComponent } from '@/serverFunctions/handleUserComponents';
import { category, collection, layout, newUserComponent, newUserComponentSchema, prop, theme, userComponent, userComponentSchema } from '@/types';
import React, { useEffect, useMemo, useState } from 'react'
import path from "path"
import styles from "./addUserComponent.module.css"
import { toast } from 'react-hot-toast'
import ShowMore from '@/components/showMore/ShowMore';
import { useSession, signIn } from "next-auth/react"
import DisplayNotSignedIn from '@/components/displayNotSignedIn/DisplayNotSignedIn';
import SelectAnItemWithSearch from '@/components/SelectAnItemWithSearch';
import { getCategories, getSpecificCategory } from '@/serverFunctions/handleCategories';
import { v4 as uuidV4 } from "uuid"
import { getProps } from '@/serverFunctions/handleProps';
import { addPropToUserComponent, getPropsFromUserComponent, removePropFromUserComponent } from '@/serverFunctions/handleUserComponentsToProps';
import { addThemeToUserComponent, getThemesFromUserComponent, removeThemeFromUserComponent } from '@/serverFunctions/handleUserComponentsToThemes';
import { deleteDirectory } from '@/serverFunctions/handleFiles';
import { getSpecificTheme, getThemes } from '@/serverFunctions/handleThemes';
import { useRouter } from 'next/navigation';

export default function AddEditUserComponent({ passedUserComponent }: { passedUserComponent?: userComponent }) {
    const [initialForm,] = useState<newUserComponent | userComponent>(passedUserComponent ? { ...passedUserComponent } : {
        id: uuidV4(),
        userId: "",
        categoryId: Infinity,
        name: "",
        nextLayout: null,
    })
    const [formObj, formObjSet] = useState({ ...initialForm })

    const router = useRouter()

    const [formErrors, formErrorsSet] = useState<{ [key: string]: string | null }>({})
    const [userEdited, userEditedSet] = useState<{ [key: string]: boolean }>({})

    const [userWantsToDelete, userWantsToDeleteSet] = useState(false)

    const [props, propsSet] = useState<prop[]>([])

    const [themesBeingUsed, themesBeingUsedSet] = useState<theme[]>([])

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

    //load props and themes / old themes being used from server
    useEffect(() => {
        if (!session) return

        const search = async () => {
            propsSet(await getProps())

            //get current themes from server
            if (passedUserComponent !== undefined) {
                const userComponentsToThemes = await getThemesFromUserComponent({ id: formObj.id })

                const seenThemes: theme[] = []
                userComponentsToThemes.forEach(userComponentsToTheme => {
                    if (userComponentsToTheme.theme) {
                        seenThemes.push(userComponentsToTheme.theme)
                    }
                })

                themesBeingUsedSet(seenThemes)
            }
        }
        search()
    }, [])

    const propsBeingUsed = useMemo<prop[] | null>(() => {
        if (formObj.nextLayout === null || !formObj.nextLayout.mainFileName) return null

        const foundProps: prop[] = []
        const seenMainFileName = formObj.nextLayout.mainFileName

        formObj.nextLayout.collection.forEach(eachCollection => {
            if (eachCollection.relativePath === seenMainFileName) {

                props.forEach(eachProp => {
                    const propNameRegex = new RegExp(`\\b${eachProp.name}\\b(?=\\s*\\})`);

                    if (eachCollection.content.search(propNameRegex) > 0) {
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

    function checkIfValid(seenFormObj: newUserComponent, seenName: keyof newUserComponent) {
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

        userEditedSet(prevObj => {
            const newObj = { ...prevObj }
            newObj["nextLayout"] = true
            return newObj
        })
    };

    async function handleSubmit(wantsToSubmit = false) {
        if (!wantsToSubmit || !formObj.userId) return

        if (passedUserComponent === undefined && formObj.nextLayout === null) {
            toast.error("Ensure your folder is uploaded")
            return
        }

        if (formObj.categoryId === Infinity) {
            toast.error("Please choose a layout cetegory")
            return
        }

        if ((passedUserComponent === undefined || userEdited["nextLayout"]) && formObj.nextLayout && formObj.nextLayout.mainFileName === "") {
            toast.error("Please choose the MainFile")
            return
        }

        if (passedUserComponent === undefined) {
            //new component
            if (!newUserComponentSchema.safeParse(formObj).success) return

            try {
                const addedUserComponent = await addUserComponent(formObj)

                //add possible props to many many table
                if (propsBeingUsed) {
                    await Promise.all(propsBeingUsed.map(async eachProp => {
                        return await addPropToUserComponent({ id: eachProp.id }, { id: addedUserComponent.id })
                    }))
                }

                if (themesBeingUsed.length > 0) {
                    // 
                    await Promise.all(themesBeingUsed.map(async eachTheme => {
                        return await addThemeToUserComponent({ id: eachTheme.id }, { id: addedUserComponent.id })
                    }))
                }

                formObjSet({ ...initialForm })

                toast.success("submitted for review")
            } catch (error) {
                console.log(`$error adding userComponent`, error);
            }
        } else {
            //edit

            if (!userComponentSchema.safeParse(formObj).success) return

            try {
                const changedObjectFieldsOnly: Partial<userComponent> = Object.fromEntries(Object.entries(formObj).filter(eachEntry => {
                    const seenKey = eachEntry[0]
                    const seenValue = eachEntry[1]

                    return userEdited[seenKey]
                }))

                await updateUserComponent({ ...changedObjectFieldsOnly, userId: formObj.userId, id: formObj.id })

                if (propsBeingUsed) {
                    //get props that were in use
                    const oldPropsSeen = await getPropsFromUserComponent({ id: formObj.id })

                    const newPropIdsToAdd: Pick<prop, "id">[] = []
                    const propIdsToRemove: Pick<prop, "id">[] = []

                    oldPropsSeen.forEach(eachOldProp => {//remove
                        const propWasSeen = propsBeingUsed.find(eachCurrentProp => eachCurrentProp.id === eachOldProp.propId)
                        if (propWasSeen === undefined) {
                            propIdsToRemove.push({ id: eachOldProp.propId })
                        }
                    })

                    propsBeingUsed.forEach(eachCurrentProp => {//add
                        const propWasSeen = oldPropsSeen.find(eachOldProp => eachOldProp.propId === eachCurrentProp.id)
                        if (propWasSeen === undefined) {
                            newPropIdsToAdd.push({ id: eachCurrentProp.id })
                        }
                    })

                    //add all seen
                    await Promise.all(newPropIdsToAdd.map(async eachProp => {
                        return await addPropToUserComponent({ id: eachProp.id }, { id: formObj.id })
                    }))

                    //remove all seen
                    await Promise.all(propIdsToRemove.map(async eachProp => {
                        return await removePropFromUserComponent({ id: eachProp.id }, { id: formObj.id })
                    }))
                }

                if (userEdited["themes"] && themesBeingUsed.length > 0) {
                    //get themes that were in use
                    const oldThemesFromServer = await getThemesFromUserComponent({ id: formObj.id })

                    const newThemeIdsToAdd: Pick<theme, "id">[] = []
                    const themeIdsToRemove: Pick<theme, "id">[] = []

                    oldThemesFromServer.forEach(eachOldTheme => {//remove
                        const themeWasSeen = themesBeingUsed.find(eachCurrentTheme => eachCurrentTheme.id === eachOldTheme.themeId)
                        if (themeWasSeen === undefined) {
                            themeIdsToRemove.push({ id: eachOldTheme.themeId })
                        }
                    })

                    themesBeingUsed.forEach(eachCurrentTheme => {//add
                        const themeWasSeen = oldThemesFromServer.find(eachOldTheme => eachOldTheme.themeId === eachCurrentTheme.id)
                        if (themeWasSeen === undefined) {
                            newThemeIdsToAdd.push({ id: eachCurrentTheme.id })
                        }
                    })

                    //add all seen
                    await Promise.all(newThemeIdsToAdd.map(async eachTheme => {
                        return await addThemeToUserComponent({ id: eachTheme.id }, { id: formObj.id })
                    }))

                    //remove all seen
                    await Promise.all(themeIdsToRemove.map(async eachProp => {
                        return await removeThemeFromUserComponent({ id: eachProp.id }, { id: formObj.id })
                    }))
                }

                toast.success("submitted changes for review")
            } catch (error) {
                console.log(`$error updating userComponent`, error);
            }
        }


    };

    async function handleDelete() {
        try {
            //delete all many to many tables linked to user components first props - themes
            //navigate home
            if (!session) return toast.error("no user logged in to delete")

            toast.success("deleting...")

            const currentProps = await getPropsFromUserComponent({ id: formObj.id })
            await Promise.all(currentProps.map(async eachProp => {
                return await removePropFromUserComponent({ id: eachProp.propId }, { id: formObj.id })
            }))

            const currentThemes = await getThemesFromUserComponent({ id: formObj.id })
            await Promise.all(currentThemes.map(async eachTheme => {
                return await removeThemeFromUserComponent({ id: eachTheme.themeId }, { id: formObj.id })
            }))

            await removeIdFromGlobalComponentsFile(formObj.id)

            await deleteDirectory(path.join("userComponents", formObj.id))

            await deleteUserComponent({ id: formObj.id, userId: session.user.id })

            toast.success("deleted component")

            router.push("/")

        } catch (error) {
            console.log(`$error deleteing`, error);
        }
    }


    return (
        <main style={{ display: "grid" }}>
            <section>
                <h1>{passedUserComponent ? "Edit component" : "Upload a component"}</h1>

                {passedUserComponent && (
                    <>
                        {!userWantsToDelete ? (
                            <button className='smallButton' onClick={() => {
                                userWantsToDeleteSet(true)
                            }}>Delete Component</button>
                        ) : (
                            <div>
                                <p>Confirm Deletion</p>

                                <div style={{ display: "flex", alignItems: 'center', gap: ".5rem", marginTop: ".5rem" }}>
                                    <button className='mainButton' style={{ backgroundColor: "var(--color5)" }} onClick={() => (userWantsToDeleteSet(false))}>CANCEL</button>
                                    <button className='smallButton' onClick={handleDelete}>CONFIRM</button>
                                </div>
                            </div>
                        )}
                    </>
                )}
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

                            userEditedSet(prevObj => {
                                const newObj = { ...prevObj }
                                newObj["name"] = true
                                return newObj
                            })
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
                                        <button className='smallButton' key={eachCollectionIndex} style={{ backgroundColor: eachCollection.relativePath === formObj.nextLayout!.mainFileName ? "var(--color5)" : "" }} onClick={() => {
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
                                <label htmlFor="propsUsed">Global Props Seen</label>

                                <div style={{ display: "flex", flexWrap: "wrap", gap: ".5rem" }}>
                                    {propsBeingUsed.map(eachProp => {
                                        return (
                                            <button key={eachProp.id} className='smallButton'>{eachProp.name}</button>
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
                            return <div className='smallButton' style={{ backgroundColor: seenObj.id === formObj.categoryId ? "var(--color5)" : "" }}>{seenObj.name}</div>
                        }}

                        chosenItemSetterFunction={(seenObj) => {
                            formObjSet(prevObj => {
                                const newObj = { ...prevObj }
                                newObj.categoryId = seenObj.id
                                return newObj
                            })

                            userEditedSet(prevObj => {
                                const newObj = { ...prevObj }
                                newObj["categoryId"] = true
                                return newObj
                            })
                        }}

                        genralSearchFunction={getCategories}

                        specificSearchFunction={(search: string) => {
                            return getSpecificCategory({ usingId: false, search: search })
                        }}

                        findMoreButton={{
                            text: "Suggest Some Categories",
                            link: '/suggestions?type=category'
                        }}
                    />
                </div>

                <div>
                    {themesBeingUsed.length > 0 && (
                        <label htmlFor="themesUsed">Themes in use</label>
                    )}

                    <SelectAnItemWithSearch
                        labelText={["Choose themes for this component", ""]}

                        displaySearchResultFunction={(seenObj) => {
                            return <div className='smallButton' style={{}}>{seenObj.name}</div>
                        }}

                        chosenItemSetterFunction={(seenObj) => {
                            themesBeingUsedSet(prevArr => {
                                const newArr = themesBeingUsed.find(eachThemeInUse => eachThemeInUse.id === seenObj.id) === undefined ? [...prevArr, seenObj] : prevArr

                                console.log(`$seenObj`, seenObj);
                                return newArr
                            })

                            userEditedSet(prevObj => {
                                const newObj = { ...prevObj }
                                newObj["themes"] = true
                                return newObj
                            })
                        }}

                        genralSearchFunction={getThemes}

                        specificSearchFunction={(search: string) => {
                            return getSpecificTheme({ usingId: false, search: search })
                        }}

                        findMoreButton={{
                            text: "Suggest Some Themes",
                            link: '/suggestions?type=theme'
                        }}

                        searchingMultiple={true}
                    />

                    <div style={{ display: "flex", alignItems: "center", overflowX: "auto", gap: "1rem", marginTop: "1rem" }}>
                        {themesBeingUsed.map(eachThemeInUse => {
                            return (
                                <button className="smallButton" style={{ backgroundColor: "var(--color5)" }} key={eachThemeInUse.id} onClick={() => {
                                    themesBeingUsedSet(prev => {
                                        const newArr = prev.filter(eachThemeSeen => eachThemeSeen.id !== eachThemeInUse.id)
                                        return newArr
                                    })

                                    userEditedSet(prevObj => {
                                        const newObj = { ...prevObj }
                                        newObj["themes"] = true
                                        return newObj
                                    })
                                }}>{eachThemeInUse.name}</button>
                            )
                        })}
                    </div>
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
                            rule: "Ensure your component isn't influenced by global styles - all styling should come from inline styles / module.css files",
                            additionalText: "You can add the .noExternalStyles css class to ensure your design is consistent across broswers",
                            buttonInfo: {
                                text: "Copy Class",
                                onClick: () => {
                                    navigator.clipboard.writeText(`
                                    .noExternalStyles * {
                                        all: unset;
                                      }
                                      `);

                                    toast.success("class copied!")
                                },
                            }
                        },
                        {
                            rule: "Your component must be be resizable for all screen sizes - Desktop, Tablet, Mobile"
                        },

                    ].map((eachRule, eachRuleIndex) => {
                        return (
                            <li key={eachRuleIndex}>
                                {eachRule.rule}

                                {eachRule.buttonInfo && (
                                    <>
                                        <p>{eachRule.additionalText}</p>

                                        <button className='smallButton' onClick={eachRule.buttonInfo.onClick}>Copy Css Class</button>
                                    </>
                                )}
                            </li>
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
