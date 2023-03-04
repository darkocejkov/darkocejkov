import React, {useMemo, useState} from "react";

import {Cube, Sphere} from '../Components/ThreeJS/MeshObjects'

export const CubeGrid = ({a, b, c}) => {

    const boxes = useMemo(() => {

        let coords = []
        let array = []

        for(let x = -a; x <= a; x ++){
           for(let i = -b; i <= b; i ++){
               for(let j = -c; j <= c; j++){
                   coords.push(
                       [x, i, j]
                       // <Box position={[x, i, j]}/>
                   )

                   array.push(
                       <Cube position={[x, i, j]} geo={[.1, .1, .1]}/>
                   )
               }
           }
        }

        console.log(array)

        return array

    }, [a, b, c])

    return(
        <>
            <ambientLight />
            <pointLight position={[10, 10, 10]} />

            {boxes}

        </>
    )
}

export const SphereGrid = ({a, b, c}) => {

    const boxes = useMemo(() => {

        let coords = []
        let array = []

        for(let x = -a; x < a; x ++){
            for(let i = -b; i < b; i ++){
                for(let j = -c; j < c; j++){
                    coords.push(
                        [x, i, j]
                        // <Box position={[x, i, j]}/>
                    )

                    array.push(
                        <Sphere position={[x, i, j]} geo={[.1, 32, 16]}/>
                    )
                }
            }
        }

        console.log(array)

        return array

    }, [a, b, c])

    return(
        <>
            <ambientLight />
            <pointLight position={[10, 10, 10]} />

            {boxes}

        </>
    )
}