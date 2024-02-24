import React, {useState} from "react";
import {motion} from "framer-motion";

import {FiArrowRight, FiMail} from 'react-icons/fi'
import {Placements, ReactChild} from "../types.ts";

import {Label} from "./Tooltip.tsx";

export const CTAButton = ({label, icon = 'fa-arrow-right'}: {
    label: string,
    icon?: string
}) => {

    const [hover, setHover] = useState(false)

    return (
        <button
            type={'submit'}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            className={'font-rubik group cursor-pointer bg-slate-900/10 p-3 button-shadow rounded-lg justify-center items-center transition-all active:bg-slate-900/20 flex gap-3 relative'}>
            <p>{label}</p>

            <motion.span
                className={'absolute left-3/4'}
                initial={{
                    translateX: '0%'
                }}
                animate={{
                    translateX: hover ? '120%' : '0%',
                    opacity: hover ? 0 : 1,
                    rotateZ: hover ? '180deg' : '0deg',
                }}
            >
                <FiArrowRight size={'1rem'}/>
            </motion.span>

            <motion.span
                className={'absolute left-3/4'}
                initial={{
                    translateX: '0%'
                }}
                animate={{
                    translateX: hover ? '120%' : '0%',
                    opacity: hover ? 1 : 0,
                    rotateZ: hover ? '360deg' : '180deg',
                }}
                // transition={{
                //     delay: 0.06
                // }}
            >
                <FiMail size={'1rem'}/>
            </motion.span>
        </button>
    )
}
export const HoverButton = ({onClick, children, className}: {
    onClick: () => void,
    children: ReactChild,
    className?: string
}) => {

    // link-background
    return (
        <button type={'button'} onClick={onClick}
                className={`p-2 flex link-background-to-r rounded-sm bg-gradient-to-r from-amber-400 to-amber-400 z-20  ${className ? className : 'text-xl font-rubik normal-case'}`}>
            {children}
        </button>
    )
}
export const IconButton = ({
                               label,
                               onClick,
                               children,
                               disabled = false,
                               placement = 'TOP',
                               holdEvents = false
                           }: {
    label: string,
    onClick?: () => void,
    children: ReactChild,
    disabled?: boolean,
    placement?: Placements
    holdEvents?: boolean
}) => {

    const [down, setDown] = useState(false)

    const handlePointerDown = () => {
        setDown(true)
    }

    const handlePointerUp = () => {
        setDown(false)
    }

    return (
        <button disabled={disabled} onClick={onClick} onPointerDown={handlePointerDown} onPointerUp={handlePointerUp}
                className={`bg-transparent hover:bg-slate-600/10 p-3 rounded-md group transition-all`}>
            {children}

            <Label down={down} disabled={disabled} label={label} placement={placement}/>
        </button>
    )
}


export const BlurButton = ({children}: {
    children: ReactChild
}) => {
    return (
        <button
            className={`h-[25px] w-[25px] backdrop-blur-xl font-fira outline outline-offset-2 outline-slate-900/50 bg-slate-900/20 rounded-full outline-1`}>
            {children}
        </button>
    )
}

export const ControlButton = ({
                                  label,
                                  hidden = false,
                                  onClick,
                                  children,
                                  disabled = false,
                                  placement = 'TOP',
                                  holdEvents = false,
                                  onHover
                              }: {
    label: string,
    hidden?: boolean,
    onClick?: () => void,
    children: ReactChild,
    disabled?: boolean,
    placement?: Placements
    holdEvents?: boolean
    onHover?: (b: boolean) => void
}) => {

    const [down, setDown] = useState(false)

    const handlePointerDown = () => {
        setDown(true)
    }

    const handlePointerUp = () => {
        setDown(false)
    }


    return (
        <button disabled={disabled}
                onMouseEnter={() => onHover ? onHover(true) : null}
                onMouseLeave={() => onHover ? onHover(false) : null}
                onClick={onClick}
                onPointerDown={handlePointerDown} onPointerUp={handlePointerUp}
                className={`${hidden ? 'hidden' : 'visible'} bg-transparent hover:bg-slate-600/10 p-3 rounded-md group transition-all`}>
            {children}

            <Label down={down} disabled={disabled} label={label} placement={placement}/>
        </button>
    )
}