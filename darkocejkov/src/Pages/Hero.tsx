import React from "react";
import {Container} from "../Components/Layout.tsx";
import {DepthText} from '../Components/Basics.tsx'
export default function Hero({}){

    return(
        <Container className={'rotate-d'}>
            <DepthText spread={6} n={6} />
        </Container>
    )

}