import React, { useState, useEffect } from 'react';

import { Canvas } from '@react-three/fiber'

import Box from './ThreeJS/Box';


export default function Background(props){

    return(
        // h-screen
        <div className={`height-minus-nav w-screen fixed top-0 ${props.showFront === false ? '-' : ''}z-10 transition-opacity ${props.hide === true && 'opacity-100'}`}>
            <Canvas >
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                <Box position={[-1.2, 0, 0]} play={props.play}/>
                <Box position={[1.2, 0, 0]} play={props.play}/>
            </Canvas>
        </div>
    )
}