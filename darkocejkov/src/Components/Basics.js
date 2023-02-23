import React, {useRef, useState} from 'react'
import {useInView} from "framer-motion";

export const CustomLink = ({}) => {
    return null
}

export const Banner = ({children}) => {

    return(
        <div className={'backdrop-blur-sm z-50 fixed top-0 inset-x-0 font-tabi p-2 bg-slate-900/70 text-white flex justify-center lg:items-center uppercase'}>
            {children}
        </div>
    )

}

export const Button = ({}) => {

    return(
        <button></button>
    )

}

export const InfoBox = ({id, children}) => {

    const ref = useRef()
    const inView = useInView(ref)

    return(
        <div ref={ref} id={id}
             style={{
                 opacity: inView ? 1 : 0,
                 transform: inView ? "none" : "translateY(-200px)",
                 filter: inView ? 'blur(0px)' : 'blur(5px)',
                 transition: 'all 0.5s ease-in-out 0.2s'
             }}
             className={'h-screen info-box p-5 rounded-lg shadow'}>
            {children}
        </div>
    )
}