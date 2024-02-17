import React, {useReducer, useState} from 'react'
import {ReactChild} from "../types.ts";
import {useToast} from "../Hooks/Toast.tsx";
import {ControlButton} from "./Buttons.tsx";
import {useControls} from "leva";

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
        className={'flex flex-row self-center font-aeonik gap-0 text-xs pointer-events-auto hover:gap-1 font-normal transition-all'}>
        {children}
    </div>
)

export function ControlBar({}) {


    const modes = [
        {
            label: 'Sketch',
            icon: <i className="fa-solid fa-scribble"></i>,
            component: <SketchControls key={'sketch'}/>,
            id: 0
        },
        // {
        //     label: 'Media',
        //     icon: <i className="fa-solid fa-music"></i>,
        //     component: <MusicControls key={'music'} dispatch={dispatch} state={state}/>,
        //     id: 1
        // },
        {
            label: 'Tools',
            icon: <i className="fa-solid fa-music"></i>,
            component: <ToolController key={'tools'}/>,

            id: 2
        }
    ]


    const [mode, setMode] = useState<ControlMode>()

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
                <ButtonLayout>
                    <ControlButton label={'Menu'} onClick={() => setMode(undefined)}>
                        <i className="fa-solid fa-arrow-left"></i>
                    </ControlButton>

                    <>
                        {mode.component}
                    </>

                </ButtonLayout>
            }

        </div>
    )
}

export const ToolController = () => {

    const {addToast} = useToast()

    return (
        <>
            <ControlButton label={"Trigger Modal"}>
                <i className="fa-solid fa-window fa-xl"></i>
            </ControlButton>

            <ControlButton onClick={() => addToast('Toasty!', {duration: 0})} label={"Random Toast"}>
                <i className="fa-solid fa-bread-slice-butter fa-xl"></i>
            </ControlButton>
        </>
    )
}

const playlist = [
    {
        title: 'Faith In Strangers',
        author: 'Andy Stott',
        path: '../assets/songs/Andy Stott - Faith In Strangers.mp3'
    },
]

export function MusicBar({}) {

    // const [play, exposedData] = useSound(fernace, {
    //     volume: 0.2,
    // })
    const [state, dispatch] = useReducer((state, action) => {

        if (action.type === 'STOP' && state === 'PLAYING') {
            // exposedData.stop()
            return 'STOPPED'
        } else if (action.type === 'PLAY') {
            // play()
            return 'PLAYING'
        } else if (action.type === 'PAUSE') {
            // exposedData.pause()
            return 'PAUSED'
        }

    }, 'STOPPED')

    // https://web.dev/webaudio-intro/
    // https://www.twilio.com/blog/audio-visualisation-web-audio-api--react
    // https://www.telerik.com/blogs/adding-audio-visualization-react-app-using-web-audio-api
    // https://github.com/goldfire/howler.js#quick-start

    return (
        <div
            className={'fixed min-h-[5%] min-w-[10%] bottom-0 opacity-60 hover:opacity-100 inset-x-3/4 p-3 translate-y-1/2 hover:translate-y-0 -translate-x-1/2 w-fit link-background-to-r bg-gradient-to-r from-orange-400 to-orange-400 z-50 rounded-t-xl shadow-lg backdrop-blur-sm'}>
            <ButtonLayout>
                <ControlButton onClick={() => dispatch({type: 'PLAY'})} label={"Play"}>
                    <i className="fa-solid fa-play fa-xl"></i>
                </ControlButton>
                <ControlButton onClick={() => dispatch({type: 'STOP'})} label={"Stop"}>
                    <i className="fa-solid fa-stop fa-xl"></i>
                </ControlButton>
                <ControlButton onClick={() => dispatch({type: 'PAUSE'})} label={"Pause"}>
                    <i className="fa-solid fa-pause fa-xl"></i>
                </ControlButton>
            </ButtonLayout>
        </div>
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
        <>
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
        </>
    )
}

export const GlobalControls = () => {

    const {} = useControls('Metadata', {
        showLighting: true,
        showStats: true
    })

    return null

}
export const WorldControls = ({}) => {

    const {name, aNumber} = useControls({name: 'World', aNumber: 0})

    return (
        <>
            <GlobalControls/>
        </>
    )
}