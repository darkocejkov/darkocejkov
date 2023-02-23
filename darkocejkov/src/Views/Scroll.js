import React, {useState, useEffect, useRef} from 'react'

import {useScroll, useInView, motion} from "framer-motion";
import {smoothScrollId} from "../GlobalFunctions";
import Background from "../Components/Background";

export const ScrollView = ({}) => {

    const {scrollYProgress, scrollY} = useScroll()

    const titleView = useRef()
    const objView = useRef()
    const eduView = useRef()
    const expView = useRef()
    const linkView = useRef()

    const inViewExperience = useInView(expView)
    const inViewLinks = useInView(linkView)
    const inViewEducation = useInView(eduView)



    return(

        <>

            {/*<Background />*/}

            <motion.div
                className={'fixed bg-orange-500 bottom-0 left-0 right-0 h-[15px] origin-[0]'}
                // className={'progress-bar'}
                style={{ scaleX: scrollYProgress }} />

            <div className='h-[4000px] overflow-x-clip top-0 bg-gradient-to-b to-cyan-200 from-blue-500 flex flex-col items-center scroll-smooth'>

                <div className={'select-none self-start'}>

                    <motion.h1
                        ref={titleView}
                        animate={{
                            opacity: [0, 1],
                            // x: `50px`,
                            y: [`100vh`, `85vh`]
                        }}
                        // transition={{ease: 'easeInOut', duration: 0.12}}
                        style={{
                            x: scrollY,
                            translateY: scrollY,
                            // borderRadius: scrollYProgress,
                            // opacity: scrollYProgress
                        }}
                        className={`font-tabi md:text-8xl text-6xl w-fit p-2 break-word border-2`}
                    >
                        Darko Cejkov
                    </motion.h1>

                </div>

                <div ref={eduView} id={'education'} className={'info-box p-2 rounded-lg shadow'}>
                    <h2
                        style={{
                            opacity: inViewEducation ? 1 : 0,
                            transform: `transform(${inViewEducation ? '100px' : 0}, 0)`
                        }}
                        className="text-4xl font-tabi dark:text-white mt-10 transition-opacity">
                        Honors BSc. Computer Science & Psychology
                    </h2>
                    <h3 className="mt-2 ml-16 text-2xl font-sectra">
                        Wilfrid Laurier University <i className="fa-duotone fa-leaf-maple mx-3"></i>
                    </h3>
                </div>

                {/*<div >*/}
                {/*    <motion.h2*/}
                {/*        className="text-4xl font-tabi dark:text-white mt-10">*/}
                {/*        Honors BSc. Computer Science & Psychology*/}
                {/*    </motion.h2>*/}
                {/*    <h1 className="text-4xl font-tabi dark:text-white mt-10">*/}
                {/*        Honors BSc. Computer Science & Psychology*/}
                {/*    </h1>*/}


                {/*    <h3 className="mt-2 ml-16 text-2xl font-sectra">Wilfrid Laurier University <i className="fa-duotone fa-leaf-maple mx-3"></i></h3>*/}
                {/*</div>*/}

                <div ref={expView} id={'experience'} className={'info-box'}>
                    <h2
                        style={{
                            opacity: inViewExperience ? 1 : 0,
                        }}
                        className="text-4xl font-tabi dark:text-white mt-10 transition-all delay-300">
                        VVC
                    </h2>
                </div>

                <div ref={linkView} id={'links'} className={'info-box'}>
                    <h2
                        style={{
                            opacity: inViewLinks ? 1 : 0,
                        }}
                        className="text-4xl font-tabi dark:text-white mt-10 transition-all">
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

                </div>
            </div>

            <div className={`fixed right-0 inset-y-0 p-2 mt-10 flex flex-col`}>

                <motion.button
                    onClick={() => smoothScrollId('education')}
                    style={{
                        // translateY: scrollY
                    }}
                    className={'md:h-20 md:w-20 md:text-3xl text-xl flex items-center justify-center rounded-full bg-slate-900/20 hover:bg-slate-900/50 transition-colors '}>
                    🎓
                </motion.button>
                <motion.button
                    onClick={() => smoothScrollId('experience')}
                    style={{
                        // translateY: (scrollY)
                    }}
                    className={'md:h-20 md:w-20 md:text-3xl text-xl flex items-center justify-center rounded-full bg-slate-900/20 hover:bg-slate-900/50 transition-colors '}>
                    💼
                </motion.button>
                <motion.button
                    onClick={() => smoothScrollId('links')}
                    style={{
                        // translateY: (scrollY)
                    }}
                    className={'md:h-20 md:w-20 md:text-3xl text-xl flex items-center justify-center rounded-full bg-slate-900/20 hover:bg-slate-900/50 transition-colors '}>
                    🔗
                </motion.button>




            </div>
        </>

    )
}