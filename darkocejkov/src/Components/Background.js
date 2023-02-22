import React, { useState, useEffect } from 'react';

import {Canvas, useFrame} from '@react-three/fiber'

import Box from './ThreeJS/Box';


export default function Background({showFront, play, hide}){

    return(
        // h-screen
        <div className={`height-minus-nav w-screen fixed top-0 ${showFront === false ? '-' : ''}z-10 transition-opacity ${hide === true && 'opacity-100'}`}>
            <Canvas >
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                <Box position={[-1.2, 0, 0]} play={play}/>
                <Box position={[1.2, 0, 0]} play={play}/>
            </Canvas>
        </div>
    )
}