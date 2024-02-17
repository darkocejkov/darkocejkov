import {ReactChild} from "../types.ts";
import React, {useEffect, useRef, useState} from "react";
import {motion, useMotionValueEvent, useScroll} from "framer-motion";
import {useDragScroll} from "../Hooks/CustomHooks.js";

export const BoxCarousel = ({children, className, id, progressColor = 'bg-slate-900'}: {
    children: ReactChild,
    className?: string,
    id: string,
    progressColor?: string,
}) => {

    const carouselRef = useRef<HTMLDivElement>(null)

    const scrollLeft = (n = -150) => {
        if (carouselRef.current) {
            console.log('scrollLEft')
            carouselRef.current.scrollBy({
                left: n,
                behavior: 'smooth'
            })
        }
    }

    const scrollRight = (n = 150) => {
        if (carouselRef.current) {
            console.log('scrollRight')
            carouselRef.current.scrollBy({
                left: n,
                behavior: 'smooth'
            })
        }
    }

    const {scrollXProgress, scrollX} = useScroll({container: carouselRef})

    const [showL, setShowL] = useState(false)
    const [showR, setShowR] = useState(true)

    useMotionValueEvent(scrollXProgress, 'change', (latest) => {
        // console.log(`[scrollXProgress] ${id}`, latest)

        if (latest >= 1) {
            setShowR(false)
        } else if (!showR) {
            setShowR(true)
        }

        if (latest === 0) {
            setShowL(false)
        } else if (!showL) {
            setShowL(true)
        }

    })


    const {mouseDownHandler, hasScroll} = useDragScroll({container: carouselRef, id})

    useEffect(() => {
        if (hasScroll === false) {
            setShowL(false)
            setShowR(false)
        }
    }, [hasScroll])

    const timerRef = useRef<any>()

    const handlePointerDown = (n: number) => {
        timerRef.current = setInterval(() => {

            carouselRef.current?.scrollBy({
                left: n,
                behavior: 'smooth'
            })
        }, 50)
    }
    const handlePointerUp = () => {
        clearInterval(timerRef.current)
    }


    return (

        <div className={`flex select-none flex-nowrap justify-center gap-1 relative ${className ? className : ''}`}>

            <motion.div
                animate={{
                    opacity: (!showL && !showR) ? 0 : 1,
                }}
                className={`absolute ${progressColor} -top-[5px] rounded-sm gr left-0 w-full h-[2px]`}
                style={{
                    scaleX: scrollXProgress
                }}
            />


            {/*absolute left-0 bottom-0*/}
            <motion.button
                animate={{
                    opacity: showL ? 1 : 0,
                    translateX: showL ? '0%' : '-20%',
                }}
                transition={{type: 'spring'}}
                className={`bg-slate-900/20 p-2 rounded-xl`}
                onClick={() => scrollLeft(-9999)}
            >
                <i className="fa-solid fa-chevrons-left fa-sm "></i>
            </motion.button>
            <motion.button
                animate={{
                    opacity: showL ? 1 : 0,
                    translateX: showL ? '0%' : '-20%',
                }}
                transition={{type: 'spring'}}
                className={`bg-slate-900/20 p-2 rounded-xl`}
                // onClick={() => scrollLeft()}
                onPointerDown={() => handlePointerDown(-25)}
                onPointerUp={handlePointerUp}
                onMouseLeave={handlePointerUp}
            >

                <i className="fa-solid fa-chevron-left fa-sm"></i>
            </motion.button>


            <motion.div
                // animate={{
                //     borderRadius:  showL === false || showR === false ? '10%' : '20%'
                // }}
                onMouseDown={mouseDownHandler} id={id} ref={carouselRef}
                className={'rounded-xl scrollbar-none flex overflow-x-auto flex-nowrap gap-2'}>
                {children}
            </motion.div>

            {/*absolute right-0 bottom-0*/}
            {/*{scrollXProgress < 1 &&*/}
            <motion.button
                animate={{
                    opacity: showR ? 1 : 0,
                    translateX: showR ? '0%' : '20%',
                }}
                transition={{type: 'spring'}}
                className={`bg-slate-900/20 p-2 rounded-xl`}
                // onClick={() => scrollRight()}
                onPointerDown={() => handlePointerDown(25)}
                onPointerUp={handlePointerUp}
                onMouseLeave={handlePointerUp}
            >
                <i className="fa-solid fa-chevron-right fa-sm"></i>
            </motion.button>

            <motion.button
                animate={{
                    opacity: showR ? 1 : 0,
                    translateX: showR ? '0%' : '20%',
                }}
                transition={{type: 'spring'}}
                className={`bg-slate-900/20 p-2 rounded-xl`}
                onClick={() => scrollRight(9999)}
            >
                <i className="fa-solid fa-chevrons-right fa-sm"></i>
            </motion.button>
            {/*}*/}


        </div>


    )
}