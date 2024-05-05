"use client"
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { getSpecificUserComponent, getUserComponents, getUserComponentsFromCategory } from '@/serverFunctions/handleUserComponents';
import { builtComponent, category } from '@/types';
import MakeElement from '@/components/starters/MakeElement';
import { getProps } from '@/serverFunctions/handleProps';
import buildUserComponents from '@/useful/buildUserComponents';
import { getCategories } from '@/serverFunctions/handleCategories';
import Link from "next/link"
import InputList from '@/components/form/InputList';
import MakeLogo from '@/components/starters/MakeLogo';
import { useInView } from 'react-intersection-observer'
import { toast } from 'react-hot-toast';
import MakeChildren from '@/components/starters/MakeChildren';
import ShowMore from '@/components/showMore/ShowMore';

const globalServerStarter = {
    "<wbParagraphOne>": "This is the first paragraph.",
    "<wbParagraphTwo>": "Here goes the second paragraph.",
    "<wbParagraphThree>": "The third paragraph follows suit.",
    "<wbParagraphFour>": "Fourth paragraph is next.",
    "<wbParagraphFive>": "Fifth paragraph comes after fourth.",
    "<wbParagraphSix>": "Sixth paragraph is here.",
    "<wbParagraphSeven>": "Seventh paragraph is ready.",
    "<wbParagraphEight>": "Eighth paragraph is up.",
    "<wbParagraphNine>": "Ninth paragraph is in place.",
    "<wbParagraphTen>": "Tenth paragraph completes the set.",
    "<wbHeadingOne>": "Heading One",
    "<wbHeadingTwo>": "Heading Two",
    "<wbHeadingThree>": "Heading Three",
    "<wbHeadingFour>": "Heading Four",
    "<wbHeadingFive>": "Heading Five",
    "<wbHeadingSix>": "Heading Six",
    "<wbHeadingSeven>": "Heading Seven",
    "<wbHeadingEight>": "Heading Eight",
    "<wbHeadingNine>": "Heading Nine",
    "<wbHeadingTen>": "Heading Ten",

    "<wbElementOne>": <MakeElement elNumber={1} />,
    "<wbElementTwo>": <MakeElement elNumber={2} />,
    "<wbElementThree>": <MakeElement elNumber={3} />,
    "<wbElementFour>": <MakeElement elNumber={4} />,
    "<wbElementFive>": <MakeElement elNumber={5} />,
    "<wbElementSix>": <MakeElement elNumber={6} />,
    "<wbElementSeven>": <MakeElement elNumber={7} />,
    "<wbElementEight>": <MakeElement elNumber={8} />,
    "<wbElementNine>": <MakeElement elNumber={9} />,
    "<wbElementTen>": <MakeElement elNumber={10} />,

    "<wbImageObjOne>": { alt: "default Image One", src: "", width: 1000, height: 1000 },
    "<wbImageObjTwo>": { alt: "default Image Two", src: "", width: 1000, height: 1000 },
    "<wbImageObjThree>": { alt: "default Image Three", src: "", width: 1000, height: 1000 },
    "<wbImageObjFour>": { alt: "default Image Four", src: "", width: 1000, height: 1000 },
    "<wbImageObjFive>": { alt: "default Image Five", src: "", width: 1000, height: 1000 },
    "<wbImageObjSix>": { alt: "default Image Six", src: "", width: 1000, height: 1000 },
    "<wbImageObjSeven>": { alt: "default Image Seven", src: "", width: 1000, height: 1000 },
    "<wbImageObjEight>": { alt: "default Image Eight", src: "", width: 1000, height: 1000 },
    "<wbImageObjNine>": { alt: "default Image Nine", src: "", width: 1000, height: 1000 },
    "<wbImageObjTen>": { alt: "default Image Ten", src: "", width: 1000, height: 1000 },

    "<wbLinkObjOne>": { src: "/", text: "Link One" },

    "<wbLogoSmall>": <MakeLogo size={100} />,
    "<wbNavMenuGraphic>": <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>,
    "<wbToggleNavButton>": <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z" /></svg>,

    "<wbChildren>": <MakeChildren />,
};

export default function Page() {
    type categoryComponentsType = { [key: string]: builtComponent[] }

    const [categories, categoriesSet] = useState<category[]>([]);
    const [noMoreCategories, noMoreCategoriesSet] = useState(false);
    const [activeBuiltUserComponent, activeBuiltUserComponentSet] = useState<builtComponent>();
    const { ref: categorySearchButton, inView: categorySearchButtonInView } = useInView()

    const [noMoreUserComponents, noMoreUserComponentsSet] = useState<{ [key: string]: boolean }>({});

    const [categoryComponents, categoryComponentsSet] = useState<categoryComponentsType>({});
    const [globalProps, globalPropsSet] = useState<{ [key: string]: any }>({});
    const [userComponentSpecificProps, userComponentSpecificPropsSet] = useState<{ [key: string]: any }>({});
    const [showingSidePanel, showingSidePanelSet] = useState(false);
    const userComponentCheckDebounce = useRef<NodeJS.Timeout>()
    const [search, searchSet] = useState("")

    const categoryLimit = useRef(10)
    const userComponentLimit = useRef(5)

    //run function on mount
    const mounted = useRef(false);
    useEffect(() => {
        if (mounted.current) return
        mounted.current = true

        startAll()
    }, [])

    //handle categorySearchButton
    useEffect(() => {
        if (!categorySearchButtonInView || noMoreCategories) return

        const check = async () => {
            const moreCategories = await getCategories(categoryLimit.current, categories.length)

            //keep nomorecategories updated based on amount received
            if (moreCategories.length < categoryLimit.current) noMoreCategoriesSet(true)

            const newCategories: category[] = [] //ensures no duplicates
            moreCategories.forEach(eachMoreCategory => {
                if (categories.find(eachOldCategory => eachOldCategory.id === eachMoreCategory.id) === undefined) {
                    newCategories.push(eachMoreCategory)
                }
            })

            categoriesSet(prev => {//assign new categories
                return [...prev, ...newCategories]
            })

            //add each category to the obj along with usercomponents
            for (let index = 0; index < newCategories.length; index++) {
                await addToCategoryComponents(newCategories[index], userComponentLimit.current, 0)
            }
        }
        check()
    }, [categorySearchButtonInView, noMoreCategories])

    function startAll() {
        loadUpGlobalProps()
        initialLoadOfCategoryComponents()
    }

    async function loadUpGlobalProps() {
        //load up global props from server

        const seenProps = await getProps()

        const combinedObject = seenProps.reduce((acc, curr) => {//combine props from database into one obj
            return { ...acc, ...curr.obj };
        }, {});

        const objWithProperValues = Object.fromEntries(Object.entries(combinedObject).map(eachEntry => {//assign glbalStarter values to string fill ins present
            const key = eachEntry[0]
            const value = getProperValue(eachEntry[1] as any)

            return [key, value]
        }))

        globalPropsSet(objWithProperValues)
    }

    async function initialLoadOfCategoryComponents() {
        //load up categories and components
        const categories = await getCategories(categoryLimit.current)//put limit of 5

        categoriesSet(categories)

        for (let index = 0; index < categories.length; index++) {
            await addToCategoryComponents(categories[index], userComponentLimit.current, 0)
        }
    }

    async function addToCategoryComponents(category: category, limit: number, currentAmtOfComponentsOfset: number) {
        //current amount starts off at 0, then 3, then 6...until returns nothing
        const componentsFromCategory = await getUserComponentsFromCategory({ id: category.id }, limit, currentAmtOfComponentsOfset)

        const builtComponentsInThisCategory: builtComponent[] = await buildUserComponents(componentsFromCategory)

        //assign category name key and built usercomponents value
        categoryComponentsSet(prevCategoryComponents => {
            const newCategoryComponents = { ...prevCategoryComponents }

            if (!newCategoryComponents[category.name]) newCategoryComponents[category.name] = [] //if obj value is underined make it an array

            newCategoryComponents[category.name] = [...newCategoryComponents[category.name], ...builtComponentsInThisCategory] //append new components to list

            return newCategoryComponents
        })

        return builtComponentsInThisCategory.length > 0 //tells whether theres more or not
    }

    function getProperValue(passedValue: any): any {//{text1: "<wbParagrapgh1>"}
        //if value is an object loop through it and update all values inside
        if (typeof passedValue === "object") {
            //handle array 
            if (Array.isArray(passedValue)) {
                return passedValue.map(eachMinValue => {
                    return getProperValue(eachMinValue)
                })

            } else {
                //handle obj
                return Object.fromEntries(Object.entries(passedValue).map(eachEntry => {
                    const minKey = eachEntry[0]
                    let minValue = eachEntry[1] as any

                    const seenCheckValue = getProperValue(minValue)
                    if (seenCheckValue) minValue = seenCheckValue

                    return [minKey, minValue]
                }))
            }

        }

        const properValue = assignObjectValues(passedValue, globalServerStarter)//its a string
        if (properValue) passedValue = properValue

        return passedValue
    }

    function assignObjectValues(seenKey: string, seenObj: { [key: string]: any }) {
        return seenObj[seenKey]
    }

    return (
        <main style={{ display: "grid", position: "relative" }}>
            {showingSidePanel ? (
                <div style={{ position: "fixed", right: 0, top: 0, height: "100%", width: "min(400px, 100%)", overflowY: 'auto', backgroundColor: "yellow", zIndex: 99, padding: "1rem", display: "grid", alignContent: "flex-start" }}>
                    <p style={{ justifySelf: "flex-end" }} onClick={() => {
                        showingSidePanelSet(false)
                    }}>Close</p>

                    {activeBuiltUserComponent ? (
                        <>
                            <button className='smallButton' onClick={() => {
                                navigator.clipboard.writeText(activeBuiltUserComponent.id);
                                toast.success("id copied!")
                            }}>copy component id</button>

                            <button className='secondaryButton' style={{ justifySelf: "flex-start" }}>Download Component</button>

                            <h3>name: {activeBuiltUserComponent.name}</h3>

                            <h3>likes: {activeBuiltUserComponent.likes}</h3>

                            <h3>saves: {activeBuiltUserComponent.saves}</h3>

                            <h3>comments: {JSON.stringify(activeBuiltUserComponent.comments)}</h3>

                            <h3>This components Props</h3>

                            <div>
                                <label>Enter child component Id to load</label>

                                <input style={{ color: "#000" }} type='text' placeholder='Enter Id here' value={search} onChange={(e) => { searchSet(e.target.value) }} />

                                <button className='mainButton' onClick={async () => {
                                    const seenCopiedUserComponent = await getSpecificUserComponent({ id: search })
                                    if (!seenCopiedUserComponent) return

                                    const builtNewUserComponent: builtComponent[] = await buildUserComponents([seenCopiedUserComponent])

                                    userComponentSpecificPropsSet(prevObj => {
                                        const newObj = { ...prevObj }
                                        newObj[activeBuiltUserComponent.id] = { ...newObj[activeBuiltUserComponent.id], children: <BuiltComponentWithButton EachBuiltComponent={builtNewUserComponent[0]} globalProps={globalProps} userComponentSpecificProps={userComponentSpecificProps} activeBuiltUserComponentSet={activeBuiltUserComponentSet} showingSidePanelSet={showingSidePanelSet} /> }
                                        return newObj
                                    })

                                    searchSet("")
                                }}>Load</button>
                            </div>
                        </>
                    ) : (
                        <>
                            <p>Select a component to view more options</p>
                        </>
                    )}

                    <ShowMore label='Edit Global Props' content={
                        <InputList passedObj={globalProps} objectSetter={globalPropsSet} />
                    } />
                </div>
            ) : (
                <div style={{ position: "absolute", top: 0, right: 0, margin: "1rem", cursor: "pointer" }} onClick={() => {
                    showingSidePanelSet(true)
                }}>
                    <svg style={{ fill: "#000", width: "2rem" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z" /></svg>
                </div>
            )}

            <div style={{ display: "grid", gap: "1rem" }}>
                <h1>Designs</h1>

                {Object.entries(categoryComponents).map(eachEntry => {
                    const eachCategoryNameKey = eachEntry[0]
                    const builtComponentsValue = eachEntry[1]

                    return (
                        <React.Fragment key={eachCategoryNameKey}>
                            <h2>Category: {eachCategoryNameKey}</h2>

                            <div className='snap niceScrollbar noExternalStylesx' style={{ display: "grid", overflowX: "auto", gridAutoFlow: 'column', gridAutoColumns: "100%" }}
                                onScroll={(e) => {
                                    const seenEl = e.target as HTMLDivElement

                                    const elementWidth = seenEl.clientWidth
                                    const scrollLeft = seenEl.scrollLeft + (elementWidth / 2)

                                    const roomIndex = Math.floor(scrollLeft / elementWidth)

                                    if (roomIndex < builtComponentsValue.length - 2) return //start searching from two room out
                                    if (userComponentCheckDebounce.current) clearTimeout(userComponentCheckDebounce.current)

                                    userComponentCheckDebounce.current = setTimeout(async () => {
                                        if (noMoreUserComponents[eachCategoryNameKey]) return

                                        const foundCategory = categories.find(eachCategory => eachCategory.name === eachCategoryNameKey)
                                        if (!foundCategory) return

                                        const seeingMoreUserComponents = await addToCategoryComponents(foundCategory, userComponentLimit.current, categoryComponents[eachCategoryNameKey].length)
                                        if (!seeingMoreUserComponents) {//if no more user components make it known
                                            noMoreUserComponentsSet(prevNoMoreUserComponents => {
                                                const newNoMoreUserComponents = { ...prevNoMoreUserComponents }
                                                newNoMoreUserComponents[eachCategoryNameKey] = true
                                                return newNoMoreUserComponents
                                            })
                                        }
                                    }, 500);
                                }}
                                onClick={() => {
                                    showingSidePanelSet(false)
                                }}
                            >
                                {builtComponentsValue.length > 0 ? (
                                    builtComponentsValue.map(eachComponent => {

                                        return (
                                            <div key={eachComponent.id} className='niceScrollbar' style={{ maxHeight: "100svh", overflowY: "auto" }}>
                                                <BuiltComponentWithButton EachBuiltComponent={eachComponent} globalProps={globalProps} userComponentSpecificProps={userComponentSpecificProps} activeBuiltUserComponentSet={activeBuiltUserComponentSet} showingSidePanelSet={showingSidePanelSet} />
                                            </div>
                                        )
                                    })
                                ) : (
                                    <div>
                                        <p>No components here</p>

                                        <Link href={"/userComponents/new"}>
                                            <button className='smallButton'>Add {eachCategoryNameKey} Designs</button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </React.Fragment>
                    )
                })}

                {/* hanlde category search */}
                {categories.length > 0 && <div ref={categorySearchButton}></div>}
            </div>
        </main>
    );
};




function BuiltComponentWithButton({ EachBuiltComponent, globalProps, userComponentSpecificProps, activeBuiltUserComponentSet, showingSidePanelSet }: { EachBuiltComponent: builtComponent, globalProps: { [key: string]: any }, userComponentSpecificProps: { [key: string]: any }, activeBuiltUserComponentSet: React.Dispatch<React.SetStateAction<builtComponent | undefined>>, showingSidePanelSet: React.Dispatch<React.SetStateAction<boolean>> }) {

    if (EachBuiltComponent.component === undefined) return null

    const specificProps = userComponentSpecificProps[EachBuiltComponent.id] ?? {}

    const component = useMemo(() => {
        if (EachBuiltComponent.component === undefined) return null

        if (specificProps.children) {//if child element seen meant for this component id call component differently
            console.log(`$is not a layout`);
            return (
                <EachBuiltComponent.component {...globalProps} {...specificProps}>
                    {specificProps.children}
                </EachBuiltComponent.component>
            )
        } else {
            return <EachBuiltComponent.component {...globalProps} {...specificProps} />
        }
    }, [specificProps.children, EachBuiltComponent.component])

    return (
        <div style={{ position: "relative" }}>
            <div className='userComponentSelectButton' onClick={(e) => {
                e.stopPropagation()
                activeBuiltUserComponentSet(EachBuiltComponent)
                showingSidePanelSet(true)
            }}>
                <svg style={{ fill: "#b2b2ff" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M0 96C0 60.7 28.7 32 64 32H512c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM128 288a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm32-128a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zM128 384a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm96-248c-13.3 0-24 10.7-24 24s10.7 24 24 24H448c13.3 0 24-10.7 24-24s-10.7-24-24-24H224zm0 96c-13.3 0-24 10.7-24 24s10.7 24 24 24H448c13.3 0 24-10.7 24-24s-10.7-24-24-24H224zm0 96c-13.3 0-24 10.7-24 24s10.7 24 24 24H448c13.3 0 24-10.7 24-24s-10.7-24-24-24H224z" /></svg>
            </div>

            {component}
        </div>
    )
}