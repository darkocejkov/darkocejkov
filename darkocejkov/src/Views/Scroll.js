import React, {useState, useEffect, useRef} from 'react'

import {
    useScroll,
    useInView,
    motion,
    useTransform,
    useMotionValueEvent,
    useMotionValue,
    useSpring,
    useTime, useVelocity
} from "framer-motion";
import {downloadFile, getFileInfo, smoothScrollId} from "../GlobalFunctions";
import Background from "../Components/Background";
import {
    BoxCarousel, CardBox,
    CustomButton,
    CustomLink,
    FillLink, FunLink,
    InfoBox,
    Link, MenuWrapper,
    StatBox, SubtitleRule, TextBox,
    TitleLetters,
    TitleRule,
    Tooltip,
    TooltipWrapper
} from "../Components/Basics";
import Marquee from "react-fast-marquee";

const minResume = require('../assets/files/V3 MIN Darko Cejkov Fullstack Developer 2023.pdf')
const resume = require('../assets/files/V3 Darko Cejkov Fullstack Developer 2023.pdf')

const springSettings = {
    stiffness: 30,
    damping: 50,
    restDelta: 0.001
}

export const ScrollView = ({}) => {

    const {scrollYProgress, scrollY} = useScroll()

    const [blind, setBlind] = useState(1)

    const titleView = useRef()

    // const bottomProgress = useSpring(useTransform(scrollYProgress, [0, .3], [0, 1]), springSettings)
    // const sideProgress = useSpring(useTransform(scrollYProgress, [.3, .6], [0, 1]), springSettings)
    // const topProgress = useSpring(useTransform(scrollYProgress, [.6, 1], [0, 1]), springSettings)

    const bottomProgress = useTransform(scrollYProgress, [0, .3], [0, 1])
    const sideProgress = useTransform(scrollYProgress, [.3, .6], [0, 1])
    const topProgress = useTransform(scrollYProgress, [.6, 1], [0, 1])

    const scrollVelocity = useVelocity(scrollY)
    const scrollDirection = useRef(1)

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

    const sections = [
        {
            id: "experience",
            label: "Experience",

        },
    ]

    const sceneRef = useRef()

    return(

        <>

            <Background showFront={false} blind={blind} className={'h-screen'}/>

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
                    transition={{type: 'spring'}}
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
                    drag
                    ref={titleView}
                    // animate={{
                    //     opacity: [0, 1],
                    //     y: [-100, 0]
                    // }}
                >
                    <h1 className={`font-tabi text-center text-3xl md:text-6xl p-2`}>
                        Darko Cejkov
                    </h1>
                </motion.div>
            </div>


            <div ref={sceneRef} className='min-h-screen z-0 overflow-x-clip bg-gradient-to-b to-cyan-200 from-blue-500 flex flex-col flex-1 gap-5 pt-24 md:p-12 p-6 items-center justify-evenly select-none perspective-none'>

                <InfoBox sceneRef={sceneRef} id={'experience'}>

                    <div className={'flex flex-col gap-3'}>
                        <div>
                            <TooltipWrapper fit tooltip={
                                // <FunLink url={'https://www.vvc.ca'} />
                                <Link url={'https://www.vvc.ca'} />
                            }>
                                <h2 className="md:text-4xl text-2xl font-tabi">
                                    Van Valkenburg Communications (VVC)
                                </h2>
                                <SubtitleRule textPos={'right'} classes={'md:text-2xl text-xl font-maru font-bold uppercase'}>
                                    Fullstack Developer
                                    <div className={`lg:flex-1 w-full h-[1px] bg-slate-900 self-center`} />
                                    April 2021 - March 2023
                                </SubtitleRule>
                                {/*<TitleRule classes={'md:text-2xl text-xl font-maru font-bold uppercase'}>*/}
                                {/*    April 2021 - Present*/}
                                {/*</TitleRule>*/}
                            </TooltipWrapper>

                            <div className={'flex flex-wrap gap-2'}>
                                <div className={'w-full lg:w-[49%]'}>
                                    <h3 className={'font-aeonik font-bold text-center'}>Front-end Technologies</h3>
                                    <BoxCarousel className={'mt-2 font-aeonik'} id={'frontend'}>
                                        <CardBox className={'whitespace-nowrap snap-center '}>React.js</CardBox>

                                        <CardBox className={'whitespace-nowrap snap-center'}>Bootstrap 5</CardBox>
                                        <CardBox className={'whitespace-nowrap snap-center'}>Nivo + D3</CardBox>
                                        <CardBox className={'whitespace-nowrap snap-center'}>Draft.js</CardBox>
                                        <CardBox className={'whitespace-nowrap snap-center'}>Ant Design</CardBox>

                                        <CardBox className={'whitespace-nowrap snap-center'}>react-router</CardBox>
                                        <CardBox className={'whitespace-nowrap snap-center'}>react-hook-form</CardBox>
                                        <CardBox className={'whitespace-nowrap snap-center'}>react-select</CardBox>
                                        <CardBox className={'whitespace-nowrap snap-center'}>plyr.js</CardBox>
                                        <CardBox className={'whitespace-nowrap snap-center'}>HLS.js</CardBox>
                                    </BoxCarousel>
                                </div>

                                <div className={'w-full lg:w-[49%]'} >
                                    <h3 className={'font-aeonik font-bold text-center'}>Back-end Technologies</h3>
                                    <BoxCarousel className={'mt-2 font-aeonik'} id={'backend'}>
                                        <CardBox className={'whitespace-nowrap snap-center '}>Node.js</CardBox>
                                        <CardBox className={'whitespace-nowrap snap-center'}>Redis</CardBox>
                                        <CardBox className={'whitespace-nowrap snap-center'}>Node.js</CardBox>
                                        <CardBox className={'whitespace-nowrap snap-center'}>Express.js</CardBox>
                                        <CardBox className={'whitespace-nowrap snap-center'}>Passport.js</CardBox>
                                        <CardBox className={'whitespace-nowrap snap-center'}>WebSockets</CardBox>
                                        <CardBox className={'whitespace-nowrap snap-center'}>Redis</CardBox>
                                    </BoxCarousel>
                                </div>
                            </div>

                            <div className={'flex flex-col gap-2 mt-5'}>
                                <h3 className={'font-aeonik font-bold'}>Description, Responsibilities, Achievements</h3>

                                <TextBox className={'font-rubik font-thin'}>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec justo lacus, dignissim ut sagittis a, cursus id urna. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris sed ligula a ligula tristique volutpat sed nec leo. Praesent a felis at eros pellentesque aliquet. Phasellus sit amet urna cursus, cursus enim ut, commodo ligula. Ut imperdiet sit amet ligula sed vehicula. Sed egestas gravida leo, eget eleifend arcu tincidunt non. In laoreet lectus ut ex posuere, non fermentum velit dapibus. Nunc sagittis nisl dui, id egestas sem venenatis ut. Maecenas lacinia vitae erat sit amet sodales. Donec ut odio leo. Etiam imperdiet fringilla tellus, quis luctus urna fringilla eget. Duis congue neque a nibh mollis rhoncus.

                                    Aliquam non arcu quis neque malesuada varius. Aenean in nisl at mauris placerat molestie. Duis sem nisi, mollis vestibulum tortor quis, laoreet egestas neque. Ut felis felis, consectetur ut augue id, semper molestie ligula. Curabitur tempor enim est, sit amet sollicitudin elit malesuada ut. Nunc placerat mauris ante, vel tincidunt urna viverra ac. Fusce faucibus ornare magna, tincidunt cursus tortor accumsan at. Nam eleifend ac ex et maximus. Phasellus ultrices tortor libero, eget semper magna venenatis nec. Praesent malesuada turpis massa, eu pharetra urna dapibus ut. Vestibulum dictum mattis odio sit amet tempor. Duis viverra cursus eros in fermentum.

                                    Etiam id dolor porta, bibendum dui ut, dignissim est. Cras eleifend maximus enim mattis faucibus. Nullam tincidunt pharetra porta. Duis non dolor leo. Donec accumsan sed felis sed iaculis. Donec vulputate ultrices tortor, non condimentum enim blandit a. Suspendisse quis viverra tellus. Proin ultricies gravida lorem, et euismod urna suscipit at.

                                    Aenean et dui dictum, tincidunt magna vitae, tempor quam. In facilisis vestibulum neque ac dictum. Suspendisse tempus arcu tincidunt, feugiat lacus quis, maximus urna. Duis bibendum dictum vulputate. Etiam sit amet sem id est elementum tristique vitae eu dolor. Maecenas placerat orci at metus pulvinar, ullamcorper elementum diam vulputate. Donec vulputate aliquet felis, at finibus augue facilisis eu. Ut varius nibh sagittis aliquam gravida. Donec varius, sem non egestas convallis, purus magna pellentesque neque, vitae consectetur turpis nibh non massa. Morbi consectetur rutrum facilisis. Aliquam urna metus, pharetra in purus eget, rhoncus blandit felis.

                                    Pellentesque non laoreet tortor, at volutpat ligula. Pellentesque sed neque lectus. Aliquam ac mattis libero. Sed venenatis arcu lorem, vel imperdiet nulla pretium at. Pellentesque ac tincidunt justo, vel viverra mi. Nulla elementum in velit sit amet ultrices. Pellentesque venenatis semper nibh eget maximus. Praesent ut ipsum ut lorem dapibus bibendum.
                                </TextBox>

                            </div>

                        </div>

                        <div className={'flex flex-col gap-3'}>
                            <div>
                                <TooltipWrapper fit tooltip={
                                    <Link url={'https://www.linkedin.com/company/traction-on-demand'} />
                                }>
                                    <h2 className="md:text-4xl text-2xl font-tabi">
                                        Traction on Demand
                                    </h2>
                                    <TitleRule classes={'md:text-2xl text-xl font-maru font-bold uppercase'}>
                                        Marketing Automation Intern
                                        <div className={`lg:flex-1 w-full h-[1px] bg-slate-900 self-center`} />
                                        May 2021 - September 2021
                                    </TitleRule>
                                </TooltipWrapper>

                                <div className={'flex flex-wrap gap-2'}>
                                    <div className={'w-full'}>
                                        <h3 className={'font-aeonik font-bold text-center'}>Marketing Automation</h3>
                                        <BoxCarousel className={'mt-2 font-aeonik w-full'} id={'marketingAutomation'}>
                                            <CardBox className={'whitespace-nowrap snap-center '}>Salesforce</CardBox>

                                            <CardBox className={'whitespace-nowrap snap-center'}>Marketing Cloud</CardBox>
                                            <CardBox className={'whitespace-nowrap snap-center'}>AMPScript</CardBox>
                                            <CardBox className={'whitespace-nowrap snap-center'}>APEX</CardBox>

                                        </BoxCarousel>
                                    </div>
                                </div>

                                <div className={'flex flex-col gap-2 mt-5'}>
                                    <h3 className={'font-aeonik font-bold'}>Description, Responsibilities, Achievements</h3>

                                    <TextBox className={'font-rubik font-thin'}>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec justo lacus, dignissim ut sagittis a, cursus id urna. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris sed ligula a ligula tristique volutpat sed nec leo. Praesent a felis at eros pellentesque aliquet. Phasellus sit amet urna cursus, cursus enim ut, commodo ligula. Ut imperdiet sit amet ligula sed vehicula. Sed egestas gravida leo, eget eleifend arcu tincidunt non. In laoreet lectus ut ex posuere, non fermentum velit dapibus. Nunc sagittis nisl dui, id egestas sem venenatis ut. Maecenas lacinia vitae erat sit amet sodales. Donec ut odio leo. Etiam imperdiet fringilla tellus, quis luctus urna fringilla eget. Duis congue neque a nibh mollis rhoncus.

                                        Aliquam non arcu quis neque malesuada varius. Aenean in nisl at mauris placerat molestie. Duis sem nisi, mollis vestibulum tortor quis, laoreet egestas neque. Ut felis felis, consectetur ut augue id, semper molestie ligula. Curabitur tempor enim est, sit amet sollicitudin elit malesuada ut. Nunc placerat mauris ante, vel tincidunt urna viverra ac. Fusce faucibus ornare magna, tincidunt cursus tortor accumsan at. Nam eleifend ac ex et maximus. Phasellus ultrices tortor libero, eget semper magna venenatis nec. Praesent malesuada turpis massa, eu pharetra urna dapibus ut. Vestibulum dictum mattis odio sit amet tempor. Duis viverra cursus eros in fermentum.

                                        Etiam id dolor porta, bibendum dui ut, dignissim est. Cras eleifend maximus enim mattis faucibus. Nullam tincidunt pharetra porta. Duis non dolor leo. Donec accumsan sed felis sed iaculis. Donec vulputate ultrices tortor, non condimentum enim blandit a. Suspendisse quis viverra tellus. Proin ultricies gravida lorem, et euismod urna suscipit at.

                                        Aenean et dui dictum, tincidunt magna vitae, tempor quam. In facilisis vestibulum neque ac dictum. Suspendisse tempus arcu tincidunt, feugiat lacus quis, maximus urna. Duis bibendum dictum vulputate. Etiam sit amet sem id est elementum tristique vitae eu dolor. Maecenas placerat orci at metus pulvinar, ullamcorper elementum diam vulputate. Donec vulputate aliquet felis, at finibus augue facilisis eu. Ut varius nibh sagittis aliquam gravida. Donec varius, sem non egestas convallis, purus magna pellentesque neque, vitae consectetur turpis nibh non massa. Morbi consectetur rutrum facilisis. Aliquam urna metus, pharetra in purus eget, rhoncus blandit felis.

                                        Pellentesque non laoreet tortor, at volutpat ligula. Pellentesque sed neque lectus. Aliquam ac mattis libero. Sed venenatis arcu lorem, vel imperdiet nulla pretium at. Pellentesque ac tincidunt justo, vel viverra mi. Nulla elementum in velit sit amet ultrices. Pellentesque venenatis semper nibh eget maximus. Praesent ut ipsum ut lorem dapibus bibendum.
                                    </TextBox>

                                </div>

                            </div>
                        </div>


                    </div>

                </InfoBox>

                <InfoBox id={'education'}>


                    <TooltipWrapper position={'tl'} fit tooltip={
                        <Link url={'https://www.wlu.ca'} />
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
                            <StatBox title={'Sem. in Perception'} stat={'A'}/>
                        </TooltipWrapper>
                        <TooltipWrapper className={'flex-1'} tooltip={'Pursuing contemporary research in cognitive neuroscience.'}>
                            <StatBox title={'Sem. in Cog. Neuroscience'} stat={'B-'}/>
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

                    <div className={'h-fit mt-2 flex gap-12 md:flex-nowrap flex-wrap relative'}>

                        {links.map((x, i) => {
                            return(
                                <CustomLink className={'text-4xl z-10 font-rubik font-medium'} url={x.link}>
                                    {x.label}
                                </CustomLink>
                            )

                        })}

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

                <div className={'md:hidden mb-24'}/>
            </div>

            <div className={'fixed right-[10%] top-[50%] -translate-y-1/2 z-20 flex flex-col gap-2 select-none'}>
                <div>
                    <button onClick={() => smoothScrollId('experience')}>💼</button>
                </div>
                <div>
                    <button onClick={() => smoothScrollId('education')}>🎓</button>
                </div>
                <div>
                    <button onClick={() => smoothScrollId('links')}>🔗</button>
                </div>
                <div>
                    <button onClick={() => smoothScrollId('files')}>📁</button>
                </div>
            </div>
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
