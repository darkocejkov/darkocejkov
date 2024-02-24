import {quadToCenter} from "../animations.ts";
import {AnimationFunction, ReactChild} from "../types.ts";
import React, {useEffect, useState} from "react";
import {motion} from "framer-motion";

export const TextReplace = ({textArray, time = 1000, className = '', restartDelay = 0}: {
    textArray: string[],
    time?: number //ms
    className?: string,
    restartDelay?: number
}) => {

    const [text, setText] = useState({text: textArray[0], i: 0})

    useEffect(() => {
        const id = setInterval(() => {

            setText(text => {
                let n = text.i + 1
                if (n > (textArray.length - 1)) n = 0


                return {text: textArray[n], i: n}
            })
        }, time)

        return () => {
            clearInterval(id)
        }
    }, [])

    return (
        <p className={className}>{text.text}</p>
    )
}

export const Text = ({text, className = '', animFunction = quadToCenter, element = 0}: {
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


export const Char = ({children, index, total, className = '', animFunction, element = 0}: {
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
