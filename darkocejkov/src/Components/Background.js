import React, {useState, useEffect, Suspense, useLayoutEffect} from 'react';

import {Canvas, useFrame, useLoader, useThree} from '@react-three/fiber'
import {motion} from 'framer-motion'

import Box from './ThreeJS/Box';
import {useMotionValueEvent, useScroll} from "framer-motion";
import {last} from "../GlobalFunctions";

import {useControls} from "leva";
import {MyApp, SketchControls} from "./Basics";

export default function Background({showFront, play, hide, blind, className = '', controls = false}){

    const {scrollY, scrollYProgress} = useScroll()

    return(
        <>

            <motion.div
                initial={{
                    opacity: 0,
                }}
                animate={{
                    opacity: hide ? 0 : 1,
                    zIndex: showFront ? 40 : 0,
                    // translateX: showFront ? [0, 100, 0] : [100, 0, 100]
                }}
                transition={{type: 'spring'}}
                className={`${className} w-screen fixed top-0 `}
            >
                <Canvas >
                    <Scene blind={blind}>
                        <ambientLight />
                        <pointLight position={[10, 10, 10]} />
                        <Box position={[-4, 0, 0]} play={play}/>
                        <Box position={[3.1, 2, 2]} play={play}/>
                        <Box position={[0, -2, -4]} play={play}/>
                    </Scene>

                </Canvas>
            </motion.div>

            {controls &&
                <SketchControls />
            }
        </>

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