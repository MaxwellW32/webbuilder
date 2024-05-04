"use client"
import React, { useEffect, useMemo, useState } from 'react';
import { getUserComponents, getUserComponentsFromCategory } from '@/serverFunctions/handleUserComponents';
import { builtComponent, category } from '@/types';
import MakeElement from '@/components/starters/MakeElement';
import { getProps } from '@/serverFunctions/handleProps';
import buildUserComponents from '@/useful/buildUserComponents';
import { getCategories } from '@/serverFunctions/handleCategories';
import Link from "next/link"
import InputList from '@/components/form/InputList';

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
};

export default function Page() {
    type categoryComponents = { [key: string]: builtComponent[] }

    const [categoryComponents, categoryComponentsSet] = useState<categoryComponents>({});
    const [globalProps, globalPropsSet] = useState<{ [key: string]: any }>({});
    const [showingSidePanel, showingSidePanelSet] = useState(false);

    //load up components
    useEffect(() => {
        const startOff = async () => {
            const categories = await getCategories()

            const newCategoryComponentsObj: categoryComponents = Object.fromEntries(await Promise.all(categories.map(async eachCategory => {

                const componentsFromCategory = await getUserComponentsFromCategory({ id: eachCategory.id })

                const builtComponentsInThisCategory: builtComponent[] = await buildUserComponents(componentsFromCategory)

                return [eachCategory.name, builtComponentsInThisCategory]
            })))

            console.log(`$newCategoryComponentsObj`, newCategoryComponentsObj);
            categoryComponentsSet(newCategoryComponentsObj)
        }
        startOff()
    }, [])

    //load up props from server
    useEffect(() => {
        const startOff = async () => {
            const seenProps = await getProps()

            const combinedObject = seenProps.reduce((acc, curr) => {
                return { ...acc, ...curr.obj };
            }, {});

            const objWithProperValues = Object.fromEntries(Object.entries(combinedObject).map((eachEntry, eachEntryIndex) => {
                //value can be string/number/object/array 
                const key = eachEntry[0]
                const value = getProperValue(eachEntry[1] as any)

                return [key, value]
            }))

            console.log(`$objWithProperValues`, objWithProperValues);
            globalPropsSet(objWithProperValues)
        }

        startOff()
    }, [])

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

    //different categories along the page
    //get all categories 
    //loop over all the categories
    //for each of them fetch components
    //store components in that category obj from key
    return (
        <main style={{ display: "grid", position: "relative" }}>
            {showingSidePanel ? (
                <div style={{ position: "fixed", right: 0, top: 0, height: "100%", width: "min(400px, 100%)", overflowY: 'auto', backgroundColor: "yellow", zIndex: 99, padding: "1rem", display: "grid" }}>
                    <p style={{ justifySelf: "flex-end" }} onClick={() => {
                        showingSidePanelSet(false)
                    }}>Close</p>

                    <p>Edit Global Props</p>

                    <InputList passedObj={globalProps} objectSetter={globalPropsSet} />
                </div>
            ) : (
                <div style={{ position: "absolute", top: 0, right: 0, margin: "1rem", cursor: "pointer" }} onClick={() => {
                    showingSidePanelSet(true)
                }}>
                    <svg style={{ fill: "#000", width: "2rem" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z" /></svg>
                </div>
            )}

            <h1>Designs</h1>

            <div style={{ display: "grid", gap: "1rem" }}>
                {Object.entries(categoryComponents).map(eachEntry => {
                    const eachCategoryNameKey = eachEntry[0]
                    const builtComponentsValue = eachEntry[1]

                    return (
                        <React.Fragment key={eachCategoryNameKey}>
                            <h2>{eachCategoryNameKey}</h2>

                            <div className='snap niceScrollbar' style={{ display: "grid", overflowX: "auto", gridAutoFlow: 'column', gridAutoColumns: "100%" }}>
                                {builtComponentsValue.map(eachComponent => {
                                    if (eachComponent.component === undefined) return null

                                    const component = <eachComponent.component {...globalProps} />

                                    return (
                                        <div key={eachComponent.id} style={{ position: "relative" }}>
                                            <div className='userComponentHoverDiv'>
                                                <div className='userComponentTriggerElement'>
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M0 96C0 60.7 28.7 32 64 32H512c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM128 288a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm32-128a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zM128 384a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm96-248c-13.3 0-24 10.7-24 24s10.7 24 24 24H448c13.3 0 24-10.7 24-24s-10.7-24-24-24H224zm0 96c-13.3 0-24 10.7-24 24s10.7 24 24 24H448c13.3 0 24-10.7 24-24s-10.7-24-24-24H224zm0 96c-13.3 0-24 10.7-24 24s10.7 24 24 24H448c13.3 0 24-10.7 24-24s-10.7-24-24-24H224z" /></svg>
                                                </div>

                                                <div className='userComponentInfo'>
                                                    <h2>name: {eachComponent.name}</h2>
                                                    <h2>likes: {eachComponent.likes}</h2>
                                                    <h2>saves: {eachComponent.saves}</h2>
                                                    <h2>comments: {JSON.stringify(eachComponent.comments)}</h2>

                                                    <button className='secondaryButton' style={{ justifySelf: "flex-start" }}>Download Component</button>
                                                </div>
                                            </div>

                                            {component}
                                        </div>
                                    )
                                })}

                                {builtComponentsValue.length === 0 && (
                                    <div>
                                        <Link href={"/userComponents/new"}>
                                            <button className='mainButton'>Time to add some components</button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </React.Fragment>
                    )
                })}
            </div>
        </main>
    );
};

