import React, { useRef, useState} from 'react'
import {  useFrame } from '@react-three/fiber'
import {useMotionValueEvent, useScroll} from "framer-motion";
import {last} from "../../helpers";

export default function Box({play, position}) {
    // This reference gives us direct access to the THREE.Mesh object
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
        scale={clicked ? 1.5 : 1}
        onClick={(event) => click(!clicked)}
        // onWheel={(e) => rotate()}
        onPointerOver={(event) => hover(true)}
        onPointerOut={(event) => hover(false)}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={hovered ? 'red' : 'orange'} />
      </mesh>
    )
  }