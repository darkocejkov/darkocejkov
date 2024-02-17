import {ReactChild} from "../types.ts";
import {random} from "../helpers.ts";
import {motion} from "framer-motion";
import React, {useRef} from "react";

export const Pane = ({children, className = '', id, subtle = false}: {
    children: ReactChild,
    id: string,
    className?: string,
    subtle?: boolean
}) => {

    let translateY = random(subtle ? 10 : 50, true)
    let rotateZ = random(subtle ? 3 : 15, true)

    return (
        <motion.div id={id}
                    initial={{
                        opacity: 0,
                        translateY: translateY,
                        // rotateZ: rotateZ
                    }}
                    animate={{
                        opacity: 1,
                        translateY: 0,
                        // rotateZ: 0,
                        // transitionDelay: '0.1s'
                    }}
                    transition={{
                        type: 'spring',
                        mass: 2,
                    }}
                    className={`info-box p-5 relative  z-10 origin-center max-w-full md:max-w-[80%] rounded-lg shadow-lg min-w-[250px] ${className}`}>
            {children}
        </motion.div>
    )
}

export const PaneOutlineWrapper = ({children, className = ''}: {
    children: ReactChild,
    className?: string
}) => {
    return (
        <div
            className={`h-[8vw] w-[8vw] lg:h-[2vw] lg:w-[2vw] font-fira blur-pane-outline bg-slate-900/20 ${className}`}>
            {children}
        </div>
    )
}

export const TransparentPane = ({children, className = ''}: {
    children: ReactChild,
    className?: string,
}) => {
    return (
        <motion.div
            initial={{
                opacity: 0,
                translateY: 10,
            }}
            animate={{
                opacity: 1,
                translateY: 0,
            }}
            transition={{
                type: 'spring',
                mass: 2,
            }}
            className={className}>
            {children}
        </motion.div>
    )
}

export const DragPane = ({children, className, id, subtle = false}: {
    children: ReactChild,
    id: string,
    className?: string,
    subtle?: boolean
}) => {

    let translateY = random(subtle ? 10 : 50, true)
    let rotateZ = random(subtle ? 3 : 15, true)

    const constraintRef = useRef(null)

    return (

        <>
            <div ref={constraintRef} className={'fixed top-0 left-0 h-screen w-screen'}/>
            <motion.div id={id}
                        drag
                        dragElastic={0.15}
                        whileDrag={{
                            backgroundColor: 'rgba(7, 89, 133, 0.09)',
                            scale: 1.05
                        }}
                        dragConstraints={constraintRef}
                        initial={{
                            opacity: 0,
                            translateY: translateY,
                            rotateZ: rotateZ
                        }}
                        animate={{
                            opacity: 1,
                            translateY: 0,
                            rotateZ: 0,
                            // transitionDelay: '0.1s'
                        }}
                        transition={{
                            type: 'spring',
                            mass: 2,
                        }}
                        className={`select-none info-box p-5 relative md:max-w-[80%] z-10 origin-center max-w-full rounded-lg shadow-lg ${className}`}
            >
                {children}
            </motion.div>
        </>
    )
}