"use client"
import React, { useState, useEffect, useMemo } from 'react';
import * as babel from "babel-standalone";
import { v4 as uuidV4 } from "uuid"
import Image from 'next/image';


export default function DisplayComponentFromText({ userCode, userStyleSheet, randomizeClassNames = false, ...props }: { userCode: string, userStyleSheet?: string, [key: string]: any, randomizeClassNames?: boolean }) {
    const [stylesLoaded, stylesLoadedSet] = useState(false)
    const randomId = useMemo(() => uuidV4(), []);

    const userCodeWithRandomizedStyleNames = useMemo(() => {
        if (!randomizeClassNames) {
            return userCode
        } else {
            return userCode.replace(/(className|id)="(.*?)"/g, `$1="$2_${randomId}"`);
        }
    }, [userCode, randomId, randomizeClassNames]);

    const styleSheetWithRandomizedStyleNames = useMemo(() => {
        if (!userStyleSheet) return '';

        if (!randomizeClassNames) {
            return userStyleSheet
        } else {
            return userStyleSheet.replace(/(\.|#)(\w+)/g, (match, selectorType, name) => {
                const randomizedName = `${name}_${randomId}`;
                return `${selectorType}${randomizedName}`;
            });
        }

    }, [userStyleSheet, randomId, randomizeClassNames]);

    //add styles to document
    useEffect(() => {
        if (!styleSheetWithRandomizedStyleNames) return

        const styleElement = document.createElement('style');
        styleElement.textContent = `${styleSheetWithRandomizedStyleNames}`;

        document.head.appendChild(styleElement);
        stylesLoadedSet(true)

        return () => {
            document.head.removeChild(styleElement);
        };
    }, [styleSheetWithRandomizedStyleNames]);

    const injectSpreadObjects = (code: string) => {
        const spreadObjectRegex = /(\.\.\.\w+)/g;
        return code.replace(spreadObjectRegex, (match, spreadObject) => {
            const objectName = spreadObject.slice(3); // Removing the spread operator ...
            return `{...${objectName}}`;
        });
    };

    const App = useMemo(() => {
        const objectProcessedText = injectSpreadObjects(userCodeWithRandomizedStyleNames)
        const babelCode = babel.transform(objectProcessedText, {
            presets: ["react", "es2017"]
        }).code;

        const code = babelCode.replace('"use strict";', "").trim();
        const func = new Function("React", `return ${code}`);

        const AppPre = func(React);

        const ComponentWithProps = (props: any) => <AppPre {...props} />;

        return ComponentWithProps

    }, [userCodeWithRandomizedStyleNames])

    return stylesLoaded ? <App {...props} /> : null
}
