import React, { useState } from "react";
import DisplayComponentFromText from "@/backup/displayComponentFromText/DisplayComponentFromText";
import Image from "next/image";

const userCodeArr = [
  {
    code: `
    function App({text1}:{text1: string}) {
        return (
          <div style={{display: "flex"}}>
      
          <img alt="" src={"https://images.pexels.com/photos/19987317/pexels-photo-19987317/free-photo-of-ceiling-of-the-library-at-the-university-of-cambridge.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"} width={100} height={100} />

          <div style={{flex: 1}}>column 1</div>
          <div style={{flex: 1}}>column 2</div>
          </div>
          )
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
