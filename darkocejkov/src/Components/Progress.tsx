import {motion, useScroll, useTransform} from "framer-motion";
import React, {useRef} from "react";

export const LoadBar = ({progress}: {
    progress: number
}) => {
    return (
        <motion.div
            initial={{
                width: '0vw'
            }}
            animate={{
                width: `${progress}vw`
            }}
            transition={{
                ease: 'easeOut'
            }}
            className={'fixed top-0 left-0 h-[5px] bg-blue-400/50 rounded-br-xl z-[100]'}/>
    )
}

export const DocumentProgress = () => {
    const {scrollYProgress, scrollY} = useScroll()

    const titleView = useRef()


    const bottomProgress = useTransform(scrollYProgress, [0, .3], [0, 1])
    const sideProgress = useTransform(scrollYProgress, [.3, .6], [0, 1])
    const topProgress = useTransform(scrollYProgress, [.6, 1], [0, 1])


    return (
        <div className={'z-30 pointer-events-none'}>
            <motion.div
                className={'fixed bg-orange-500 bottom-0 left-0 z-20 right-0 h-[5px] origin-center'}
                // className={'progress-bar'}
                style={{scaleX: bottomProgress}}/>
            {}
            <motion.div
                className={'fixed bg-orange-500 w-[5px] left-0 inset-y-0 z-20 h-full origin-bottom'}
                // className={'progress-bar'}
                style={{scaleY: sideProgress}}
            />

            <motion.div
                className={'fixed bg-orange-500 w-[5px] right-0 inset-y-0 z-20 h-full origin-bottom'}
                // className={'progress-bar'}
                style={{scaleY: sideProgress}}
            />

            <motion.div
                className={'fixed bg-orange-500 h-[5px] top-0 left-0 z-20 w-[50vw] origin-left'}
                transition={{type: 'spring'}}
                // className={'progress-bar'}
                style={{scaleX: topProgress}}
            />

            <motion.div
                className={'fixed bg-orange-500 h-[5px] top-0 right-0 z-20 w-[50vw] origin-right'}
                // className={'progress-bar'}
                style={{scaleX: topProgress}}
            />
        </div>
    )

}