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
import {downloadFile, getFileInfo, smoothScrollId} from "../GlobalFunctions";
import Background from "../Components/Background";
import {
    CustomButton,
    CustomLink,
    FillLink,
    InfoBox,
    Link, MenuWrapper,
    StatBox, SubtitleRule,
    TitleLetters,
    TitleRule,
    Tooltip,
    TooltipWrapper
} from "../Components/Basics";
import Marquee from "react-fast-marquee";

const minResume = require('../assets/files/V3 MIN Darko Cejkov Fullstack Developer 2023.pdf')
const resume = require('../assets/files/V3 Darko Cejkov Fullstack Developer 2023.pdf')

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

    const [activeLink, setActiveLink] = useState(0)

    const links = [
        {label: 'GitHub', link: 'https://github.com/darkocejkov'},
        {label: 'LinkedIn', link: 'https://www.linkedin.com/in/darko-cejkov/'},
        {label: 'Notion', link: 'https://darkocheykov.notion.site/Darko-Cejkov-4ad2da60e1da4b83a24c3fbd809293be'},
    ]

    const files = [
        {label: 'Resume', files: [
                {label: 'Minified', file: minResume, onEffect: () => getFileInfo(minResume), onClick: () => downloadFile(minResume, 'Darko Cejkov Resume 2023')},
                {label: 'Full', file: resume, onEffect: () => getFileInfo(resume), onClick: () => downloadFile(resume, 'Darko Cejkov Resume 2023')},
        ]}
    ]

    useEffect(() => {

    }, [])

    return(

        <>

            <Background showFront={false} blind={blind}/>

            <div className={'z-30 pointer-events-none'}>
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

                <motion.div
                    className={`fixed bottom-0 z-20 p-5`}
                    ref={titleView}
                    animate={{
                        opacity: [0, 1],
                        y: [-100, 0]
                    }}
                >
                    <h1 className={`font-tabi text-center text-6xl`}>
                        Darko Cejkov
                    </h1>
                </motion.div>
            </div>


            <div className='min-h-screen z-0 overflow-x-clip bg-gradient-to-b to-cyan-200 from-blue-500 flex flex-col flex-1 gap-5 pt-24 md:p-12 p-6 items-center justify-evenly select-none'>

                <InfoBox id={'education'}>


                    <TooltipWrapper position={'tl'} fit tooltip={
                        <Link url={'https://www.wlu.ca'}>
                            wlu.ca
                        </Link>
                    }>
                        <h2 className="md:text-4xl text-2xl font-tabi">
                            Honors BSc. Computer Science & Psychology
                        </h2>
                    </TooltipWrapper>
                    <TitleRule classes={'md:text-2xl text-xl font-maru font-bold uppercase'}>
                        Wilfrid Laurier University (2016 - 2022)
                        <div className={'font-rubik group'}>
                            <TooltipWrapper fit position={'tl'} tooltip={
                                <div className={'font-rubik font-normal'}>
                                    <p>
                                        9.8 Computer Science

                                    </p>
                                    <p>
                                        8.6 Psychology
                                    </p>
                                </div>
                            }>
                                GPA of <b>8.9</b> of 12 overall
                            </TooltipWrapper>
                        </div>
                    </TitleRule>






                    <h3 className={'mt-2 font-aeonik font-bold'}>Courses</h3>
                    <div className={'flex flex-wrap flex-1 gap-2 mt-2 font-aeonik'}>
                        <TooltipWrapper className={'flex-1'} tooltip={'The study of theoretical mathematics as applied in Graph Theory and Number Theory.'}>
                            <StatBox title={'Discrete Mathematics'} stat={'A-'}/>
                        </TooltipWrapper>

                        <TooltipWrapper className={'flex-1'} tooltip={'Experimenting with problem-solving tasks, comparing differences between pathfinding algorithms.'}>
                            <StatBox title={'Artificial Intelligence'} stat={'A-'}/>
                        </TooltipWrapper>

                        <TooltipWrapper className={'flex-1'} tooltip={'Learning to prove mathematical theories and axioms via logic'}>
                            <StatBox title={'Mathematical Proofs'} stat={'A-'}/>
                        </TooltipWrapper>

                        <TooltipWrapper className={'flex-1'} tooltip={'Leveraging Python to understand core concepts for various data structures and managing data.'}>
                            <StatBox title={'Data Structures I & II'} stat={'B / B+'}/>
                        </TooltipWrapper>

                        <TooltipWrapper className={'flex-1'} tooltip={'Learning practical hierarchies, inheritance, classes and objects concepts through Java.'}>
                            <StatBox title={'Object-Oriented Programming'} stat={'A-'}/>
                        </TooltipWrapper>

                        <TooltipWrapper className={'flex-1'} tooltip={'Learning theoretical microprocessor logic and simulation of ARM/ASSEMBLY, understanding how high-language code gets compiled down into machine code.'}>
                            <StatBox title={'Microprocessors'} stat={'B'}/>
                        </TooltipWrapper>

                        <TooltipWrapper className={'flex-1'} tooltip={'Using C to understand operating system theory such as kernels, and scheduling operations in a low-level OS context.'}>
                            <StatBox title={'Operating Systems'} stat={'B'}/>
                        </TooltipWrapper>

                        <TooltipWrapper className={'flex-1'} tooltip={'Understanding the intricacies of calculus concepts like limits, functions, integrations and derivatives.'}>
                            <StatBox title={'Calculus I'} stat={'B'}/>
                        </TooltipWrapper>

                        <TooltipWrapper className={'flex-1'} tooltip={'Hands-on linux learning to use terminal-based systems, understanding what/how commands work and creating our own.'}>
                            <StatBox title={'Linux System Programming'} stat={'A-'}/>
                        </TooltipWrapper>

                        <TooltipWrapper className={'flex-1'} tooltip={'Learning theoretical relational databse theories, how to create and manage SQL-based databases'}>
                            <StatBox title={'Database I & II'} stat={'A- / A'}/>
                        </TooltipWrapper>

                        <TooltipWrapper className={'flex-1'} tooltip={'Participating in a large group project, applying AGILE and project management methodologies.'}>
                            <StatBox title={'Software Engineering'} stat={'A-'}/>
                        </TooltipWrapper>
                        <TooltipWrapper className={'flex-1'} tooltip={'Hands-on Raspberry Pi coding in Python, utilizing physical components such as actuators and displays.'}>
                            <StatBox title={'Physical Computing'} stat={'A+'}/>
                        </TooltipWrapper>

                        <TooltipWrapper className={'flex-1'} tooltip={'Understanding the design and application of various well-known algorithms, and the key to designing efficient algorithms.'}>
                            <StatBox title={'Algorithms'} stat={'A'}/>
                        </TooltipWrapper>

                        <TooltipWrapper className={'flex-1'} tooltip={'Testing the limits and lowest level computation logic using state machines and Turing machines.'}>
                            <StatBox title={'Foundations of Computing'} stat={'A+'}/>
                        </TooltipWrapper>
                        <TooltipWrapper className={'flex-1'} tooltip={'Conducting guided research and writing in various topics of perception'}>
                            <StatBox title={'Research in Perception'} stat={'A-'}/>
                        </TooltipWrapper>
                        <TooltipWrapper className={'flex-1'} tooltip={'Pursuing contemporary research in perception.'}>
                            <StatBox title={'Seminar in Perception'} stat={'A'}/>
                        </TooltipWrapper>
                        <TooltipWrapper className={'flex-1'} tooltip={'Pursuing contemporary research in cognitive neuroscience.'}>
                            <StatBox title={'Seminar in Cognitive Neuroscience'} stat={'B-'}/>
                        </TooltipWrapper>

                    </div>


                </InfoBox>

                <InfoBox id={'experience'}>

                    <div className={'flex flex-col gap-3'}>
                        <TooltipWrapper fit tooltip={
                            <Link url={'https://www.vvc.ca'}>
                                vvc.ca
                            </Link>
                        }>
                            <h2 className="md:text-4xl text-2xl font-tabi">
                                Van Valkenburg Communications (VVC)
                            </h2>
                            <SubtitleRule textPos={'right'} classes={'md:text-2xl text-xl font-maru font-bold uppercase'}>
                                April 2021 - Present
                            </SubtitleRule>
                            {/*<TitleRule classes={'md:text-2xl text-xl font-maru font-bold uppercase'}>*/}
                            {/*    April 2021 - Present*/}
                            {/*</TitleRule>*/}
                        </TooltipWrapper>

                        <TooltipWrapper fit tooltip={
                            <Link url={'https://www.linkedin.com/company/traction-on-demand'}>
                                traction on demand linkedin
                            </Link>
                        }>
                            <h2 className="md:text-4xl text-2xl font-tabi">
                                Traction on Demand
                            </h2>
                            <TitleRule classes={'md:text-2xl text-xl font-maru font-bold uppercase'}>
                                May 2021 - September 2021
                            </TitleRule>
                        </TooltipWrapper>
                    </div>




                </InfoBox>

                <InfoBox id={'links'}>

                    {/*<h2 className="md:text-4xl text-2xl font-tabi">*/}
                    {/*    Links*/}
                    {/*</h2>*/}
                    <TitleRule classes={'md:text-4xl text-2xl font-tabi'} ruleClass={'alien-gradient'}>
                        Links
                    </TitleRule>

                    <div className={'h-fit flex flex-row flex-nowrap gap-3 mt-2'}>

                        <div className={'flex gap-12 relative'}>

                            {links.map((x, i) => {
                                return(
                                    <CustomLink className={'text-4xl z-10 font-rubik font-medium'} url={x.link}>
                                        {x.label}
                                    </CustomLink>
                                )

                            })}

                        </div>



                    </div>

                </InfoBox>

                <InfoBox id={'files'}>

                    {/*<h2 className="md:text-4xl text-2xl font-tabi">*/}
                    {/*    Links*/}
                    {/*</h2>*/}
                    <SubtitleRule textPos={'right'} classes={'md:text-4xl text-2xl font-tabi'}>
                        Files
                    </SubtitleRule>

                    <div className={'h-fit flex flex-row flex-nowrap gap-3 mt-2'}>

                        <div className={'flex gap-12 relative'}>

                            {files.map((x, i) => {
                                return(

                                    <MenuWrapper items={x.files}>
                                        <CustomButton className={`text-4xl z-10 font-rubik font-medium hover:scale-110`}>
                                            {x.label}
                                        </CustomButton>
                                    </MenuWrapper>


                                )

                            })}

                        </div>



                    </div>

                </InfoBox>
            </div>

            <div className={'fixed right-[10%] top-[50%] -translate-y-1/2 z-20 flex flex-col gap-2 select-none'}>
                <div>
                    <button onClick={() => smoothScrollId('education')}>🎓</button>
                </div>
                <div>
                    <button onClick={() => smoothScrollId('experience')}>💼</button>
                </div>
                <div>
                    <button onClick={() => smoothScrollId('links')}>🔗</button>
                </div>
                <div>
                    <button onClick={() => smoothScrollId('files')}>📁</button>
                </div>
            </div>

            {/*<div className={'fixed bottom-20 right-5 -rotate-90'}>*/}
            {/*    <input type="range" min=".1" max="1" step={.1} value={blind} onChange={(e) => setBlind(e.target.value)}/>*/}
            {/*</div>*/}


            {/*<div className={`fixed inset-y-0 p-2 mt-10`}>*/}
            {/*    <motion.button*/}
            {/*        onClick={() => smoothScrollId('education')}*/}
            {/*        style={{*/}
            {/*            translateY: eduY,*/}
            {/*            translateX: eduX,*/}
            {/*            scale: eduScale,*/}
            {/*            // borderRadius: buttonRadius*/}

            {/*        }}*/}
            {/*        className={'md:h-20 md:w-20 md:text-3xl text-xl absolute flex items-center rounded-3xl hover:rounded-full justify-center bg-slate-900/50 hover:bg-slate-900/70'}>*/}
            {/*        🎓*/}
            {/*    </motion.button>*/}
            {/*    <motion.button*/}
            {/*        onClick={() => smoothScrollId('experience')}*/}
            {/*        style={{*/}
            {/*            translateY: expY,*/}
            {/*            translateX: expX,*/}
            {/*            scale: expScale,*/}

            {/*            // borderRadius: buttonRadius*/}
            {/*        }}*/}
            {/*        className={'md:h-20 md:w-20 md:text-3xl text-xl absolute flex items-center rounded-3xl hover:rounded-full justify-center bg-slate-900/50 hover:bg-slate-900/70'}>*/}
            {/*        💼*/}
            {/*    </motion.button>*/}
            {/*    <motion.button*/}
            {/*        onClick={() => smoothScrollId('links')}*/}
            {/*        style={{*/}
            {/*            translateY: linY,*/}
            {/*            translateX: linX,*/}
            {/*            scale: linScale,*/}
            {/*            // borderRadius: buttonRadius*/}
            {/*        }}*/}
            {/*        className={'md:h-20 md:w-20 md:text-3xl text-xl absolute flex items-center rounded-3xl hover:rounded-full justify-center bg-slate-900/50 hover:bg-slate-900/70'}>*/}
            {/*        🔗*/}
            {/*    </motion.button>*/}

            {/*    <motion.button*/}
            {/*        onClick={() => smoothScrollId('files')}*/}
            {/*        style={{*/}
            {/*            translateY: fileY,*/}
            {/*            translateX: fileX,*/}
            {/*            scale: fileScale*/}

            {/*            // borderRadius: buttonRadius*/}
            {/*        }}*/}
            {/*        className={'md:h-20 md:w-20 md:text-3xl text-xl absolute flex items-center rounded-3xl hover:rounded-full justify-center bg-slate-900/50 hover:bg-slate-900/70'}>*/}
            {/*        📁*/}
            {/*    </motion.button>*/}
            {/*</div>*/}
        </>
    )
}


const ChildrenWrapper = ({children}) => {

    console.log(Array.isArray(children))

    return(
        children.map((x, i) => {
            return(
                <>
                    {x} ({i})
                </>
            )
        })
    )

}
