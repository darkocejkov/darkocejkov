import React, {
    Dispatch,
    RefObject,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import {
    animate, AnimatePresence,
    motion,
    MotionValue,
    useDragControls, useInView,
    useMotionValue, useMotionValueEvent, useScroll,
    useSpring, useTransform
} from "framer-motion";


import {open, closing, closed} from '../assets/ascii/eyes.js'

import {IconContext} from "react-icons";
import {
    SiTypescript,
    SiBlender,
    SiJavascript,
    SiWebpack,
    SiMysql,
    SiRedis,
    SiAdobeillustrator,
    SiAdobephotoshop,
    SiAdobepremierepro,
    SiPassport,
    SiExpress,
} from "react-icons/si";
import {
    TbBrandThreejs,
    TbBrandCpp,
    TbArrowsRandom,
    TbCircleArrowDownFilled,
    TbCircleArrowDown,
    TbArrowNarrowDown
} from 'react-icons/tb'
import {BsFillSquareFill} from 'react-icons/bs'
import {FaNodeJs, FaFigma, FaGit, FaReact, FaAws, FaJava, FaLinux, FaPython} from "react-icons/fa";
import {Link} from "react-router-dom";
import {Pane, PaneOutlineWrapper, TransparentPane} from "../Components/Window.tsx";
import {Rule} from "../Components/Layout.tsx";
import {BlurButton} from "../Components/Buttons.tsx";
import {createPortal} from "react-dom";
import Marquee from "react-fast-marquee";
import {FanWave} from "../Sketches/Waves.tsx";
import {ReactChild} from "../types.ts";
import {bgColorMap} from "../theme.ts";
import {TextReplace} from "../Components/Typography";

// const contentChildren: ReactChild[] = [
//     <p className={'font-rubik '}>
//         <span className={'font-tabi text-3xl'}>Hellooo!</span>
//         <hr/>
//         <span>I'm Darko ʕ ꈍᴥꈍʔ</span>
//     </p>,
//     <p className={'font-rubik text-center'}>
//         I'm a developer/engineer. Experience in Web. Pursuing dreams that coalesce technical and creative skills.
//     </p>,
//     <p className={'font-rubik flex flex-col text-center gap-1'}>
//         Here's a quick look at tech I've used:
//         <div className={'flex gap-2 justify-evenly flex-wrap'}>
//             <IconContext.Provider value={{size: '1.5rem'}}>
//
//                 <IconPane title={'TypeScript'}>
//                     <SiTypescript className={'text-yellow-300'}/>
//                 </IconPane>
//
//
//                 <IconPane title={'JavaScript/ES6'}>
//
//                     <SiJavascript className={'text-green-600'}/>
//                 </IconPane>
//
//                 <IconPane title={'Python 3'}>
//
//                     <FaPython className={'text-red-500'}/>
//                 </IconPane>
//
//                 <IconPane title={'CLANG (C/C++)'}>
//
//                     <TbBrandCpp className={'text-red-500'}/>
//                 </IconPane>
//
//                 <IconPane title={'Java OOP'}>
//
//                     <FaJava className={'text-red-500'}/>
//                 </IconPane>
//
//
//
//                 <IconPane title={'ReactJS'}>
//
//                     <FaReact className={'text-green-600'}/>
//                 </IconPane>
//
//                 <IconPane title={'ThreeJS'}>
//
//                     <TbBrandThreejs className={'text-yellow-300'}/>
//                 </IconPane>
//
//                 <IconPane title={'NodeJS Runtime'}>
//
//                     <FaNodeJs className={'text-green-600'}/>
//                 </IconPane>
//
//                 <IconPane title={'Git VCS'}>
//
//                     <FaGit className={'text-green-600'}/>
//                 </IconPane>
//
//                 <IconPane title={'PassportJS Auth'}>
//
//                     <SiPassport className={'text-green-600'}/>
//                 </IconPane>
//
//                 <IconPane title={'ExpressJS Middleware'}>
//
//                     <SiExpress className={'text-green-600'}/>
//                 </IconPane>
//
//                 <IconPane title={'MySQL relational database'}>
//
//                     <SiMysql className={'text-green-600'}/>
//                 </IconPane>
//
//                 <IconPane title={'Redis key/value database'}>
//
//                     <SiRedis className={'text-yellow-600'}/>
//                 </IconPane>
//
//                 <IconPane title={'Linux administration'}>
//
//                     <FaLinux className={'text-green-600'}/>
//                 </IconPane>
//
//                 <IconPane title={'Blender'}>
//
//                     <SiBlender className={'text-red-500'}/>
//                 </IconPane>
//
//                 <IconPane title={'Illustrator'}>
//
//                     <SiAdobeillustrator className={'text-yellow-300'}/>
//                 </IconPane>
//
//                 <IconPane title={'Photoshop'}>
//
//                     <SiAdobephotoshop className={'text-green-600'}/>
//                 </IconPane>
//
//                 <IconPane title={'Premiere Pro'}>
//
//                     <SiAdobepremierepro className={'text-green-600'}/>
//                 </IconPane>
//
//                 <IconPane title={'Figma design prototypes'}>
//
//                     <FaFigma className={'text-red-600'}/>
//                 </IconPane>
//
//                 <IconPane title={'AWS (S3, SES, EC2, ECS, Lightsail, Amplify)'}>
//
//                     <FaAws className={'text-yellow-300'}/>
//                 </IconPane>
//             </IconContext.Provider>
//         </div>
//         <span>for specifics, check out my <Link className={'link'} to={'/experience'}>experience</Link> </span>
//     </p>,
//     <p className={'font-rubik flex flex-col gap-2 items-center justify-center'}>
//         <p className={'text-xl'}>Here's what I <em className={'link'}>really</em> do:</p>
//         <TextReplace className={'font-fira'} textArray={[
//             'Develop code',
//             'Design ideas',
//             'Create action',
//             'Curate taste',
//             'Break things',
//             '... then fix them.',
//             'Overcomplicate',
//             'Simplify',
//             'Refactor'
//         ]}/>
//     </p>,
//     <p className={'font-rubik text-center'}>
//         <span className={'text-xl'}>My Mantra</span>
//         <br/>
//         <span>I learn. I make. I do. I have fun.</span>
//     </p>,
//     <p className={'font-rubik text-center'}>At the heart of my soul, I am creative and never like to sit still. My
//         passion is in finding new things and learning about the
//         fundamentals.</p>,
//     <p className={'font-rubik text-center'}>Gaming, Computers, Software, Audio/Video Production & Editing, DJing,
//         Animals, Sketching & Painting, Tinkering.</p>,
//     <p className={'font-rubik text-center'}>I'm inspired by new, sleek, modern designs - while at the same time,
//         love the nostalgia of the 90s/Y2K era.</p>,
//     <p className={'font-rubik text-center'}>I love thrifting and vintage. I love animals - rats, cats, dogs, bears,
//         snakes.</p>,
//     <p className={'font-rubik text-center'}>Obsessed with cyberpunk/dystopia/sci-fi. Akira, Lain, Ghost In The
//         Shell, Tokyo Ghost, Sandman,
//         Blade Runner, Blade, Matrix.</p>,
//     <pre className={'font-fira text-[.25rem]'}>
//         <TextReplace time={250} textArray={[
//             open,
//             closing,
//             closed,
//             closing,
//             open,
//         ]}/>
//     </pre>,
//     <TextReplace textArray={dancing} time={500} className={'text-3xl'}/>,
// ]

export default function About({}) {

    const rootRef = useRef(null)

    const {scrollYProgress} = useScroll()

    const [canScroll, setCanScroll] = useState(true)

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        if (latest >= 0.1) {
            setCanScroll(false)
        } else if (!canScroll) {
            setCanScroll(true)
        }
    })

    const hobbyRef = useRef(null)
    const {scrollYProgress: hobbyProgress} = useScroll({target: hobbyRef, offset: ['start center', 'end end']})

    const hobbySpring = useSpring(hobbyProgress)

    return (
        <>
            <div
                className={'w-screen  flex flex-col gap-12 items-center justify-start scrollbar-none'}
                ref={rootRef}>

                <TransparentPane className={'flex justify-center mt-[30vh]'}>
                    <p className={'font-rubik text-2xl md:text-5xl text-center flex flex-col gap-3'}>
                        <span
                            className={'font-tabi font-bold text-6xl md:text-9xl scale-x-110 scale-y-150 letter-breath'}>hello</span>
                        <div className={`w-full h-[1px] bg-slate-900 self-center`}/>
                        <span>i'm darko. <span>:)</span> </span>
                    </p>
                </TransparentPane>

                <Marquee gradient={false} autoFill={true}
                         className={'h-[30vh] skew-y-[45deg] select-none'}>
                    <p className={'salt text-6xl md:text-8xl hard-shadow rounded-full mx-3 px-10 skew-y-6 bg-orange-400 font-unique font-bold uppercase text-white'}>Developer</p>
                    <p className={'salt text-6xl md:text-8xl hard-shadow rounded-full mx-3 px-10 -skew-y-6 bg-orange-400 font-unique font-bold uppercase text-white'}>Designer</p>
                    <p className={'salt text-6xl md:text-8xl hard-shadow rounded-full mx-3 px-10 skew-y-6 bg-orange-400 font-unique font-bold uppercase text-white'}>Engineer</p>
                    <p className={'salt text-6xl md:text-8xl hard-shadow rounded-full mx-3 px-10 -skew-y-[8deg] bg-orange-400 font-unique font-bold uppercase text-white'}>Maker</p>
                </Marquee>

                <DescriptionBlock>
                    Fullstack web developer, passionate in visual experiences.
                </DescriptionBlock>

                <motion.div
                    ref={hobbyRef}
                    className={'w-screen relative h-[80vh] z-20 scale-110'}
                >
                    <UnrollStripes content={hobbies} progress={hobbySpring}/>
                </motion.div>

                <DescriptionBlock>
                    Symphony of colors, shapes, and ideas.
                </DescriptionBlock>

                <IconGrid/>

                <DescriptionBlock>
                    <TextReplace className={' uppercase'} textArray={[
                        'Develop code',
                        'Design systems',
                        'Create action',
                        'Curate taste',
                        'Break things',
                        '... then fix them.',
                        'Overcomplicate',
                        'Simplify',
                        'Refactor'
                    ]}/>
                </DescriptionBlock>

                <DescriptionBlock>
                    Modern aesthetics fused with Y2K flavor.
                </DescriptionBlock>

            </div>

            <AnimatePresence>
                {canScroll &&
                    <ScrollIndicator/>
                }
            </AnimatePresence>
        </>
    );
}

const IconGrid = () => {

    const ref = useRef(null)
    const {scrollYProgress} = useScroll({target: ref, offset: ['start center', 'end center']})
    const transformSkew = useTransform(scrollYProgress, [0, 1], ['0deg', '-2deg'])

    return (
        <motion.div
            ref={ref}
            className={'w-[90%] p-2 flex flex-wrap gap-24 items-center justify-center overflow-hidden'}
            style={{
                skewY: transformSkew,
            }}
        >
            <IconContext.Provider value={{size: '4rem', className: 'drop-shadow-hard'}}>

                <IconPane title={'TypeScript'}>
                    <SiTypescript className={'text-yellow-300'}/>
                </IconPane>

                <IconPane title={'JavaScript/ES6'}>

                    <SiJavascript className={'text-green-600'}/>
                </IconPane>

                <IconPane title={'Python 3'}>

                    <FaPython className={'text-red-500'}/>
                </IconPane>

                <IconPane title={'CLANG (C/C++)'}>

                    <TbBrandCpp className={'text-red-500'}/>
                </IconPane>

                <IconPane title={'Java'}>

                    <FaJava className={'text-red-500'}/>
                </IconPane>

                <IconPane title={'ReactJS'}>

                    <FaReact className={'text-green-600'}/>
                </IconPane>

                <IconPane title={'ThreeJS'}>

                    <TbBrandThreejs className={'text-yellow-300'}/>
                </IconPane>

                <IconPane title={'NodeJS'}>

                    <FaNodeJs className={'text-green-600'}/>
                </IconPane>

                <IconPane title={'Git/VCS'}>

                    <FaGit className={'text-green-600'}/>
                </IconPane>

                <IconPane title={'PassportJS'}>

                    <SiPassport className={'text-green-600'}/>
                </IconPane>

                <IconPane title={'ExpressJS'}>

                    <SiExpress className={'text-green-600'}/>
                </IconPane>

                <IconPane title={'MySQL'}>

                    <SiMysql className={'text-green-600'}/>
                </IconPane>

                <IconPane title={'Redis'}>

                    <SiRedis className={'text-yellow-600'}/>
                </IconPane>

                <IconPane title={'Linux'}>

                    <FaLinux className={'text-green-600'}/>
                </IconPane>

                <IconPane title={'Blender'}>

                    <SiBlender className={'text-red-500'}/>
                </IconPane>

                <IconPane title={'Illustrator'}>

                    <SiAdobeillustrator className={'text-yellow-300'}/>
                </IconPane>

                <IconPane title={'Photoshop'}>

                    <SiAdobephotoshop className={'text-green-600'}/>
                </IconPane>

                <IconPane title={'Premiere Pro'}>

                    <SiAdobepremierepro className={'text-green-600'}/>
                </IconPane>

                <IconPane title={'Figma'}>

                    <FaFigma className={'text-red-600'}/>
                </IconPane>

                <IconPane title={'AWS'}>

                    <FaAws className={'text-yellow-300'}/>
                </IconPane>
            </IconContext.Provider>

            <div className={'flex flex-wrap justify-center items-center gap-5 p-4 shadow-lg rounded-full'}>
                <div className={'flex flex-col justify-center items-center'}>
                    <BsFillSquareFill className={'text-green-600'}/> Experienced
                </div>
                <div className={'flex flex-col justify-center items-center'}>
                    <BsFillSquareFill className={'text-yellow-300'}/> Intermediate
                </div>
                <div className={'flex flex-col justify-center items-center'}>
                    <BsFillSquareFill className={'text-red-600'}/> Beginner
                </div>
            </div>

        </motion.div>
    )
}

const FillBlock = () => {
    const ref = useRef(null)
    const {scrollYProgress} = useScroll({target: ref, offset: ['start end', 'end start']})
    const transformSkew = useTransform(scrollYProgress, [0, 1], ['0deg', '5deg'])

    return (
        <motion.div
            ref={ref}
            // className={`w-[90%] rounded-md skew-x-1 md:skew-x-3 hard-shadow bg-slate-900/90 text-[1.5rem] md:text-[5rem] p-3 z-30 mix-blend-darken`}>
            className={`w-screen h-[30vh] bg-cover bg-center bg-fixed`}
            style={{
                skewY: transformSkew,
                backgroundImage: "url('https://images.unsplash.com/photo-1684670179697-7b6d0213f152?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')"
            }}
        >
        </motion.div>
    )
}

const DescriptionBlock = ({children, className = ''}: {
    children: ReactChild,
    className?: string
}) => {

    const ref = useRef(null)
    const {scrollYProgress} = useScroll({target: ref, offset: ['start end', 'end start']})
    const transformSkew = useTransform(scrollYProgress, [0, 1], ['0deg', '5deg'])

    return (
        <motion.div
            ref={ref}
            // className={`w-[90%] rounded-md skew-x-1 md:skew-x-3 hard-shadow bg-slate-900/90 text-[1.5rem] md:text-[5rem] p-3 z-30 mix-blend-darken`}>
            className={`select-none w-screen bg-slate-900/90 text-[2rem] md:text-[5rem] p-3 z-30 mix-blend-darken ${className}`}
            style={{
                skewY: transformSkew
            }}
        >
            <p className={'break-words text-white font-nineties text-center text-shadow-hard'}>
                {children}
            </p>
        </motion.div>
    )
}

const IconPane = ({children, title}: {
    children: ReactChild,
    title: string
}) => {
    return (
        <motion.div
            className={`flex flex-col gap-2 font-aeonik items-center justify-center `}>
            <span>
                {children}
            </span>
            <p className={'break-words'}>
                {title}
            </p>
        </motion.div>
    )
}

const hobbies = [
    'video editing',
    'music production',
    'DJing',
    'gaming',
    'graphic illustration',
    'photoshop',
    '3d rendering',
    'visual design',
    'hobby crafting',
    'woodwork',
    'collecting',
    'microcomputers',
    'tinkering',

]


const UnrollStripes = ({content, progress}: {
    content: string[],
    progress: MotionValue<number>,
}) => {

    const heightNumber = 5
    const heightCSS = `${heightNumber}vh` //h-[5vh]

    let array = []
    for (let i = 0; i < content.length; i++) {

        array.push(
            <ScrollStripe i={i} N={content.length} height={{
                number: heightNumber,
                css: heightCSS
            }} progress={progress}>
                {content[i]}
            </ScrollStripe>
        )
    }

    return (
        <>
            {array}
        </>
    )
}

const ScrollStripe = ({children, progress, height, i, N}: {
    children: ReactChild,
    progress: MotionValue<number>,
    height: {
        number: number,
        css: string,
    },
    i: number,
    N: number
}) => {

    const translateY = useTransform(progress, [0, 0.8], [`${i * 1.3}vh`, `${height.number * (i * 1.3)}vh`])

    // const translateX = useTransform(progress, [0.9, 1], ['0vw', `${100}vh`])
    // const rotateZ = useTransform(progress, [0.9, 1], ['0deg', `${height.number * 10}deg`])


    const half = Math.floor(N / 2)
    const halfdiff = i - half


    const skewY = useTransform(progress, [0.7, 1], ['0deg', `${halfdiff}deg`])

    return (
        <motion.div
            style={{
                translateY,
                skewY,

                // rotateZ,
                // translateX,

                height: height.css,
            }}
            className={`absolute p-2 w-screen flex justify-center items-center ${bgColorMap[i]} shadow-lg`}
            data-bg={bgColorMap[i]}>
            <p className={`text-2xl lowercase text-center font-maru`}>
                {children}
            </p>
        </motion.div>
    )

}

const ScrollIndicator = () => {

    const variants = {
        hidden: {
            opacity: 0,
            x: 100
        },
        visible: {
            opacity: 1,
            x: 0
        }
    }

    return createPortal(
        <motion.div className={'fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 '}>
            <motion.span
                variants={variants}
                initial={"hidden"}
                animate={"visible"}
                exit={"hidden"}
            >

                {/*<div className={'flex gap-8 justify-center items-center text-xl font-rubik'}>*/}
                {/*    <span>scroll</span>*/}
                {/*    <PaneOutlineWrapper>*/}
                {/*        /!*<TbCircleArrowDownFilled size={'2rem'}/>*!/*/}
                {/*        <TbArrowNarrowDown className={'h-full w-full'}/>*/}
                {/*    </PaneOutlineWrapper>*/}
                {/*    <span>down</span>*/}
                {/*</div>*/}

                <PaneOutlineWrapper className={'animate-bounce'}>
                    {/*<TbCircleArrowDownFilled size={'2rem'}/>*/}
                    <TbArrowNarrowDown className={'h-full w-full '}/>
                </PaneOutlineWrapper>


            </motion.span>
        </motion.div>,
        document.body
    )
}