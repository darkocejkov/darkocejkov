/*
    Darko Cejkov / darkocejkov
    2023

    SCROLL COMPONENTS
    - Elements that are focused around scroll interactions
 */

import React, {RefObject, useId, useRef} from "react";
import {ReactChild} from "../types.ts";
import {motion, useMotionValueEvent, useScroll, useTransform} from "framer-motion";
import {Text} from '../Components/Typography.tsx'

const ScrollCylinder = () => {


    const elements: ReactChild[] = [

        // <div className={'flex'}>
        //     <Text text={"fullstack."} className={"text-[5rem] font-rubik"} animFunction={toBeginning}/>
        // </div>,
        // <div className={'flex'}>
        //     <Text text={"developer."} className={"text-[5rem] font-rubik"} animFunction={toEnd}/>
        // </div>,
        // <div className={'flex'}>
        //     <Text text={"engineer."} className={"text-[5rem] font-rubik"} animFunction={toEnd}/>
        // </div>,
        // <div className={'flex'}>
        //     <Text text={"design."} className={"text-[5rem] font-rubik"} animFunction={toEnd}/>
        // </div>,
        // <div className={'flex'}>
        //     <Text text={"curator."} className={"text-[5rem] font-rubik"} animFunction={toEnd}/>
        // </div>,
        // <div className={'flex'}>
        //     <Text text={"creator."} className={"text-[5rem] font-rubik"} animFunction={toEnd}/>
        // </div>,
    ]

    const rootRef = useRef<HTMLDivElement>(null)
    const id = useId()

    return (
        <div>
            <div
                id={id}
                ref={rootRef}
                className={'text-5xl flex flex-col gap-5 font-rubik overflow-y-scroll scrollbar-none px-6 max-h-[40vh]'}
            >
                {elements.map((el, i) => {
                    return (
                        // <Item i={i}/>
                        <ScrollElement i={i} root={rootRef}>
                            {el}
                        </ScrollElement>
                    )
                })}

                {elements.map((el, i) => {
                    return (
                        // <Item i={i}/>
                        <ScrollElement i={i + elements.length} root={rootRef}>
                            {el}
                        </ScrollElement>
                    )
                })}
            </div>
        </div>

    )
}

const ScrollElement = ({children, i, root}: {
    children: ReactChild,
    i: number,
    root: RefObject<HTMLDivElement>
}) => {

    const elementRef = useRef<HTMLDivElement>(null)

    const {scrollYProgress} = useScroll({container: root, target: elementRef, offset: ["start end", "end start"]})

    useMotionValueEvent(scrollYProgress, "change", (l) => {
        if (i === 5) console.log(l)
    })

    const opacity = useTransform(scrollYProgress, [0, .25, .5], ['.4', '1', '.4'])
    const rotateX = useTransform(scrollYProgress, [0, .25, .5], ['-90deg', '0deg', '90deg'])
    const scale = useTransform(scrollYProgress, [0, .25, .5], [.9, 1.1, .9])

    const id = useId()

    return (
        <motion.div
            className={'flex justify-center items-center p-2 rounded-xl bg-slate-900/10 '}
            style={{
                rotateX: rotateX,
                opacity: opacity,
                scale: scale,
            }}
            id={id}
            key={i}
            ref={elementRef}
        >

            {children}
        </motion.div>
    )

}
