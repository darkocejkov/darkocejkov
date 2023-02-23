import React, {useState, useEffect, useRef} from 'react'

import {
    useScroll,
    useInView,
    motion,
    useTransform,
    useMotionValueEvent,
    useMotionValue,
    useSpring,
    useTime
} from "framer-motion";
import {smoothScrollId} from "../GlobalFunctions";
import Background from "../Components/Background";
import {InfoBox} from "../Components/Basics";

export const ScrollView = ({}) => {

    const {scrollYProgress, scrollY} = useScroll()

    const [blind, setBlind] = useState(1)

    const titleView = useRef()

    const eduY = useTransform(scrollYProgress, [0, 1], ['0vh','80vh'], {clamp: false})
    const eduX = useTransform(scrollYProgress, [0, .25,.5, .75, 1], ['0vw','12vw','15vw','12vw','0vw'], {clamp: false})
    const eduScale = useTransform(scrollYProgress, [0, .5, 1], [1, .7, 1], {clamp: false})

    const expY = useTransform(scrollYProgress, [0, 1], ['10vh','70vh'], {clamp: false})
    const expX = useTransform(scrollYProgress, [0, .25,.5, .75, 1], ['0vw','7vw','10vw','7vw','0vw'], {clamp: false})
    const expScale = useTransform(scrollYProgress, [0, .5, 1], [1, .8, 1], {clamp: false})

    const linY = useTransform(scrollYProgress, [0, 1], ['20vh','60vh'], {clamp: false})
    const linX = useTransform(scrollYProgress, [0, .25,.5, .75, 1], ['0vw','2vw','5vw','2vw','0vw'], {clamp: false})
    const linScale = useTransform(scrollYProgress, [0, .5, 1], [1, .9, 1], {clamp: false})

    const fileY = useTransform(scrollYProgress, [0, 1], ['30vh','50vh'], {clamp: false})
    const fileX = useTransform(scrollYProgress, [0, .25,.5, .75, 1], ['0vw','0vw','0vw','0vw','0vw'], {clamp: false})
    const fileScale = useTransform(scrollYProgress, [0, .5, 1], [1, 1, 1], {clamp: false})

    const bottomProgress = useTransform(scrollYProgress, [0, .3], [0, 1])
    const sideProgress = useTransform(scrollYProgress, [.3, .6], [0, 1])
    const topProgress = useTransform(scrollYProgress, [.6, 1], [0, 1])

    return(

        <>

            <Background showFront={false} blind={blind}/>

            <motion.div
                className={'fixed bg-orange-500 bottom-0 left-0 z-20 right-0 h-[5px] origin-center'}
                // className={'progress-bar'}
                style={{ scaleX: bottomProgress }} />

            <motion.div
                className={'fixed bg-orange-500 w-[5px] left-0 inset-y-0 z-20 h-full origin-bottom'}
                // className={'progress-bar'}
                style={{ scaleY: sideProgress }}
            />

            <motion.div
                className={'fixed bg-orange-500 w-[5px] right-0 inset-y-0 z-20 h-full origin-bottom'}
                // className={'progress-bar'}
                style={{ scaleY: sideProgress }}
            />

            <motion.div
                className={'fixed bg-orange-500 h-[5px] top-0 left-0 z-20 w-[50vw] origin-left'}
                // className={'progress-bar'}
                style={{ scaleX: topProgress }}
            />

            <motion.div
                className={'fixed bg-orange-500 h-[5px] top-0 right-0 z-20 w-[50vw] origin-right'}
                // className={'progress-bar'}
                style={{ scaleX: topProgress }}
            />

            <div className='min-h-screen overflow-x-clip top-0 bg-gradient-to-b to-cyan-200 from-blue-500 flex flex-col gap-5 pt-12 items-center justify-evenly select-none'>

                <motion.div
                    className={`fixed bottom-10 z-20 p-5`}
                    ref={titleView}
                    animate={{
                        opacity: [0, 1],
                        y: [-100, 0]
                    }}
                >

                    <h1 className={`font-tabi text-6xl`}>
                        Darko Cejkov
                    </h1>
                </motion.div>

                <InfoBox id={'education'}>
                    <h2 className="text-4xl font-tabi">
                        Honors BSc. Computer Science & Psychology
                    </h2>
                    <h3 className="text-2xl font-sectra">
                        Wilfrid Laurier University <i className="fa-duotone fa-leaf-maple mx-3"></i>
                    </h3>
                </InfoBox>

                <InfoBox id={'experience'}>
                    <motion.h2 className="text-4xl font-tabi dark:text-white mt-10">
                        VVC
                    </motion.h2>
                </InfoBox>

                <InfoBox id={'links'}>
                    <h2 className="text-4xl font-tabi dark:text-white mt-10 transition-all">
                        Links
                    </h2>
                    <ul>
                        <li>
                            GitHub
                        </li>
                        <li>
                            LinkedIn
                        </li>
                        <li>
                            Notion
                        </li>
                    </ul>

                </InfoBox>

                <InfoBox id={'files'}>
                    <h2 className="text-4xl font-tabi dark:text-white mt-10 transition-all">
                        Files
                    </h2>
                    <ul>
                        <li>
                            GitHub
                        </li>
                        <li>
                            LinkedIn
                        </li>
                        <li>
                            Notion
                        </li>
                    </ul>
                </InfoBox>
            </div>

            <div className={`fixed inset-y-0 p-2 mt-10`}>

                <motion.button
                    onClick={() => smoothScrollId('education')}
                    style={{
                        translateY: eduY,
                        translateX: eduX,
                        scale: eduScale,
                        // borderRadius: buttonRadius

                    }}
                    className={'md:h-20 md:w-20 md:text-3xl text-xl absolute flex items-center rounded-3xl hover:rounded-full justify-center bg-slate-900/50 hover:bg-slate-900/70'}>
                    🎓
                </motion.button>
                <motion.button
                    onClick={() => smoothScrollId('experience')}
                    style={{
                        translateY: expY,
                        translateX: expX,
                        scale: expScale,

                        // borderRadius: buttonRadius
                    }}
                    className={'md:h-20 md:w-20 md:text-3xl text-xl absolute flex items-center rounded-3xl hover:rounded-full justify-center bg-slate-900/50 hover:bg-slate-900/70'}>
                    💼
                </motion.button>
                <motion.button
                    onClick={() => smoothScrollId('links')}
                    style={{
                        translateY: linY,
                        translateX: linX,
                        scale: linScale,
                        // borderRadius: buttonRadius
                    }}
                    className={'md:h-20 md:w-20 md:text-3xl text-xl absolute flex items-center rounded-3xl hover:rounded-full justify-center bg-slate-900/50 hover:bg-slate-900/70'}>
                    🔗
                </motion.button>

                <motion.button
                    onClick={() => smoothScrollId('files')}
                    style={{
                        translateY: fileY,
                        translateX: fileX,
                        scale: fileScale

                        // borderRadius: buttonRadius
                    }}
                    className={'md:h-20 md:w-20 md:text-3xl text-xl absolute flex items-center rounded-3xl hover:rounded-full justify-center bg-slate-900/50 hover:bg-slate-900/70'}>
                    📁
                </motion.button>

                {/*<div className={'fixed bottom-20 right-5 -rotate-90'}>*/}
                {/*    <input type="range" min=".1" max="1" step={.1} value={blind} onChange={(e) => setBlind(e.target.value)}/>*/}
                {/*</div>*/}


            </div>
        </>
    )
}

