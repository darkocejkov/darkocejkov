import React, {useState, useEffect, Suspense, useLayoutEffect} from 'react';

import {Canvas, useFrame, useLoader, useThree} from '@react-three/fiber'
import {motion} from 'framer-motion'

import Box from './ThreeJS/Box';
import {useMotionValueEvent, useScroll} from "framer-motion";

import {MyApp, SketchControls} from "./Basics";
import {CubeGrid, SphereGrid} from "../Sketches/Grids";
import {PerspectiveCamera, OrbitControls} from "@react-three/drei";
import TestScene from "./Spline/Test1";
import Spline from "@splinetool/react-spline";



const defaultStates = {
    play: true,
    front: false,
    hide: false,
    controls: false
}

const ControlButton = ({label, hidden = false, onClick, id, children, map, disabled = false}) => {
    return(
        <button disabled={disabled} onClick={onClick} className={`${hidden ? 'hidden' : 'visible'} control bg-transparent hover:bg-slate-600/10 p-3 rounded-md group`}>
            {children}
            <span className={'text-white bg-slate-700/50 whitespace-nowrap origin-bottom-left p-2 rounded-lg text-lg group-hover:scale-100 group-hover:opacity-100 opacity-0 scale-0 absolute left-0 bottom-[110%] transition-all'}>
                {label} {disabled && " (Disabled)"}
            </span>
        </button>
    )
}




export const useSketch = () => {

    const [text, setText] = useState(true)
    const [play, setPlay] = useState(false)
    const [front, setFront] = useState(false)
    const [hide, setHide] = useState(true)
    const [controls, setControls] = useState(false)

    const sketches = [
        {
            title: 'Cube Grid',
            component:
                <Canvas>
                    <CubeGrid a={1} b={1} c={1} />
                </Canvas>,
            defaultStates: [{play: true}],
            disabledControls: ['play']
        },
        {
            title: 'Sphere Grid',
            component:
                <Canvas>
                    <SphereGrid a={1} b={1} c={1} />
                </Canvas>,
            defaultStates: [{play: true}],
            disabledControls: [],
        },
        {
            title: 'Glass',
            component: <Spline scene="https://prod.spline.design/CkM2tOih3X5XlOIv/scene.splinecode" />,
            defaultStates: [{play: true}],
            disabledControls: [],
        },
    ]

    const [sketch, setSketch] = useState(null)
    const [sketchIndex, setSketchIndex] = useState(null)

    useEffect(() => {
        setSketch(sketches[0])
        setSketchIndex(0)
    }, [])

    const next = () => {

        if(sketchIndex === sketches.length - 1){
            //     cycle back
            setSketch(sketches[0])
            setSketchIndex(0)

        }else{
            setSketch(sketches[sketchIndex + 1])
            setSketchIndex(sketchIndex + 1)
        }
    }

    const previous = () => {
        if(sketchIndex === 0){
            //     cycle back to last
            setSketch(sketches[sketches.length - 1])
            setSketchIndex(sketches.length - 1)

        }else{
            setSketch(sketches[sketchIndex - 1])
            setSketchIndex(sketchIndex - 1)
        }
    }

    const reset = () => {
        setPlay(defaultStates.play)
        setFront(defaultStates.front)
        setControls(defaultStates.controls)
    }

    useEffect(() => {
        if(hide){
            reset()
        }
    }, [hide])

    const renderControls = () => {
        return(
            <>
                {text
                    ? (
                        <ControlButton onClick={() => setText(false)} label={"Hide Hero Text"}>
                            <i className="fa-solid fa-text-slash fa-xl"></i>
                        </ControlButton>
                    )
                    : (
                        <ControlButton onClick={() => setText(true)} label={"Show Hero Text"}>
                            <i className="fa-solid fa-text fa-xl"></i>
                        </ControlButton>
                    )}

                {hide
                    ? (

                        <ControlButton onClick={() => setHide(false)} label={"Show Sketch"}>
                            <i className="fa-solid fa-eye fa-xl"></i>
                        </ControlButton>
                    )
                    : (

                        <ControlButton onClick={() => setHide(true)} label={"Hide Sketch"}>
                            <i className="fa-solid fa-eye-low-vision fa-xl"></i>
                        </ControlButton>
                    )}

                {front
                    ? (
                        <ControlButton hidden={hide} onClick={() => setFront(false)} label={"Send Sketch Backwards"}>
                            <i className="fa-solid fa-send-backward fa-xl"></i>
                        </ControlButton>
                    )
                    : (

                        <ControlButton hidden={hide} onClick={() => setFront(true)} label={"Send Sketch Forwards"}>
                            <i className="fa-solid fa-bring-forward fa-xl"></i>
                        </ControlButton>
                    )}

                {controls
                    ? (
                        <ControlButton hidden={hide} onClick={() => setControls(false)} label={"Close Sketch Settings"}>
                            <i className="fa-solid fa-circle-half-stroke fa-xl transition-all"></i>
                        </ControlButton>
                    )
                    : (
                        <ControlButton hidden={hide} onClick={() => setControls(true)} label={"Open Sketch Settings"}>
                            <i className="self-center fa-duotone fa-circle-half-stroke fa-xl fa-rotate-180 transition-all"></i>
                        </ControlButton>
                    )
                }

                {sketches.length > 1 &&
                    <ControlButton hidden={hide} onClick={() => previous()} label={"Previous Sketch"}>
                        <i className="fa-solid fa-chevron-left fa-xl"></i>
                    </ControlButton>
                }


                {play
                    ? (
                        <ControlButton hidden={hide} disabled={sketch?.disabledControls.includes('play')} onClick={() => setPlay(false)} label={"Pause Sketch"}>
                            <i className="fa-solid fa-pause fa-xl"></i>
                        </ControlButton>
                    )
                    : (
                        <ControlButton hidden={hide} disabled={sketch?.disabledControls.includes('play')} onClick={() => setPlay(true)} label={"Play Sketch"}>
                            <i className="fa-solid fa-play fa-xl"></i>
                        </ControlButton>
                    )}

                {sketches.length > 1 &&
                    <ControlButton hidden={hide} onClick={() => next()} label={"Next Sketch"}>
                        <i className="fa-solid fa-chevron-right fa-xl"></i>
                    </ControlButton>
                }



            </>
        )
    }


    return(
        {
            states: {
                play, front, hide, controls, sketch, text
            },
            setters: {
                setHide, setPlay
            },

            renderControls,
        }
    )


}

// HOC to allow the use of useThree hook
const Scene = ({children, blind}) => {

    const gl = useThree((state) => state.gl);

    useLayoutEffect(() => {
        gl.setPixelRatio(blind)
    })

    return children
}

export const SketchComposition = ({play, front, hide, controls, sketch = null, className = ''}) => {

    return(
        <>
            <motion.div
                initial={{
                    opacity: 0,
                }}
                animate={{
                    opacity: hide ? 0 : 1,
                    zIndex: front && !hide ? 40 : 0,
                    // translateX: showFront ? [0, 100, 0] : [100, 0, 100]
                }}
                transition={{type: 'spring'}}
                className={`${className} w-screen fixed top-0 pointer-events-auto backdrop-blur-sm`}
            >
                {sketch && sketch.component}
            </motion.div>

            {controls &&
                <SketchControls />
            }
        </>
    )

}

export default function Background({showFront, play, hide, blind, className = '', controls = false}){

    const {scrollY, scrollYProgress} = useScroll()

    const [sketch, setSketch] = useState(0)

    const sketches = [
        {
            title: 'Cube Grid',
            component: <CubeGrid a={4} b={4} c={2} />,
        },
        {
            title: 'Sphere Grid',
            component:
                <Canvas>
                    <SphereGrid a={4} b={4} c={2} />
                </Canvas>,
        },
    ]



    return(
        <>

            <motion.div
                initial={{
                    opacity: 0,
                }}
                animate={{
                    opacity: hide ? 0 : 1,
                    zIndex: showFront && !hide ? 40 : 0,
                    // translateX: showFront ? [0, 100, 0] : [100, 0, 100]
                }}
                transition={{type: 'spring'}}
                className={`${className} w-screen fixed top-0 pointer-events-auto backdrop-blur-sm`}
            >
                <Canvas>
                    <Scene blind={blind}>
                        {sketches[sketch].component}
                    </Scene>
                </Canvas>
            </motion.div>

            {controls &&
                <SketchControls />
            }
        </>

    )
}

