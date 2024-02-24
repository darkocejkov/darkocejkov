import React, {
    SetStateAction,
    TouchEventHandler,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
    WheelEventHandler
} from "react";
import {Arena, Discord, Github, HackerRank, LinkedIn, Linktree, Notion} from '../assets/svg/SVG'
import {Position2D, ReactChild} from "../types";
import {Tooltip} from "antd";
import {motion, useMotionTemplate, useSpring} from 'framer-motion'

import {BiChevronLeft, BiChevronRight, BiReset} from 'react-icons/bi'
import {SiDiscord, SiGithub, SiHackerrank, SiLinkedin, SiLinktree, SiNotion, SiYoutube} from "react-icons/si";
import {IconContext} from "react-icons";
import {px2vh, radToDeg, randomFromList, vh2px, writeClipboard} from "../helpers.ts";
import {Rule} from "../Components/Layout.tsx";
import {useToast} from "../Hooks/Toast.tsx";

type Link = {
    label: string,
    icon: ReactChild,
    url?: string,
    clipboard?: {
        text: string,
    }
}

const links = [
    {
        label: 'Github',
        icon: <SiGithub/>,
        url: 'https://github.com/darkocejkov'
    },
    {
        label: 'LinkedIn',
        icon: <SiLinkedin/>,
        url: 'https://www.linkedin.com/in/darko-cejkov/\n'
    },
    {
        label: 'Notion',
        icon: <SiNotion/>,
        url: 'https://www.notion.so/darkocheykov/Darko-Cejkov-4ad2da60e1da4b83a24c3fbd809293be?pvs=4'
    },
    {
        label: 'Are.na',
        icon: <Arena/>,
        url: 'https://www.are.na/darko-cejkov-t-ekov-cheykov'
    },
    {
        label: 'Youtube',
        icon: <SiYoutube/>,
        url: 'https://www.are.na/darko-cejkov-t-ekov-cheykov'
    },
    {
        label: 'Discord',
        icon: <SiDiscord/>,
        clipboard: {
            text: 'cybersaint#0118',
            //"vm8s3yA6" FRIEND CODE ID
        }
    },
    {
        label: 'Linktree',
        icon: <SiLinktree/>,
        url: 'https://linktr.ee/darkocejkov'
    },
    {
        label: 'HackerRank',
        icon: <SiHackerrank/>,
        url: 'https://www.hackerrank.com/darkocheykov'
    },


]


const Link = ({label, icon, url, clipboard}: Link) => {

    const {addToast} = useToast()

    const copyToClip = (text: string) => {
        writeClipboard(text, () => addToast(`Copied: "${text}"`))
    }


    if (clipboard) {
        return (
            //onClick={}
            <button onClick={() => copyToClip(clipboard.text)}>
                {icon}
            </button>
        )
    }

    return (
        <a href={url} target={'_blank'}
           rel={"noreferrer noopener"}>
            {icon}
        </a>
    )
}

const colors = [
    // 'bg-neutral-600',
    // 'bg-stone-700',
    'bg-red-600',
    'bg-orange-500',
    'bg-amber-600',
    'bg-yellow-400',
    'bg-lime-300',
    'bg-green-300',
    'bg-cyan-400',
    'bg-blue-700',
    'bg-indigo-400',
    'bg-rose-500',
]

export default function Links({}) {


    return (
        <div className={'flex flex-col justify-center items-center gap-3 '}>


            <IconContext.Provider value={{size: `${l}px`}}>
                <Circle elements={links}/>
            </IconContext.Provider>
        </div>
    )
}

const l: number = 100 //px

function triangulate(r: number, theta: number) {

    return (
        {
            x: r * Math.sin(theta),
            y: r * Math.cos(theta),

        })
}

const startingAngle = 0
const direction = -1

const boxSizeVh = {
    x: 100,
    y: 100,
}

const boxSizePx = {
    x: vh2px(boxSizeVh.x),
    y: vh2px(boxSizeVh.y)
}


/*
    This component is meant to handle rendering a list of React elements, in the shape of a scrollable circle

    The equation of a circle is as follows:
        (x - h)^2 + (y - k)^2 = r^2
        - where X and Y are the axes
        - h and k are transformers, shifting the center of the circle
        - r is the radius of the circle

    The equation of a simple circle, centered around the origin is:
        x^2 + y^2 = r^2

    And even simpler, with a radius of 1:
        x^2 + y^2 = 1

    So, in order to render HTML elements in the shape of a circle, we need to destructure this problem:
        1. Have a list of N elements
        2. Ingest this list to some function that takes N and each element's index, i.
        3. Create some React element, passing it the render content, along with the position in X/Y

    -- CALCULATING X/Y POSITION --
    A circle has 2(Pi) = 360deg of rotation
    Given that we have N elements, and the spacing of elements on the circle (the points of the circle) are equally distributed across the circ. of the circle,
    then we can easily calculate the angles of distribution, if we know at which angle to start at.

        x = r * sin(angle)
        y = r * cos(angle)

   -- RADIUS and UNITS--
   Units of pixels translate poorly in small, < 1 unit changes in the visual. If we want the bounding box to use responsive units of height, then we need to
   translate those units to pixels.

   -- CENTER --

 */

type Size = {
    vh: number,
    px: number
}


const CircleElement = ({theta, angle, i, className = '', children, coords, N, element, setActive, size}: {
    children: ReactChild,
    theta: number,
    angle: number,
    i: number,
    className?: string,
    coords: { x: number, y: number },
    size: {
        x: Size,
        y: Size,
        l: Size
    },
    setActive: React.Dispatch<SetStateAction<number>>,

    N: number,
    element: Link,
}) => {


    const active: boolean = useMemo(() => {
        const rotations = Math.floor(Math.abs(theta) / 360)

        const degAngle = Math.round(Math.abs(radToDeg(angle)))
        // const active = false

        let total = theta

        if (rotations >= 1) {
            total = theta > 0 ? theta - (rotations * 360) : theta + (rotations * 360)
        }

        return total > 0 ? 360 - Math.round(total) === degAngle : Math.abs(Math.round(total)) === degAngle

    }, [theta])

    useLayoutEffect(() => {
        if (active) {
            setActive(i)
        }
    }, [active])

    // const randomTextColor = active ? randomFromList(textColors) : ''
    // const randomFillColor = active ? randomFromList(fillColors) : ''
    // ${randomTextColor} ${randomFillColor}

    return (
        <motion.div
            className={`absolute ${className} rounded-full  ${active ? randomFromList(colors) : ''} backdrop-blur-md transition-colors`}
            initial={{
                x: size.x.px / 2,
                y: size.y.px / 2,
                opacity: 0,
            }}
            animate={{
                opacity: 1,
                // x: [boxSizePx.x / 2, coords.x],
                // y: [boxSizePx.y / 2, coords.y],
                // x: [size.x.px / 2, coords.x],
                // y: [size.y.px / 2, coords.y],
                x: coords.x,
                y: coords.y,
                rotateZ: -theta,
                scale: active ? 1.5 : .5,
                filter: active ? 'blur(0px)' : 'blur(4px)'
            }}
        >

            {children}

            {/*<div*/}
            {/*    className={` absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[110%] w-[110%] backdrop-blur-lg -z-10 rounded-full`}/>*/}

            {/*<div*/}
            {/*    className={`${active ? randomFromList(colors) : 'bg-white/30'} absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[120%] w-[120%] -z-10 rounded-full transition-all`}/>*/}

        </motion.div>
    )
}


const Circle = ({elements}: {
    elements: Link[]
}) => {


    //  Slices represents the equal distribution angle for elements along the circumference of the circle
    const slices = 2 * Math.PI / elements.length

    // Theta represents the current angle of rotation, in either positive or negative degrees
    const [theta, setTheta] = useState(0)
    // the `currentActive` state represents the currently "selected" item, via the INDEX number
    const [currentActive, setCurrentActive] = useState(0)

    // const boxSizeVh = {
    //     x: 100,
    //     y: 100,
    // }
    //
    // const boxSizePx = {
    //     x: vh2px(boxSizeVh.x),
    //     y: vh2px(boxSizeVh.y)
    // }

    const [size, setSize] = useState({
        x: {
            vh: boxSizeVh.x,
            px: vh2px(boxSizeVh.x)
        },
        y: {
            vh: boxSizeVh.y,
            px: vh2px(boxSizeVh.y)
        },
        l: {
            vh: px2vh(l),
            px: l
        }
    })

    let array = []
    for (let i = 0; i < elements.length; i++) {
        const angle = ((i * slices) + startingAngle) * direction

        // const coords = triangulate((boxSizePx.x / 2), angle)
        //
        // const adjusted = {
        //     x: ((coords.x + (boxSizePx.x / 2)) - (l / 2)),
        //     y: ((coords.y + (boxSizePx.y / 2)) - (l / 2)),
        // }

        const coords = triangulate((size.x.px / 2), angle)

        const adjusted = {
            x: ((coords.x + (size.x.px / 2)) - (size.l.px / 2)),
            y: ((coords.y + (size.y.px / 2)) - (size.l.px / 2)),
        }

        array.push(
            <CircleElement size={size} key={i} element={elements[i]} N={elements.length} angle={angle} theta={theta}
                           i={i}
                           coords={adjusted} setActive={setCurrentActive}>

                <Link {...elements[i]} />

                {/*{elements[i].icon}*/}
            </CircleElement>
        )
    }


    const rotateZ = useSpring(0)
    const rotateDeg = useMotionTemplate`${rotateZ}deg`

    const goalAngle = useRef(0)

    const handleScroll: WheelEventHandler<HTMLDivElement> = (e) => {

        //in order to scroll "smoothly", we want to change the rotation of the bounding box to be in increments based on the division angle
        const snapAngle = radToDeg(slices)
        const direction = e.deltaY < 0 ? -1 : 1

        const currentAngle = rotateZ.get()
        const go = snapAngle * direction

        // however, if we are in BETWEEN a transition, we add on 45, and start the transition
        // const to: number = (currentAngle + (snapAngle * (direction)))
        const relativeGo = (currentAngle + go)
        const absoluteGo = (goalAngle.current + go)

        //  in order to have this flawlessly work, we must work on multiples of the slice angle
        //  1. check if we are in a transition
        if (currentAngle % snapAngle === 0) {
            rotateZ.set(relativeGo)
            setTheta(relativeGo)
            goalAngle.current = relativeGo
        } else {
            rotateZ.set(absoluteGo)
            setTheta(absoluteGo)
            goalAngle.current = absoluteGo
        }
    }

    const touchStart: React.MutableRefObject<undefined | Position2D> = useRef()
    const touchPos: React.MutableRefObject<undefined | Position2D> = useRef()

    const handleTouchStart: TouchEventHandler<HTMLDivElement> = (e) => {
        const XY = {
            x: e.changedTouches[0].pageX,
            y: e.changedTouches[0].pageY,
        }

        touchStart.current = XY


    }
    const handleTouchMove: TouchEventHandler<HTMLDivElement> = (e) => {

        // console.log(`[DRAG]: `, e.changedTouches[0])

        const XY = {
            x: e.changedTouches[0].pageX,
            y: e.changedTouches[0].pageY,
        }

        if (touchStart.current) {

            let delta_X = touchStart.current.x - XY.x
            let delta_Y = touchStart.current.y - XY.y

            console.log(`[DRAG] ${delta_X}:${delta_Y}`)

            if (delta_X > (size.l.px / 2)) {
                rotateRight()
                resetTouch()
                return
            } else if (delta_X < -(size.l.px / 2)) {
                rotateLeft()
                resetTouch()
                return
            }
        }

        touchPos.current = XY


    }

    const resetTouch = () => {
        touchPos.current = undefined
        touchStart.current = undefined
    }

    const rotateLeft = () => {
        const snapAngle = radToDeg(slices)
        rotateZ.set(goalAngle.current - snapAngle)
        setTheta(goalAngle.current - snapAngle)
        goalAngle.current = goalAngle.current - snapAngle
    }

    const rotateRight = () => {
        const snapAngle = radToDeg(slices)
        rotateZ.set(goalAngle.current + snapAngle)
        setTheta(goalAngle.current + snapAngle)
        goalAngle.current = goalAngle.current + snapAngle
    }

    const resetScroll = () => {
        rotateZ.stop()
        rotateZ.set(0)
        goalAngle.current = 0
        setTheta(0)
    }


    useLayoutEffect(() => {

        const handleResize = (e: UIEvent) => {

            let {innerHeight, innerWidth} = e.srcElement as Window

            // vh: boxSizeVh.y,
            // px: vh2px(boxSizeVh.y)
            setSize(size => {
                return (
                    {
                        ...size,
                        x: {
                            vh: px2vh(innerHeight),
                            px: innerHeight
                        },
                        y: {
                            vh: px2vh(innerHeight),
                            px: innerHeight
                        },

                    }
                )
            })


        }

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    const currentElement: Link = elements[currentActive]

    return (
        <div className={'fixed -top-1/4 left-1/2 -translate-x-1/2'}
             onWheel={handleScroll}
             onTouchMove={handleTouchMove}
             onTouchStart={handleTouchStart}
             onTouchEnd={resetTouch}
        >
            {/*     CIRCLE ELEMENTS     */}
            <motion.div
                className={'border-slate-900/10 border-2 relative rounded-full '}
                style={{
                    // width: `${size.x.vh}vh`,
                    // height: `${size.y.vh}vh`,
                    width: size.x.px,
                    height: size.y.px,
                    rotateZ: rotateDeg
                }}
            >
                {array}
            </motion.div>

            {/*  BUTTONS   */}
            <div className={'flex flex-col gap-2 absolute top-1/2 left-1/2 -translate-x-1/2 '}>


                <div
                    className={`skew-x-6 skew-y-2 uppercase absolute top-[110%] left-1/2 -translate-x-1/2 font-rubik md:text-6xl text-3xl`}
                >
                    <p>{currentElement.label}</p>

                    <Rule/>

                    <p className={'lowercase text-end text-lg'}>
                        {currentElement.clipboard
                            ? 'COPY'
                            : 'GOTO LINK'
                        }
                    </p>

                </div>


                <div
                    className={'flex gap-2 justify-center items-center'}>

                    <button onClick={rotateLeft}>
                        <BiChevronLeft size={'40px'}/>
                    </button>

                    <button
                        className={'flex flex-col gap-2 justify-center items-center'}
                        onClick={resetScroll}>
                        <BiReset size={'50px'}
                                 className={'text-slate-900/40 hover:text-slate-900/90 hover:scale-125 transition-all'}/>

                        {/*<span className={'font-rubik'}>{-theta.toFixed(0)}°</span>*/}
                        <span className={'font-rubik text-xl'}>{(-theta).toFixed(0)}°</span>
                    </button>

                    <button onClick={rotateRight}>
                        <BiChevronRight size={'40px'}/>
                    </button>

                </div>

            </div>


        </div>

    )
}