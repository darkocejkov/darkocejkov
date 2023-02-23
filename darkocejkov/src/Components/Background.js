import React, {useState, useEffect, Suspense, useLayoutEffect} from 'react';

import {Canvas, useFrame, useLoader, useThree} from '@react-three/fiber'

import Box from './ThreeJS/Box';
import {useMotionValueEvent, useScroll} from "framer-motion";
import {last} from "../GlobalFunctions";


export default function Background({showFront, play, hide, blind}){

    const {scrollY, scrollYProgress} = useScroll()



    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        // console.log("Page scroll: ", latest)

    })



    return(
        <div className={`height-minus-nav w-screen fixed top-0 ${showFront === false ? '-' : ''}z-10 transition-opacity ${hide === true && 'opacity-100'}`}>
            <Canvas >
                <Scene blind={blind}>
                    <ambientLight />
                    <pointLight position={[10, 10, 10]} />
                    <Box position={[-4, 0, 0]} play={play}/>
                    <Box position={[3.1, 2, 2]} play={play}/>
                    <Box position={[0, -2, -4]} play={play}/>
                </Scene>

            </Canvas>
        </div>
    )
}

const Scene = ({children, blind}) => {

    const gl = useThree((state) => state.gl);

    useLayoutEffect(() => {
        gl.setPixelRatio(blind)
    })

    return(
        children
    )
}