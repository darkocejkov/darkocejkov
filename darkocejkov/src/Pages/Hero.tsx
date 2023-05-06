import React from "react";
import {Container} from "../Components/Layout.tsx";
import {DepthText} from '../Components/Basics.tsx'


export default function Hero({}) {

    return (
        <Container>
            {/*<DepthText spread={6} n={6}/>*/}
            <Text text={"Darko Cejkov"}/>
        </Container>
    )

}

const Text = ({text}: {
    text: string
}) => {

    const charArray = []
    

    for (let c of text) {

        let char = c

        if (c === " ") char = ""
        console.log(c)

        charArray.push(
            <Char text={char} key={c}/>
        )
    }

    return (
        charArray
    )
}

const Char = ({text}: {
    text: string
}) => {
    return (
        <span>
            {text}
        </span>
    )
}