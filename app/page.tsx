import React, { useState } from "react";
import DisplayComponentFromText from "@/components/displayComponentFromText/DisplayComponentFromText";

const userCodeArr = [
  {
    code: `
    function App({text1}:{text1: string}) {
      const sum = 1 + 10
        return <div id="four" style={{}}>Hello world {sum} text: {text1}</div>
    }`,
    StyleSheet: `
      .myEl {
          color: red
      }
      
      .myEl2 {
          color: blue
      }
      
      
      .three,
      #four {
          color: pink;
      }
      
      
      @media only screen and (max-width: 400px) {
          #four {
              color: red;
          }
      }`
  }
]

export default function Home() {

  return (
    <main>
      <section>
        <p>running a test</p>

        {userCodeArr.map((eachUserCode, eachUserCodeIndex) => {
          return (
            <DisplayComponentFromText
              key={eachUserCodeIndex}
              userCode={eachUserCode.code}
              userStyleSheet={eachUserCode.StyleSheet}
              text1={"hey max"}
              randomizeClassNames={true}
            />
          )
        })}
      </section>
    </main>
  );
}
