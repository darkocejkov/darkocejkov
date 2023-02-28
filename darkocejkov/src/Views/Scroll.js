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
    Accordion, BorderDiv,
    BoxCarousel, CardBox,
    CustomButton,
    CustomLink,
    FillLink, FunLink,
    InfoBox,
    Link, MenuWrapper, Rule,
    StatBox, SubtitleRule, TextBox,
    TitleLetters,
    TitleRule,
    Tooltip,
    TooltipWrapper
} from "../Components/Basics";

import {Tree} from 'antd'
import GitHubCalendar from "react-github-calendar";

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

    const vvcDescription = [
        {
            title: 'Project Lead',
            key: '0',
            children: [
                {title: 'a', key: '0-0'},
                {title: 'a', key: '0-1'},
                {title: 'a', key: '0-2'},
                {title: 'a', key: '0-3'},
            ]
        },
        {
            title: 'Frontend Developer',
            key: '1',
            children: [
                {title: 'b', key: '1-0'},
                {title: 'b', key: '1-1'},
                {title: 'b', key: '1-2'},
                {title: 'b', key: '1-3'},
            ]
        },
        {
            title: 'Backend Engineer',
            key: '2',
            children: [
                {title: 'c', key: '2-0'},
                {title: 'c', key: '2-1'},
                {title: 'c', key: '2-2'},
                {title: 'c', key: '2-3'},
            ]
        },
    ]


    const sceneRef = useRef()

    const [play, setPlay] = useState(true)
    const [front, setFront] = useState(false)

    return(
        <>
            <Background play={play} showFront={front} blind={blind} className={'h-screen'}/>

            <div className={'fixed right-[5%] top-[50%] -translate-y-1/2 z-50 flex flex-col gap-2 select-none'}>
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
                    className={`fixed bottom-0 z-50 p-5`}
                    drag
                    dragElastic={0.1}
                    dragConstraints={{
                        left: 0,
                        top: 0,
                        right: 0,
                        bottom: 0
                    }}
                    ref={titleView}
                    // animate={{
                    //     opacity: [0, 1],
                    //     y: [-100, 0]
                    // }}
                >
                    <BorderDiv className={'font-tabi font-bold text-center text-3xl sm:text-6xl pointer-events-auto flex flex-col flex-nowrap items-center justify-center gap-2 p-4 backdrop-blur-md rounded-md shadow-lg relative'}>
                        <h1>
                            Darko Cejkov
                        </h1>
                        <div className={'flex self-center gap-0 text-sm hover:gap-6 font-normal transition-all'}>

                            {front
                                ? (
                                    <button onClick={() => setFront(false)} className={'bg-transparent hover:bg-slate-600/10 p-3 rounded-md group'}>
                                        <i className="fa-solid fa-send-backward fa-xl"></i>


                                        <span className={'text-white bg-slate-700/20 p-2 rounded-lg text-2xl group-hover:scale-100 scale-0 absolute -top-1/2 left-1/2 transition-all'}>
                                    Send Sketch Backwards
                                </span>

                                    </button>

                                )
                                : (
                                    <button onClick={() => setFront(true)} className={'bg-transparent hover:bg-slate-600/10 p-3 rounded-md group'}>
                                        <i className="fa-solid fa-bring-forward fa-xl"></i>


                                        <span className={'text-white bg-slate-700/20 p-2 rounded-lg text-2xl group-hover:scale-100 scale-0 absolute -top-1/2 left-1/2 transition-all'}>
                                    Bring Sketch Forwards
                                </span>

                                    </button>

                                )}

                            <button className={'bg-transparent hover:bg-slate-600/10 p-3 rounded-md group'}>
                                <i className="fa-solid fa-chevron-left fa-xl"></i>


                                <span className={'text-white bg-slate-700/20 p-2 rounded-lg text-2xl group-hover:scale-100 scale-0 absolute -top-1/2 left-1/2 transition-all'}>
                                    Previous Sketch
                                </span>

                            </button>

                            {play
                                ? (
                                    <button onClick={() => setPlay(false)} className={'bg-transparent hover:bg-slate-600/10 p-3 rounded-md group'}>
                                        <i className="fa-solid fa-pause fa-xl"></i>

                                        <span className={'text-white bg-slate-700/20 p-2 rounded-lg text-2xl group-hover:scale-100 scale-0 absolute -top-1/2 left-1/2 transition-all'}>
                                    Pause Sketch
                                </span>
                                    </button>
                                )
                                : (
                                    <button onClick={() => setPlay(true)} className={'bg-transparent hover:bg-slate-600/10 p-3 rounded-md group'}>
                                        <i className="fa-solid fa-play fa-xl"></i>

                                        <span className={'text-white bg-slate-700/20 p-2 rounded-lg text-2xl group-hover:scale-100 scale-0 absolute -top-1/2 left-1/2 transition-all'}>
                                    Play Sketch
                                </span>
                                    </button>
                                )}



                            {/*<button>*/}
                            {/*    <i className="fa-solid fa-pause fa-2xl"></i>*/}
                            {/*</button>*/}

                            <button className={'bg-transparent hover:bg-slate-600/10 p-3 rounded-md group'}>
                                <i className="fa-solid fa-chevron-right fa-xl"></i>

                                <span className={'text-white bg-slate-700/20 p-2 rounded-lg text-2xl group-hover:scale-100 scale-0 absolute -top-1/2 left-1/2 transition-all'}>
                                    Next Sketch
                                </span>
                            </button>

                        </div>
                    </BorderDiv>

                </motion.div>
            </div>


            <div ref={sceneRef} className='min-h-screen z-0 overflow-x-clip bg-gradient-to-b to-cyan-200 from-blue-500 flex flex-col flex-1 gap-5 pt-24 p-12 items-center justify-evenly select-none perspective-none'>

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

                                <TextBox className={'font-fira md:p-6 font-thin flex flex-col gap-5'}>

                                    <div className={'tree'}>
                                        <SubtitleRule classes={'text-xl text-center font-bold'} textPos={'center'}>
                                            Project Lead
                                        </SubtitleRule>
                                        <ul>
                                            <li>Formalized system design process through visualization methods, such as Lucidchart, incorporating the use of UML and architecture diagrams</li>
                                            <li>Fostered novel ideas such as self-serve, utilizing subscription and billing features to promote</li>
                                            <li>Documenting solutions, designs, ideas, packages, and software stack</li>
                                            <li>Performed weekly and daily AGILE sprint cycles to manage project expectations, progress, and roadblocks with team of testers and managers</li>
                                            <li>Used "nifty" project management tool to document bugs, tickets, milestones and gotcha's - and to delegate work to appropriate teammates when sprints are finished</li>
                                            <li>Rebased Git tree for organization, and enabled the use of feature branches to work around pushing incomplete reworks and unfinished features</li>
                                            <li>Introduced shell scripts to automate webpack build and deployment for 3 seperate deployment branches on cloud servers, which heavily reduced pull/push conflicts between other developers</li>

                                            <li>Performed data-driven cross-references between dependent packages and lists of known vulnerabilities to reduce the risk of future security breaches</li>

                                            <li>Monitored and analyzed large-scale UAT beta testing with clients and upwards of 1000 concurrent users, to find large flaws in scalability, data models, and in-place solutions</li>
                                        </ul>

                                        <div className={'text-center font-italic my-2 max-w-[50%]'}>
                                            AGILE, design-driven, system design, UAT, security, Git, documentation, CI/CD
                                        </div>
                                    </div>

                                    <div className={'tree'}>
                                        <SubtitleRule classes={'text-xl text-center'} textPos={'center'}>
                                            Frontend Development
                                        </SubtitleRule>

                                        <h2>Structure</h2>
                                        <ul>
                                            <li>
                                                Developed and maintained 30+ integrated pages, components, and displays for both end-user and administrator function.
                                            </li>
                                            <li>
                                                Used Classless/Functional React principles to create large component hierarchies for a wide variety of modules, such as controlled input, display, translation
                                            </li>
                                            <li>
                                                Mastered react-router v5 to control Single-page Application (SPA) navigation, and display custom UI to block navigation on dirty form states
                                            </li>
                                            <li>
                                                Created over 10 custom higher-order-components (HOCs) to properly motivate encapsulation and code-reusability between forms
                                            </li>
                                            <li>
                                                Leveraged suspenseful loading techniques to display status of UI as well as lifecycle hooks to maximize data fetching process.
                                            </li>
                                            <li>
                                                Refined the process of parent-child hierarchy for complex components by developing custom hooks to parent the logic, while passing children appropriate render functions
                                            </li>
                                            <li>
                                                Innovated previous design constraints by refactoring previous solutions to evolve features into well-designed systems, with room for additional growth
                                            </li>
                                        </ul>

                                        <h2>Style</h2>
                                        <ul>
                                            <li>
                                                Elevated UI/UX with Bootstrap 5 and SCSS, as well as styled-components
                                            </li>
                                            <li>
                                                Developed dynamic and responsive UI through mobile-first Bootstrap-based principles, taking into consideration dynamic user-submitted data
                                            </li>
                                        </ul>

                                        <h2>Features</h2>
                                        <ul>
                                            <h3>
                                                Real-time Chat and Messaging
                                            </h3>
                                            <ul>
                                                <li>
                                                    Enabled real-time communication between any users, facilitating WebSockets and its channels to provide all users with data as created, without requiring further database connections
                                                </li>
                                                <li>
                                                    Went above and beyond the scoped rework to enable direct (private) messaging system, and relational message-to-message reply system
                                                </li>
                                            </ul>

                                            <h3>
                                                Voting/Polling
                                            </h3>
                                            <ul>
                                                <li>
                                                    Designed and implemented large-scale formal voting (Robert's Rules) and polling systems to capture user data while honoring the amendment and seconding process in real-time
                                                </li>

                                            </ul>

                                            <h3>
                                                Analytics & Reporting
                                            </h3>
                                            <ul>
                                                <li>
                                                    Leveraged customized Nivo charts to develop high-level real-time analytics reporting graphs, with custom D3 layers for adding event-triggered display
                                                </li>
                                                <li>
                                                    Developed manual and automated custom javascript-powered CSV, PDF and JSON exports of current, and aggregated event data for client
                                                </li>
                                                <li>
                                                    Utilized Ant Design to outsource difficult component work such as data tables, with full sorting, filtering, and selection ability
                                                </li>
                                            </ul>

                                            <h3>
                                                Reusable Form Components
                                            </h3>
                                            <ul>
                                                <li>
                                                    Refactored state-based form handlers to use
                                                    react-hook-form to promote simple scalability, modularity, and form-based validation rules
                                                </li>
                                                <li>
                                                    Forms could use basic HTML inputs, or custom external package components such as DraftJS
                                                </li>
                                                <li>
                                                    Created responsive, large-scale WYSIWYG object editors with components, complete with translation forms to help users manage translations of dynamically entered content
                                                </li>
                                            </ul>

                                            <h3>
                                                Diverse Video/Stream Player
                                            </h3>
                                            <ul>
                                                <li>
                                                    Customized video player components using plyr.js and HLS.js to enable a wide variety of input, and especially integrating with AWS streaming with multi-channel captions
                                                </li>
                                            </ul>

                                            <h3>
                                                Administration
                                            </h3>
                                            <ul>
                                                <li>
                                                    Drove large quality-of-life updates by creating administration dashboard for site admins to view site-wide information, such as the number of active users, CPU performance, and simple graphical views of activity per webpage
                                                </li>
                                            </ul>

                                        </ul>

                                        <h2>Accessibility & Internationalization</h2>
                                        <ul>
                                            <li>
                                                Integrated i18n for multilingual translations, with site-wide support for a11y principles for accessibility
                                            </li>
                                            <li>
                                                Simplified the headache of timezone translation by using moment.js to handle all datetime data
                                            </li>
                                        </ul>

                                        <div className={'text-center font-italic my-2'}>
                                            React, stateless, components, lifecycle hooks, parent-child hierarchy, encapsulation, modularity, react-hook-form, form validation, draftjs, Bootstrap, SPA, HOC, Ant Design, Nivo, D3, Plyr, HLS, WebSockets, Responsive, Mobile-first, Analytics, Dashboards, a11y, CI/CD
                                        </div>
                                    </div>


                                </TextBox>

                                {/*<Accordion data={vvcDescription} />*/}

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

                                    <TextBox className={'font-fira font-thin p-3 flex flex-col gap-5'}>
                                        <div className={'tree'}>
                                            <SubtitleRule classes={'text-xl text-center'} textPos={'center'}>
                                                Teamwork
                                            </SubtitleRule>
                                            <ul>
                                                <li>Collaborated within a large 20+ person team to shadow, learn, and apply hands-on knowledge of Salesforce Marketing Cloud</li>
                                                <li>Trained as a Ranger, preparing and advising other interns for Salesforce Adminstrator certifications</li>
                                            </ul>
                                        </div>

                                        <div className={'tree'}>
                                            <SubtitleRule classes={'text-xl text-center'} textPos={'center'}>
                                                Core Salesforce
                                            </SubtitleRule>
                                            <ul>
                                                <li>Trained in SOQL language to perform object-model queries</li>
                                                <li>Trained in the APEX object-oriented language to perform Salesforce object manipulation</li>
                                            </ul>
                                        </div>

                                        <div className={'tree'}>
                                            <SubtitleRule classes={'text-xl text-center'} textPos={'center'}>
                                                Salesforce Marketing Cloud
                                            </SubtitleRule>
                                            <ul>
                                                <li>Learnt of important legal marketing constraints such as the GDPR and the various tasks to fulfill the requirements</li>
                                                <li>Learnt and utilized AMPScript as a templating language within emails and webpages to personalize through referential data</li>
                                                <li>Used HTML, JavaScript, AMPScript, and CSS to create responsive communication preference centers</li>
                                                <li>Developed UAT scripts for clients based on the theoretical outputs of AMPScript and overall marketing Journey flows</li>
                                                <li>Trained clients in user-handoff in areas such as the concepts of AMPScript</li>
                                            </ul>
                                        </div>

                                        <div className={'text-center font-italic my-2'}>
                                            Apex, SOQL, AMPScript, HTML, JS, CSS, Marketing Automation, Marketing Journeys, GDPR
                                        </div>

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

                    <div className={'h-fit mt-2 flex gap-12 lg:flex-nowrap justify-center items-center flex-wrap relative'}>

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
                    <SubtitleRule textPos={'left'} classes={'md:text-4xl text-2xl font-tabi'}>
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

                <div className={'mb-24'}/>
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
