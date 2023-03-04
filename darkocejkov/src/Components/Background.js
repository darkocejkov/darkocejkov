import React, {useState, useEffect, Suspense, useLayoutEffect} from 'react';

import {Canvas, useFrame, useLoader, useThree} from '@react-three/fiber'
import {motion} from 'framer-motion'

import Box from './ThreeJS/Box';
import {useMotionValueEvent, useScroll} from "framer-motion";

import {MyApp, SketchControls} from "./Basics";
import {CubeGrid, SphereGrid} from "../Sketches/Grids";
import {PerspectiveCamera} from "@react-three/drei";



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
            <span className={'text-white bg-slate-700/50 whitespace-nowrap origin-bottom p-2 rounded-lg text-lg group-hover:scale-100 scale-0 absolute bottom-[110%] transition-all'}>
                {label}
            </span>
        </button>
    )
}




export const useSketch = () => {

    const [play, setPlay] = useState(false)
    const [front, setFront] = useState(false)
    const [hide, setHide] = useState(true)
    const [controls, setControls] = useState(false)

    // const controlMap = [
    //     {time: [
    //         {
    //             variable: play,
    //             show: false,
    //             fn: setPlay(true),
    //             icon: '',
    //             label: 'Play Sketch'
    //         },
    //         {
    //             variable: play,
    //             show: true,
    //             fn: setPlay(false),
    //             icon: '',
    //             label: 'Pause Sketch'
    //         },
    //     ]},
    // ]

    const sketches = [
        {
            title: 'Cube Grid',
            component: <CubeGrid a={1} b={1} c={1} />,
            defaultStates: [{play: true}],
            disabledControls: ['play']
        },
        {
            title: 'Sphere Grid',
            component: <SphereGrid a={1} b={1} c={1} />,
            defaultStates: [{play: true}],
            disabledControls: [],
        },
    ]

    const [sketch, setSketch] = useState(null)
    const [sketchIndex, setSketchIndex] = useState(null)

    // useEffect(() => {
    //
    // }, [sketch])

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
                play, front, hide, controls, sketch
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


    useEffect(() => {
        console.log(sketch)
    }, [])

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
                <Canvas>
                    {/*<Scene blind={blind}>*/}
                        {sketch && sketch.component}
                    {/*</Scene>*/}
                </Canvas>
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
            component: <SphereGrid a={4} b={4} c={2} />,
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

