import React, {useState, useEffect, useRef, useLayoutEffect} from 'react';
import {ReactChild} from "../types";

const TextReplace = ({textArray, time = 1000, className = '', restartDelay = 0, endText = ''}: {
    textArray: ReactChild[],
    time?: number //ms
    className?: string,
    restartDelay?: number
    endText?: ReactChild
}) => {

    const ref = useRef<HTMLSpanElement>(null)


    useLayoutEffect(() => {

        // ref.current.innerText = unicodeSymbols[Math.floor(Math.random() * (unicodeSymbols.length - 1))]

        const id = setInterval(() => {
            if (!ref.current) return

            // if (ref.current.innerText === endText) return

            // FIXME: Replace `unicodeSymbols` with real array
            // const r = Math.floor(Math.random() * (unicodeSymbols.length - 1))
            // ref.current.innerText = unicodeSymbols[r]

        }, time)

        return () => {
            clearInterval(id)
        }

    }, [])

    return (
        <span className={className + ' font-fira'} ref={ref}></span>
    )

}