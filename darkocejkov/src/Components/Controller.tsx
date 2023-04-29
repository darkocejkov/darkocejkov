import React, {useState} from 'react'
import {Canvas} from "@react-three/fiber";
import {ControlButton} from '../Components/Basics.tsx'
import {ReactChild} from "../types.ts";

type ControlMode = {
    label: string,
    id: number,
    component: ReactChild,
    icon?: ReactChild
}

const ButtonLayout = ({children}: {
    children: ReactChild
}) => (
    <div
        className={'flex flex-row self-center font-aeonik gap-0 text-xs pointer-events-auto hover:gap-4 font-normal transition-all'}>
        {children}
    </div>
)

export function ControlBar({}) {

    const modes = [
        {
            label: 'Sketch',
            icon: <i className="fa-solid fa-scribble"></i>,
            id: 0
        },
        {
            label: 'Media',
            icon: <i className="fa-solid fa-music"></i>,
            id: 1
        },
        {
            label: 'Tools',
            icon: <i className="fa-solid fa-music"></i>,
            id: 1
        }
    ]

    const [mode, setMode] = useState<ControlMode>()

    console.log({mode})

    return (
        <div
            className={'fixed min-h-[5%] min-w-[10%] bottom-0 opacity-60 hover:opacity-100 inset-x-1/2 p-3 translate-y-1/2 hover:translate-y-0 -translate-x-1/2 w-fit link-background-to-r bg-gradient-to-r from-amber-400 to-amber-400 z-50 rounded-t-xl shadow-lg backdrop-blur-sm'}>

            {!mode &&
                <ButtonLayout>
                    <>
                        {modes.map(m => {
                            return (
                                <ControlButton key={m.id} label={m.label} onClick={() => setMode(m)}>
                                    {m.label}
                                </ControlButton>
                            )
                        })}
                    </>
                </ButtonLayout>
            }

            {mode &&
                <ControlButton label={'Menu'} onClick={() => setMode(undefined)}>
                    <i className="fa-solid fa-arrow-left"></i>
                </ControlButton>
            }

            {/*<SketchControls/>*/}
        </div>
    )
}

export const ToolController = () => {

    // Meant as a DEV utility to open/trigger things like modals
    return (
        <div
            className={'fixed left-0 inset-y-1/2 opacity-60 hover:opacity-100 inset-x-1/2 p-3 h-fit w-fit link-background bg-gradient-to-b from-amber-400 to-amber-400 z-50 rounded-t-xl shadow-lg backdrop-blur-sm '}>
            <div className={'flex flex-col gap-2'}>

                <button>
                    modal
                </button>

            </div>

        </div>
    )
}

function MusicControls({}) {

    // use-sound package with useSound hook
    // visualizator through Web Audio API

    return (
        <ButtonLayout>
            <></>
        </ButtonLayout>
    )
}

function SketchControls({}) {

    const [play, setPlay] = useState(false)
    const [front, setFront] = useState(false)
    const [hide, setHide] = useState(true)
    const [controls, setControls] = useState(false)

    const sketches: object[] = []

    const [sketch, setSketch] = useState(null)
    const [sketchIndex, setSketchIndex] = useState(null)

    return (
        <ButtonLayout>
            <ControlButton onClick={() => setHide(false)} label={"Show Sketch"}>
                <i className="fa-solid fa-eye fa-xl"></i>

                {/*    <i className="fa-solid fa-eye-low-vision fa-xl"></i>*/}
            </ControlButton>

            <ControlButton onClick={() => setFront(false)} label={"Send Sketch Backwards"}>
                <i className="fa-solid fa-send-backward fa-xl"></i>

                {/*    <i className="fa-solid fa-bring-forward fa-xl"></i>  */}
            </ControlButton>

            <ControlButton onClick={() => setControls(false)} label={"Close Sketch Settings"}>
                <i className="fa-solid fa-circle-half-stroke fa-xl transition-all"></i>
            </ControlButton>

            <ControlButton onClick={() => null} label={"Previous Sketch"}>
                <i className="fa-solid fa-chevron-left fa-xl"></i>
            </ControlButton>

            <ControlButton onClick={() => setPlay(true)} label={"Play Sketch"}>
                <i className="fa-solid fa-play fa-xl"></i>

                {/*    <i className="fa-solid fa-pause fa-xl"></i>*/}
            </ControlButton>

            <ControlButton onClick={() => null} label={"Next Sketch"}>
                <i className="fa-solid fa-chevron-right fa-xl"></i>
            </ControlButton>
        </ButtonLayout>
    )
}