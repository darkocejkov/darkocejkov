import React, {useRef, useState} from "react";
import {useFrame} from "@react-three/fiber";
import {useMotionValueEvent, useScroll} from "framer-motion";
import {last} from "../../helpers";

const DEFAULT_COLOR = "#FFFFFF"

const DEFAULT_CUBE_SIZE = [1,1,1]
const DEFAULT_SPHERE_SIZE = [1,1,1]

export const Sphere = ({position, geo}) => {

    const ref = useRef()

    return (
        <mesh
            ref={ref}
            position={position}
        >
            <sphereGeometry args={geo} />
            <meshStandardMaterial color={'orange'} />
        </mesh>
    )
}

export const Cube = ({position, geo}) => {
    const ref = useRef()
    // Hold state for hovered and clicked events
    const [hovered, hover] = useState(false)
    const [clicked, click] = useState(false)

    // Subscribe this component to the render-loop, rotate the mesh every frame
    useFrame((state, delta) => {
        ref.current.rotation.y += (0.001 * position[0])
        ref.current.rotation.z += (0.001 * position[1])
    })
    // Return the view, these are regular Threejs elements expressed in JSX

    const {scrollY, scrollYProgress} = useScroll()

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        // console.log("Page scroll: ", latest)

        let delta = last(position)
        if(delta === 0){
            delta = 0.1
        }

        ref.current.rotation.x = latest * (-delta * 5)
    })

    return (
        <mesh
            ref={ref}
            position={position}
            // scale={clicked ? 1.5 : 1}
            // onClick={(event) => click(!clicked)}
            // onWheel={(e) => rotate()}
            // onPointerOver={(event) => hover(true)}
            // onPointerOut={(event) => hover(false)}
        >
            <boxGeometry args={geo} />

            {/*<meshStandardMaterial color={`rgb(${position[0]}, ${position[1]}, ${position[2]})`} />*/}

            <meshStandardMaterial color={DEFAULT_COLOR} />
        </mesh>
    )
}