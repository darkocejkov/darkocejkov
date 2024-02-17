import React, {Dispatch, RefObject, useMemo, useRef, useState} from "react";
import {ReactChild} from "../types.ts";
import {animate, motion, MotionValue, useDragControls, useMotionValue, useSpring} from "framer-motion";
import useSound from "use-sound";

import {createPortal} from "react-dom";
import {TbArrowsRandom} from "react-icons/tb";

// @ts-ignore
import popSFX from '../assets/sfx/pops.mp3'
// @ts-ignore
import hover from '../assets/sfx/primarySystemSounds/navigation_hover-tap.wav'
// @ts-ignore
import transitionRight from '../assets/sfx/primarySystemSounds/navigation_transition-right.wav'
// @ts-ignore
import confirm from '../assets/sfx/primarySystemSounds/state-change_confirm-up.wav'

import {random} from "../helpers.ts";
import {SpriteMap} from "use-sound/dist/types";

type Node = {
    // startPos: Position,
    children: ReactChild
    id: number
}

const popSpriteMap: SpriteMap = {
    a: [250, 420],
    b: [650, 820],
    c: [1830, 1920],
    d: [2780, 2880],
    e: [3750, 3840]
}

const NodeContainer = ({contentList}: {
    contentList: Node[]
}) => {

    const constraintRef = useRef(null)

    const springConfig = {
        // stiffness: Math.max(700 - d * 120, 0),
        // damping: (20 + (i * -2)),
        mass: 2,
        // mass: x,
    };

    const x = useSpring(useMotionValue(0), springConfig)
    const y = useSpring(useMotionValue(0), springConfig)

    const [active, setActive] = useState<number | null>(null)

    const total = contentList.length

    const [flag, setFlag] = useState(0)
    const [resetting, setResetting] = useState(false)

    const elementArray = useMemo(() => {
        return contentList.map((content, i) => {

            return (
                <NodePane
                    key={content.id}
                    total={total}
                    i={content.id}
                    x={x}
                    y={y}
                    active={active}
                    setActive={setActive}
                    constraint={constraintRef}
                    resetFlag={flag}
                >
                    {content.children}
                </NodePane>
            )
        })
    }, [flag])

    const [reset] = useSound(transitionRight, {
        interrupt: true,
        playbackRate: 1,
        volume: 0.5
    })

    const [shuffle] = useSound(confirm, {
        interrupt: true,
        volume: 0.5,
    })

    const handleReset = () => {
        reset()
        setFlag(flag => flag + 1)
        setResetting(true)
    }

    const handleShuffle = () => {
        shuffle()
    }


    if (resetting) {
        setTimeout(() => setResetting(false), 1000)
    }


    const actionVariants = {
        spin: {
            rotate: '-1turn',
            transition: {
                duration: .5
            }
        },
        still: {}
    }


    return createPortal(
        <div className={'fixed top-[5%] left-[5%] h-[90%] w-[90%]'}>

            <div className={'flex flex-col gap-2'}>
                <div ref={constraintRef}

                     className={'max-h-[80vh] bg-slate-900/10 rounded-xl grid-fill p-6 overflow-x-hidden'}>

                    {/**/}
                    {elementArray}
                </div>

                <div className={'flex justify-center gap-4 bg-slate-900/10 rounded-xl p-2 pb-3'}>
                    <button
                        onClick={handleReset}
                        className={'p-2 px-5 bg-slate-900/10 font-rubik rounded-xl button-shadow backdrop-blur-md transition-all'}>
                        <motion.i
                            variants={actionVariants}
                            animate={resetting ? 'spin' : 'still'}
                            className="fa-solid fa-arrow-rotate-left"
                        ></motion.i>
                    </button>

                    <button
                        onClick={handleShuffle}
                        className={'p-2 px-5 bg-slate-900/10 font-rubik rounded-xl button-shadow backdrop-blur-md transition-all'}>
                        <TbArrowsRandom/>
                    </button>

                </div>

            </div>


            {/*<div className={'fixed top-[80vh] left-1/2 -translate-x-1/2 -translate-y-1/2 z-30'}>*/}
            {/*    <button*/}
            {/*        onClick={handleReset}*/}
            {/*        className={'p-2 px-5 bg-slate-900/10 font-rubik rounded-xl button-shadow backdrop-blur-md transition-all'}>*/}
            {/*        <motion.i*/}
            {/*            variants={actionVariants}*/}
            {/*            animate={resetting ? 'spin' : 'still'}*/}
            {/*            className="fa-solid fa-arrow-rotate-left"*/}
            {/*        ></motion.i>*/}
            {/*    </button>*/}
            {/*</div>*/}

            {/*<Measure/>*/}

            {/*{elementArray}*/}
        </div>,
        document.body
    )
}

const resetIndexDelay = 200

const NodePane = ({total, i, x, y, active, setActive, children, constraint, resetFlag}: {
    children: ReactChild
    total: number,
    i: number,
    x: MotionValue,
    y: MotionValue,
    active: number | null,
    setActive: Dispatch<number | null>,
    constraint: RefObject<HTMLDivElement>,
    resetFlag: number
}) => {
    // const d = total - (i * total)

    const springConfig = {
        // stiffness: Math.max(700 - d * 120, 0),
        // damping: (20 + (i * -2)),
        mass: 1,
        // mass: x,
    };


    const dx = useSpring(x)
    // const dx = useSpring(x)
    const dy = useSpring(y)
    // const dy = useSpring(y)

    // const ref = useRef<HTMLDivElement>(null)

    // <i className="fa-solid fa-grip-dots"></i>
    const dragControls = useDragControls()

    function startDrag(event: React.PointerEvent<HTMLDivElement>) {
        dragControls.start(event, {snapToCursor: false})
    }

    const [up] = useSound(hover, {
        volume: 0.5
    })
    const [down] = useSound(hover, {
        playbackRate: 0.75,
        volume: 0.5
    })

    const [play] = useSound(popSFX, {
        sprite: popSpriteMap,
        volume: 0.1,
        interrupt: true,
    })

    const xx = useMotionValue(0)
    const yy = useMotionValue(0)

    const paneRef = useRef(null)
    const oldFlag = useRef(resetFlag)


    const handleReset = () => {
        oldFlag.current = resetFlag

        if (xx.get() !== 0 || yy.get() !== 0) {


            setTimeout(() => {


                //
                xx.stop()
                yy.stop()

                animate(xx.get(), 0, {
                    onUpdate: latest => xx.set(latest),
                    // onComplete: () => play({id: 'a'})
                })

                animate(yy.get(), 0, {
                    onUpdate: latest => yy.set(latest),
                    onComplete: () => play({id: 'b'})
                })
            }, i * resetIndexDelay)
        }
    }

    if (oldFlag.current !== resetFlag) {
        handleReset()
    }


    return (
        <>
            <motion.div
                ref={paneRef}
                drag
                dragConstraints={constraint}
                // dragTransition={{bounceStiffness: 500, bounceDamping: 20}}
                onDragStart={() => {
                    setActive(i)
                    // play({id: 'a'})
                    up()
                    return
                }}
                onDragEnd={() => {
                    setActive(null)
                    // play({id: 'b'})
                    down()
                    return
                }}
                dragControls={dragControls}
                dragListener={false}
                whileDrag={{
                    scale: 1.05,
                    rotateZ: `${random(25, true)}deg`
                }}
                initial={{
                    opacity: 0,
                }}
                animate={{
                    opacity: 1,
                }}
                style={{
                    x: xx,
                    y: yy,
                }}
                className={'backdrop-blur-md p-5 bg-slate-900/0 relative origin-center rounded-lg shadow-lg overflow-hidden select-none z-10 flex-1 h-fit'}
            >
                <div className={'absolute right-0 -top-2 p-1 flex gap-1 items-center justify-center'}>

                    <div onPointerDown={startDrag}>
                        <i className="fa-solid fa-grip-dots"></i>
                    </div>


                </div>

                {children}
            </motion.div>
        </>
    )
}

const Content = ({children}: {
    children: ReactChild
}) => (
    // bg-white/10
    <div
        className={'flex justify-center h-full w-full items-center rounded-xl overflow-y-auto overflow-x-hidden break-words'}>
        {children}
    </div>
)

export default function Tools({}) {
    const w = window.innerWidth
    const h = window.innerHeight


    // console.log('bounding: ', {bounding})

    // const content: Node[] = contentChildren.map((x, i) => {
    //     return {
    //         id: i,
    //         children: (
    //             <Content>
    //                 {x}
    //             </Content>
    //         )
    //     }
    // })

    return null

    // return (
    //     <>
    //         <NodeContainer contentList={content}/>
    //     </>
    // )
}
