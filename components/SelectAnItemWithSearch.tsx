"use client"
import React, { useRef, useState, useEffect } from 'react'
import styles from "./updateItemCategory.module.css"
import Link from 'next/link'
import ShowMore from './showMore/ShowMore'

export default function SelectAnItemWithSearch<T>({
    chosenItemSetterFunction,
    genralSearchFunction,
    specificSearchFunction,
    displaySearchResultFunction,
    findMoreButton,
    labelText,
}: {
    chosenItemSetterFunction: (seenObj: T) => void;
    genralSearchFunction: () => Promise<T[]>;
    specificSearchFunction: (search: string) => Promise<T[]>;
    displaySearchResultFunction: (seenObj: T) => JSX.Element;
    findMoreButton: { link: string, text: string };
    labelText: [string, string];
}) {
    const [search, searchSet] = useState("")
    const [searchResults, searchResultsSet] = useState<T[]>([])
    const [chosenItem, chosenItemSet] = useState<T>()
    const [searchedOnce, searchedOnceSet] = useState(false)
    const [userSearchedOnce, userSearchedOnceSet] = useState(false)
    const searchDebounce = useRef<NodeJS.Timeout>()

    //search once for general items
    useEffect(() => {
        if (search !== "") return

        const checkNormal = async () => {
            if (searchDebounce.current) clearTimeout(searchDebounce.current)

            searchDebounce.current = setTimeout(async () => {//run search
                searchResultsSet(await genralSearchFunction())

                searchedOnceSet(true)
            }, 100);
        }
        checkNormal()

    }, [search])

    //set chosen item upward
    useEffect(() => {
        if (!chosenItem) return
        chosenItemSetterFunction(chosenItem)
    }, [chosenItem])

    return (
        <div style={{ display: "grid", gap: ".5rem" }}>
            <label>{chosenItem === undefined ? labelText[0] : labelText[1]}</label>

            <ShowMore startShowing={chosenItem === undefined} label='Search' svgColor='#000' content={
                <div style={{ display: "grid", gap: ".5rem" }}>
                    <input style={{ color: "#000" }} type='text' placeholder='search' value={search}
                        onChange={(e) => {
                            if (searchDebounce.current) clearTimeout(searchDebounce.current)
                            searchSet(e.target.value)
                            userSearchedOnceSet(true)
                            chosenItemSet(undefined)


                            searchDebounce.current = setTimeout(async () => {//run search
                                searchResultsSet(await specificSearchFunction(search))
                            }, 1000);
                        }} />
                </div>
            } />

            {searchResults.length > 0 && (
                <div style={{ display: "flex", gap: ".5rem", overflowX: "auto" }}>
                    {searchResults.map((eachResult, eachResultIndex) => {
                        return (
                            <div key={eachResultIndex} className='smallButton' style={{ backgroundColor: chosenItem === eachResult ? "#000" : "" }}
                                onClick={() => {
                                    chosenItemSet(eachResult)
                                }}>
                                {displaySearchResultFunction(eachResult)}
                            </div>
                        )
                    })}
                </div>
            )}

            {searchedOnce && searchResults.length === 0 && !userSearchedOnce && (
                <div>
                    <h3>Not seeing any results</h3>

                    <button>
                        <Link className='mainButton' href={findMoreButton.link} rel="noopener noreferrer" target="_blank" style={{ display: "inline-block", border: "1px solid red" }}>
                            {findMoreButton.text}
                        </Link>
                    </button>
                </div>
            )}
        </div>
    )
}
