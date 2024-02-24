import React, {RefObject, useId, useRef, useState} from "react";

import {motion, useInView, useMotionValueEvent, useScroll, useTransform} from "framer-motion";

import {IconContext} from "react-icons";
import {toBeginning, toEnd, quadToCenter} from "../animations.ts";


import {ReactChild, AnimationFunction} from "../types.ts";


export default function Hero({}) {


    return (
        <motion.div className={'container flex flex-col justify-center items-center transition-all select-none '}>

            <IconContext.Provider value={{size: '8rem'}}>

                <div className={'flex flex-col md:gap-5 justify-center items-center'}>
                    <div className={'flex flex-wrap gap-5 justify-center items-center'}>
                        {/*<Text text={"darko cejkov."} className={"text-[4rem] md:text-[8rem] font-tabi"}/>*/}
                        <div className={'flex'}>
                            <Text text={"darko"}
                                  className={"text-[4rem] md:text-[6rem] lg:text-[8rem] font-tabi leading-none"}
                                  animFunction={toBeginning}/>

                        </div>
                        <div className={'flex'}>
                            <Text text={"cejkov."}
                                  className={"text-[4rem] md:text-[6rem] lg:text-[8rem] -mt-12 sm:mt-0 font-tabi leading-none"}
                                  animFunction={toEnd}/>
                        </div>
                    </div>

                    <div className={'flex'}>
                        <Text text={"fullstack."}
                              className={"text-[3rem] md:text-[4rem] lg:text-[5rem]  font-rubik leading-none"}
                              animFunction={toBeginning}
                              element={1.5}/>
                    </div>

                    <div className={'flex'}>
                        <Text text={"developer."}
                              className={"text-[3rem] md:text-[4rem] lg:text-[5rem]   font-rubik leading-none"}
                              animFunction={toEnd}
                              element={2.5}/>
                    </div>

                    <div className={'flex'}>
                        <Text text={"engineer."}
                              className={"text-[3rem] md:text-[4rem] lg:text-[5rem]   font-rubik leading-none"}
                              animFunction={toBeginning}
                              element={3.5}/>
                    </div>

                    <div className={'flex'}>
                        <Text text={"designer."}
                              className={"text-[3rem] md:text-[4rem] lg:text-[5rem]   font-rubik leading-none"}
                              animFunction={toEnd}
                              element={4.5}/>
                    </div>

                </div>


            </IconContext.Provider>
        </motion.div>
    )
}


const Text = ({text, className = '', animFunction = quadToCenter, element = 0}: {
    text: string,
    className?: string,
    animFunction?: AnimationFunction,
    element?: number
}) => {

    const charArray = []

    for (let i = 0; i < text.length; i++) {
        let c = text[i]

        let char: string | JSX.Element = c

        if (c === " ") {
            char = (
                <>
                    &nbsp;
                </>
            )
        }

        charArray.push(
            <Char key={`${i}${char}`} element={element} index={i} total={text.length} className={className}
                  animFunction={animFunction}>
                {char}
            </Char>
        )
    }

    return (
        <>
            {charArray}
        </>
    )
}


const Char = ({children, index, total, className = '', animFunction, element = 0}: {
    children: ReactChild
    index: number,
    total: number,
    className?: string,
    animFunction?: AnimationFunction,
    element?: number
}) => {

    let y = Math.floor((Math.random() * 200) - 100)


    let delay = 0
    if (animFunction) delay = animFunction({
        N: total,
        i: index,
    }) + element


    const variants = {
        hidden: {
            color: '#f97316',
            opacity: 0,
            translateY: `${y}%`,
            translateX: `${y}%`,
            skewX: '15deg',
            scale: 0.8,
            rotate: '34deg',
        },
        visible: {
            color: '#0f172a',
            opacity: 1,
            translateY: '0%',
            translateX: '0%',
            skewX: '0deg',
            scale: 1,
            rotate: '0deg',
        },
        hovered: {
            color: '#f97316',
        }
    }

    const [animDone, setAnimDone] = useState(false)
    const [hover, setHover] = useState(false)

    if (!animDone) {
        return (
            <motion.span
                initial={"hidden"}
                animate={"visible"}
                variants={variants}
                onAnimationComplete={() => setAnimDone(true)}

                transition={{
                    type: "spring",
                    delay: delay,
                    damping: 9.5,
                }}
                className={className}>

                {/*<TextReplace textArray={symbols} time={60} endText={children}/>*/}
                {children}
            </motion.span>
        )
    }

    return (

        <motion.span
            animate={{
                color: hover ? '#f97316' : '#0f172a',
                scale: hover ? 1.05 : 1.0,
                rotateZ: hover ? '3deg' : '0deg'
            }}


            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}

            transition={{
                type: "spring",
            }}
            className={className}
        >
            {children}
        </motion.span>
    )
}


