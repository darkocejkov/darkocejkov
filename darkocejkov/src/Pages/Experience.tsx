import React, {ReactElement} from "react";
import {
    BoxCarousel,
    CardBox,
    Pane,
    Link,
    SubtitleRule,
    TextBox,
    TitleRule,
    TooltipWrapper, Chip, GlobalTooltipWrapper
} from "../Components/Basics.tsx";
import Marquee from "react-fast-marquee";
import {ReactChild} from "../types.ts";
import {Tooltip} from "antd";

import {FaExternalLinkAlt, FaInfoCircle} from "react-icons/fa";
import {Rule} from "../Components/Layout.tsx";

type Tech = {
    label: string,
    description?: ReactChild
}

type Stack = {
    label: string,
    set: Tech[]
}

const VVCTechnologies = [
    {
        label: 'Project',
        set: [
            {
                label: 'Agile',
                description: 'Using Agile methodologies to set weekly and daily stand-ups. Goal and deliverable-based approach. '
            },
            {
                label: 'Design',
                description: 'Exercised design capabilities in a variety of areas - systems design, UI/UX design, component design, solution design. '
            },
            {
                label: 'Team',
                description: 'Collaborated with a small team of dedicated testers, designers, and coordinators for technical tasks while also involving key stakeholders to manage expectations and time.'
            },
            {
                label: 'Communication',
                description: 'Utilized multi-media to communicate key ideas in simple terms - graphs, diagrams, across the team and other developers.'
            },
            {
                label: 'UAT',
                description: 'Coordinated a large-scale beta test that resulted in the soft launch of the new product.'
            },
        ]
    },
    {
        label: 'Frontend Tech',
        set: [
            {
                label: 'ReactJS',
                description: 'Hook/Function-based React (^16.8). Scaffolded project through create-react-app, ejected. Building and maintaining over 10 main page views, and over 100 components. Custom hooks, rendering functions, effects and side-effects.'
            },
            {
                label: 'Webpack',
                description: 'Custom Webpack configurations to optimize pre-loading, DevOps dependency injections, and performance.'
            },
            {
                label: 'Bootstrap 5',
                description: 'Using SCSS stylings to compose custom page, view, and component layouts.'
            },
            {
                label: 'Nivo + D3',
                description: 'Integrated Nivo graphs, with custom D3 elements to compose layers for real-time dashboards.'
            },
            {label: 'react-router', description: 'v5. '},
            {
                label: 'react-hook-form',
                description: 'Refactored scale-resistant form components to use ref-based hooks. Completely changed the way forms are built on the project, increased the re-usability and diversity of components. Made unit and integration testing significantly easier, along with more efficient input validation.'
            },
            {label: 'Redux', description: 'Used '},
            {
                label: 'React Hooks',
                description: 'useState, useEffect, useReducer, useRef were heavily used to create custom UI components.'
            },
            {label: 'react-query', description: 'Experimented with async API-based state mangement.'},
            {
                label: 'Component Libraries',
                description: 'AntDesign, react-select, react-draft-wysiwyg. Outsourced components to minimize time spent on re-inventing the wheel.'
            },
            {
                label: 'a11y, i18n',
                description: 'Developed with a11y and i18n principles in-mind from the beginning to support disability, multilingual, and government requirements.'
            },
        ]
    },
    {
        label: 'Feature Sets',
        set: [
            {
                label: 'WYSIWYG Editor',
                description: 'Developed a massive WYSIWYG UI with refactored input components (react-hook-form) to handle live preview changes, with an astounding amount of cross-input dependencies and form logic.'
            },
            {
                label: 'IM Chat',
                description: 'Real-time messaging feature for rooms with profanity filtering.'
            },
            {
                label: 'Voting + Polling',
                description: 'Real-time system to handle formalized voting with vote seconders and amendments, alongside non-formal multi-input polling.'
            },
            {
                label: 'Analytics',
                description: 'Real-time display of live viewer count through analytics observers, and live user activity feeds.'
            },
            {
                label: 'Video Player',
                description: 'Leveraged `plyr.js` alongside `HLS.js` to create a custom, responsive, and diverse video player meant for both live stream and pre-recorded data.'
            },
            {
                label: 'User Tracking',
                description: 'Created a scalable user tracking system to suit the rigorous needs of clients, supported heavily by WebSockets which allowed a real-time event-based reactivity to end-user actions. Possessed the ability to track user entrance/exit to pages and consecutive watch-time counting.'
            },
            {
                label: 'Event Registration',
                description: 'Implemented a system to track registrations for events in the future, with added Google Calendar API integration. Registration was a complex process, as users could join as guests or anonymous, or as accounts with existing registrations.'
            },
            {
                label: 'Access Levels',
                description: 'Designed data model to accomodate 5 levels of access: super-admin, moderator, user, anonymous, guest. Each level of access did not compromise the level of user tracking that clients require.'
            },
            {
                label: 'Help & Tickets',
                description: 'Developed UI and feature to support comprehensive FAQ and live help, with ticket tracking integration through Helpscout.'
            },
            {
                label: 'User Profiles',
                description: 'Profile customization from user details, general settings, and billing information. Including a forgot password tokenized email flow, and a change/reset email flow.'
            },
            {
                label: 'Form Builder',
                description: 'Created an interface, mainly featured in the WYSIWYG editor, to support dynamic items - like sponsors, or custom registration questions.'
            },

        ]
    },
    {
        label: 'Backend Tech',
        set: [
            {
                label: 'NodeJS',
                description: 'Backend server application through NodeJS. Creating custom middleware for frontend HTTP requests.'
            },
            {
                label: 'ExpressJS',
                description: 'Custom RESTful API for client-server communication.'
            },
            {
                label: 'PassportJS',
                description: 'Implemented local, Google, and Facebook strategies for user authentication.'
            },
            {
                label: 'MySQL',
                description: 'Created MySQL schema to support models like events, user accounts, registration, analytics data, custom form templates, and many more. Utilized `mysql` package to create secure database queries from backend.'
            },
            {
                label: 'Redis',
                description: 'Leveraged Redis as a cache/store for session information and highly requested data.'
            },

        ]
    },
    {
        label: 'Developer Operations',
        set: [
            {
                label: 'npm',
                description: ''
            },
            {
                label: 'git',
                description: 'Used git to manage dev/QA/production workflow. '
            },
            {
                label: 'Scripts',
                description: 'Used custom shell scripts (bash) to automate build, push, and deployment operations.'
            },
            {
                label: 'Testing',
                description: 'Used custom shell scripts (bash) to automate build, push, and deployment operations.'
            },
            {
                label: 'Documentation',
                description: 'Documented code, solutions, and tests using `nifty` project management, and provided both granular and course systems designs graphs through LucidChart.'
            },
        ]
    },
    {
        label: 'Cloud / Services',
        set: [
            {
                label: 'AWS',
                description: 'S3 for user-uploaded media storage. EC2/ECS for managing machine images and hosting frontend and backend containers, allowing for auto-scaling instances and load-balancers. SES to handle email jobs, complete with dynamic user-based content. Lightsail to manage developer servers and databases.'
            },
            {
                label: 'Docker',
                description: 'Docker to easily create and start development environments and services like databases, caches, etc.'
            },
        ]
    },
]

const VVCCarousels = () => {

    let carousels = []

    for (let stack of VVCTechnologies) {

        let cards = []

        for (let tech of stack.set) {

            if (tech.description) {
                cards.push(
                    <CardBox className={'whitespace-nowrap snap-center'} key={tech.label}>
                        <>
                            {tech.label}

                            <Tooltip title={tech.description} className={'font-aeonik'}>
                                <i className="fa-solid fa-info"></i>
                            </Tooltip>
                        </>
                    </CardBox>
                )
            } else {
                cards.push(
                    <CardBox className={'whitespace-nowrap snap-center'}>
                        {tech.label}
                    </CardBox>
                )
            }

        }

        carousels.push(
            <div className={'w-full relative'}>
                <h3 className={'font-aeonik font-bold text-center'}>{stack.label}</h3>
                <BoxCarousel className={'mt-2 font-aeonik'} id={stack.label} progressColor={'orange-gradient'}
                             key={stack.label}>
                    {cards}
                </BoxCarousel>
            </div>
        )
    }

    return (
        <>
            {carousels}
        </>
    )
}

const VVCMarquees = () => (
    <div className={'flex flex-col gap-6 justify-evenly max-w-[33%]'}>

        <div>
            <h3 className={'font-aeonik font-bold text-center'}>Project</h3>
            <Marquee gradient={false} play={true} className={'h-fit rounded-xl font-rubik'} speed={30}
                     pauseOnHover={true}>
                <CardBox className={'whitespace-nowrap mx-2'}>Agile</CardBox>
                <CardBox className={'whitespace-nowrap mx-2'}>Agile</CardBox>
            </Marquee>
        </div>
    </div>
)

const TODTechnologies = [
    {
        label: 'Salesforce',
        set: [
            {
                label: 'Big Data',
                description: 'Learning how giant companies use CRM software to track upwards of a million users and their interactions.'
            },
            {
                label: 'APEX',
                description: 'Java-like object-oriented programming language.'
            },
            {
                label: 'SOQL',
                description: 'Salesforce Object Query Language that allows querying object'
            },
            {
                label: 'Data Models',
                description: 'Learning about Salesforce base and custom object models that allow data to have relations.'
            },
        ]
    },
    {
        label: 'Marketing Cloud',
        set: [
            {
                label: 'Automation & Scale',
                description: 'Learning about the process of how companies market to millions of users, the technical details of sending those emails, and the theory behind using dynamic content within emails.'
            },
            {
                label: 'Ethics',
                description: 'Learning about the rights of the consumer, and why it is important to consider the user when delivering marketing content. Laws such as the GDPR, and how companies respect user permissions and preferences at a large-scale.'
            },
            {
                label: 'AMPSCript',
                description: 'Learnt and utilized a simple templating language specific to Marketing Cloud. It is both a scripting, and template language as it combines querying marketing databases, and displaying that data.'
            },
            {
                label: 'Web Fundamentals',
                description: 'Utilized basic HTML, CSS, and JS - alongside AMPScript, to build web interfaces for clients.'
            },
        ]
    },
    {
        label: 'Consultant',
        set: [
            {
                label: 'Teacher',
                description: 'Created and directly presented learning materials to clients for the hand-off phase.'
            },
            {
                label: 'Tester',
                description: 'Performed UAT script writing and testing.'
            },
        ]
    },
    {
        label: 'Intern',
        set: [
            {
                label: 'Community',
                description: 'Networked with my intern cohort to create community. Organized various game and study sessions.'
            },
            {
                label: 'Learner',
                description: 'Went above and beyond on learning materials (Salesforce Trailhead).'
            },
        ]
    },
]

const TODCarousels = () => {

    let carousels = []

    for (let stack of TODTechnologies) {

        let cards = []

        for (let tech of stack.set) {

            if (tech.description) {
                cards.push(
                    <CardBox className={'whitespace-nowrap snap-center'} key={tech.label}>
                        <>
                            {tech.label}

                            <Tooltip title={tech.description} className={'font-aeonik'}>
                                <i className="fa-solid fa-info fa"></i>
                            </Tooltip>
                        </>
                    </CardBox>
                )
            } else {
                cards.push(
                    <CardBox className={'whitespace-nowrap snap-center'}>
                        {tech.label}
                    </CardBox>
                )
            }

        }

        carousels.push(
            <div className={'w-full relative'}>
                <h3 className={'font-aeonik font-bold text-center'}>{stack.label}</h3>
                <BoxCarousel className={'mt-2 font-aeonik'} id={stack.label} progressColor={'orange-gradient'}
                             key={stack.label}>
                    {cards}
                </BoxCarousel>
            </div>
        )
    }

    return (
        <>
            {carousels}
        </>
    )
}

export default function Experience({}) {
    return (

        <div className={'flex flex-col justify-center items-center gap-3 max-w-full p-3'}>

            <Pane id={'MOZ'} className={'w-full '}>
                <div>
                    <h2 className="title">
                        MOZ Group / Ziff Davis

                        <div className={'inline-flex gap-4 mx-2'}>
                            <Tooltip
                                title={"Software company targeted around marketing and SEO solutions."}>
                                <FaInfoCircle size={'1.5rem'}/>
                                {/*<i className="fa-solid fa-square-info ml-3 self-center fa-xs"></i>*/}
                            </Tooltip>

                            <a target={"_blank"} href={'https://mozgroup.com'} className={'inline'}>
                                <FaExternalLinkAlt size={'1.5rem'}/>
                            </a>
                        </div>

                    </h2>

                    <h3 className={'subtitle flex flex-wrap gap-2'}>
                        <Rule/>
                        <span
                            className={'max-w-full break-words'}>Intermediate Frontend Developer</span>
                        <Rule/>
                        <span>May 29, 2023 - Present</span>
                    </h3>
                    {/*<SubtitleRule textPos={'right'} classes={'subtitle'}>*/}
                    {/*    <span*/}
                    {/*        className={'max-w-full break-words'}>Intermediate Frontend Developer (STAT Product Team)</span>*/}
                    {/*    <div className={`hr-fill`}/>*/}
                    {/*    <p>May 29, 2023 - Present</p>*/}
                    {/*</SubtitleRule>*/}
                </div>
            </Pane>

            <Pane id={'VVC'}>
                <div>
                    <h2 className="title ">
                        {/*<span className={'break-words'}>*/}
                        Van Valkenburg Communications (VVC)
                        {/*</span>*/}

                        <div className={'inline-flex gap-4 mx-2'}>
                            <Tooltip
                                title={"Audio-visual production company. Small business. Specializes in company/government broadcasts."}>
                                <FaInfoCircle size={'1.5rem'}/>
                                {/*<i className="fa-solid fa-square-info ml-3 self-center fa-xs"></i>*/}
                            </Tooltip>

                            <a target={"_blank"} href={'https://vvc.ca'} className={'inline'}>
                                <FaExternalLinkAlt size={'1.5rem'}/>
                            </a>
                        </div>

                    </h2>

                    <h3 className={'subtitle flex flex-wrap gap-2'}>
                        <Rule/>
                        <p>Fullstack Developer</p>
                        <Rule/>
                        <p>March 2021 - February 2023</p>
                    </h3>

                    {/*<SubtitleRule textPos={'right'} classes={'subtitle'}>*/}
                    {/*    <p>Fullstack Developer</p>*/}
                    {/*    <div className={`hr-fill`}/>*/}
                    {/*    <p>March 2021 - February 2023</p>*/}
                    {/*</SubtitleRule>*/}

                    <div className={'flex mt-10 flex-row flex-wrap md:flex-nowrap gap-6'}>

                        <div className={'flex flex-col gap-3 md:max-w-[33%] max-w-full'}>
                            <VVCCarousels/>
                        </div>

                        <div className={'flex flex-col gap-2'}>
                            <h3 className={'font-aeonik font-bold'}>Description + Responsibilities + Achievements</h3>
                            <TextBox className={'font-rubik md:p-6 font-thin text-xl flex flex-col gap-5'}>
                                <>
                                    <p>
                                        Initially hired in 2020 to help offset the amount of virtual events brought in
                                        by
                                        the
                                        pandemic. At the beginning, I was doing basic technical tasks in a WordPress
                                        instance,
                                        and it quickly became obvious that the company was outgrowing WordPress.
                                    </p>
                                    <hr className={'h-[1px] bg-slate-900 border-0'}/>
                                    <p>
                                        In response, a developer and I started imagining a bigger and better application
                                        that would solve a lot of the pain problems that WordPress brought.
                                        A <b>fullstack</b> application was the proposed solution, and in 2021 - my role
                                        was moved to focus
                                        on
                                        learning and developing this fullstack application.
                                    </p>
                                    <hr className={'h-[1px] bg-slate-900 border-0'}/>
                                    <p>
                                        While working at an internship and doing a part-time semester, I started going
                                        deep
                                        into applications of JavaScript like React and Node - the stack decided for this
                                        project.
                                        We needed to build a totally new UI, with much better and refined UX - based on
                                        the
                                        style that our end-users already know: Bootstrap 5. It had to be reactive,
                                        responsive, accurate, accessible, and international. It also required a backend,
                                        which was easily done in NodeJS in combination with ExpressJS.
                                    </p>
                                    <hr className={'h-[1px] bg-slate-900 border-0'}/>
                                    <p>
                                        Over time, I learnt a lot about practical web development, and started to become
                                        very passionate in the challenge of having to develop a feature in more than one
                                        area. You build the required data model, the schema, and the backend API routes.
                                        You
                                        build the frontend UI to to support the new API routes, the new incoming data.
                                        Build
                                        automated tests.
                                    </p>
                                    <hr className={'h-[1px] bg-slate-900 border-0'}/>
                                    <p>
                                        A huge achievement is the fact that I started the project with <u>virtually no
                                        practical knowledge in JavaScript</u>, and learnt everything as I went. What was
                                        really
                                        rewarding was the ability to take a shot at a problem and come back after some
                                        time
                                        to realize my mistakes - and the knowledge to fix them. Being in the position
                                        where
                                        I was mostly a solo developer, and having no way to get answers to really
                                        specific
                                        problems gave me the opportunity to learn heavily about JavaScript, programming,
                                        and solving problems
                                        in general. Starting from scratch was the best way to intuitively see for myself
                                        why
                                        applications are built with specific stacks, why modern toolkits, libraries, and
                                        packages are actually used, and how developers have
                                        already
                                        come up with solutions for complex problems - like managing data and
                                        asynchronous
                                        functions.
                                    </p>
                                </>
                            </TextBox>
                        </div>
                    </div>
                </div>
            </Pane>

            <Pane id={'TOD'}>
                <div>
                    <h2 className="title">
                        Traction on Demand

                        <Tooltip title={"Salesforce Consultancy. Acquired by Salesforce."}>
                            <i className="fa-solid fa-square-info ml-3 self-center fa-xs"></i>
                        </Tooltip>
                    </h2>

                    <SubtitleRule classes={'subtitle'}>
                        <p> Salesforce Developer</p>
                        <div className={`hr-fill`}/>
                        <p> Marketing Automation</p>
                        <div className={`hr-fill`}/>
                        <p> May 2021 - December 2021</p>
                    </SubtitleRule>

                    <div className={'flex mt-10 flex-row flex-wrap md:flex-nowrap gap-6'}>

                        <div className={'flex flex-col gap-3 md:max-w-[33%] max-w-full'}>
                            <TODCarousels/>
                        </div>

                        <div className={'flex flex-col gap-2'}>
                            <h3 className={'font-aeonik font-bold'}>Description + Responsibilities + Achievements</h3>
                            <TextBox className={'font-rubik md:p-6 font-thin text-xl flex flex-col gap-5'}>
                                <>
                                    Collaborated within a large 20+ team of diverse roles to learn marketing automation
                                    principles through practical consultation, and Salesforce as a CRM solution for big
                                    and small clients.
                                    <hr className={'h-[1px] bg-slate-900 border-0'}/>
                                    A primary take away from this experience is the impact that
                                    individual contribution to a team project, no matter how small, will always lead to
                                    better growth and success, and transparent communication is essential.
                                    <hr className={'h-[1px] bg-slate-900 border-0'}/>
                                </>
                            </TextBox>
                        </div>
                    </div>

                </div>
            </Pane>
        </div>


    )
}