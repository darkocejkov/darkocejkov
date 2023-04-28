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

const VVCExperience = () => (
    <>
        <div className={'tree'}>
            <SubtitleRule classes={'text-xl text-center font-bold'} textPos={'center'}>
                Lead Developer
            </SubtitleRule>
            <ul>
                <li>Formalized system design process through visualization methods, such as
                    Lucidchart, incorporating the use of UML and architecture diagrams
                </li>
                <li>Fostered novel ideas such as self-serve, utilizing subscription and billing
                    features to promote
                </li>
                <li>Documenting solutions, designs, ideas, packages, and software stack</li>
                <li>Performed weekly and daily AGILE sprint cycles to manage project
                    expectations,
                    progress, and roadblocks with team of testers and managers
                </li>
                <li>Used "nifty" project management tool to document bugs, tickets, milestones
                    and
                    gotcha's - and to delegate work to appropriate teammates when sprints are
                    finished
                </li>
                <li>Rebased Git tree for organization, and enabled the use of feature branches
                    to
                    work around pushing incomplete reworks and unfinished features
                </li>
                <li>Introduced shell scripts to automate webpack build and deployment for 3
                    seperate
                    deployment branches on cloud servers, which heavily reduced pull/push
                    conflicts
                    between other developers
                </li>

                <li>Performed data-driven cross-references between dependent packages and lists
                    of
                    known vulnerabilities to reduce the risk of future security breaches
                </li>

                <li>Monitored and analyzed large-scale UAT beta testing with clients and upwards
                    of
                    1000 concurrent users, to find large flaws in scalability, data models, and
                    in-place solutions
                </li>
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
                    Developed and maintained 30+ integrated pages, components, and displays for
                    both
                    end-user and administrator function.
                </li>
                <li>
                    Used Classless/Functional React principles to create large component
                    hierarchies
                    for a wide variety of modules, such as controlled input, display,
                    translation
                </li>
                <li>
                    Mastered react-router v5 to control Single-page Application (SPA)
                    navigation,
                    and display custom UI to block navigation on dirty form states
                </li>
                <li>
                    Created over 10 custom higher-order-components (HOCs) to properly motivate
                    encapsulation and code-reusability between forms
                </li>
                <li>
                    Leveraged suspenseful loading techniques to display status of UI as well as
                    lifecycle hooks to maximize data fetching process.
                </li>
                <li>
                    Refined the process of parent-child hierarchy for complex components by
                    developing custom hooks to parent the logic, while passing children
                    appropriate
                    render functions
                </li>
                <li>
                    Innovated previous design constraints by refactoring previous solutions to
                    evolve features into well-designed systems, with room for additional growth
                </li>
            </ul>

            <h2>Style</h2>
            <ul>
                <li>
                    Elevated UI/UX with Bootstrap 5 and SCSS, as well as styled-components
                </li>
                <li>
                    Developed dynamic and responsive UI through mobile-first Bootstrap-based
                    principles, taking into consideration dynamic user-submitted data
                </li>
            </ul>

            <h2>Features</h2>
            <ul>
                <h3>
                    Real-time Chat and Messaging
                </h3>
                <ul>
                    <li>
                        Enabled real-time communication between any users, facilitating
                        WebSockets
                        and its channels to provide all users with data as created, without
                        requiring further database connections
                    </li>
                    <li>
                        Went above and beyond the scoped rework to enable direct (private)
                        messaging
                        system, and relational message-to-message reply system
                    </li>
                </ul>

                <h3>
                    Voting/Polling
                </h3>
                <ul>
                    <li>
                        Designed and implemented large-scale formal voting (Robert's Rules) and
                        polling systems to capture user data while honoring the amendment and
                        seconding process in real-time
                    </li>

                </ul>

                <h3>
                    Analytics & Reporting
                </h3>
                <ul>
                    <li>
                        Leveraged customized Nivo charts to develop high-level real-time
                        analytics
                        reporting graphs, with custom D3 layers for adding event-triggered
                        display
                    </li>
                    <li>
                        Developed manual and automated custom javascript-powered CSV, PDF and
                        JSON
                        exports of current, and aggregated event data for client
                    </li>
                    <li>
                        Utilized Ant Design to outsource difficult component work such as data
                        tables, with full sorting, filtering, and selection ability
                    </li>
                </ul>

                <h3>
                    Reusable Form Components
                </h3>
                <ul>
                    <li>
                        Refactored state-based form handlers to use
                        react-hook-form to promote simple scalability, modularity, and
                        form-based
                        validation rules
                    </li>
                    <li>
                        Forms could use basic HTML inputs, or custom external package components
                        such as DraftJS
                    </li>
                    <li>
                        Created responsive, large-scale WYSIWYG object editors with components,
                        complete with translation forms to help users manage translations of
                        dynamically entered content
                    </li>
                </ul>

                <h3>
                    Diverse Video/Stream Player
                </h3>
                <ul>
                    <li>
                        Customized video player components using plyr.js and HLS.js to enable a
                        wide
                        variety of input, and especially integrating with AWS streaming with
                        multi-channel captions
                    </li>
                </ul>

                <h3>
                    Administration
                </h3>
                <ul>
                    <li>
                        Drove large quality-of-life updates by creating administration dashboard
                        for
                        site admins to view site-wide information, such as the number of active
                        users, CPU performance, and simple graphical views of activity per
                        webpage
                    </li>
                </ul>

            </ul>

            <h2>Accessibility & Internationalization</h2>
            <ul>
                <li>
                    Integrated i18n for multilingual translations, with site-wide support for
                    a11y
                    principles for accessibility
                </li>
                <li>
                    Simplified the headache of timezone translation by using moment.js to handle
                    all
                    datetime data
                </li>
            </ul>

            <div className={'text-center font-italic my-2'}>
                React, stateless, components, lifecycle hooks, parent-child hierarchy,
                encapsulation, modularity, react-hook-form, form validation, draftjs, Bootstrap,
                SPA, HOC, Ant Design, Nivo, D3, Plyr, HLS, WebSockets, Responsive, Mobile-first,
                Analytics, Dashboards, a11y, CI/CD
            </div>
        </div>
    </>
)

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

    return carousels
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

    return carousels
}

export default function Experience({}) {
    return (

        <div className={'flex flex-col justify-center items-center gap-3 max-w-[100vw]'}>
            <Pane id={'VVC'}>
                <div>
                    <h2 className="md:text-4xl text-xl font-tabi">
                        Van Valkenburg Communications (VVC)
                        <Tooltip
                            title={"Audio-visual production company. Small business. Specializes in company/government broadcasts."}>
                            <i className="fa-solid fa-square-info ml-3 self-center fa-xs"></i>
                        </Tooltip>
                    </h2>
                    <SubtitleRule textPos={'right'} classes={'md:text-2xl text-xl font-maru font-bold uppercase'}>
                        <p>Fullstack Developer</p>
                        <div className={`lg:flex-1 w-full h-[1px] bg-slate-900 self-center`}/>
                        <p>March 2021 - February 2023</p>
                    </SubtitleRule>

                    <div className={'flex mt-10 flex-row flex-wrap md:flex-nowrap gap-6'}>

                        <div className={'flex flex-col gap-3 md:max-w-[33%]'}>
                            <VVCCarousels/>
                        </div>
                        {/*<VVCMarquees/>*/}

                        <div className={'flex flex-col gap-2'}>
                            <h3 className={'font-aeonik font-bold'}>Description + Responsibilities + Achievements</h3>
                            <TextBox className={'font-rubik md:p-6 font-thin text-xl flex flex-col gap-5'}>
                                {/*<VVCExperience/>*/}
                                <>
                                    <p>
                                        Initially hired in 2020 to help offset the amount of virtual events brought in
                                        by
                                        the
                                        pandemic. At the beginning, I was doing basic technical tasks in a WordPress
                                        instance,
                                        and it quickly became obvious that the company was outgrowing WordPress.
                                    </p>
                                    <hr className={'h-[1px] bg-orange-400 border-0'}/>
                                    <p>
                                        In response, a developer and I started imagining a bigger and better application
                                        that would solve a lot of the pain problems that WordPress brought.
                                        A <b>fullstack</b> application was the proposed solution, and in 2021 - my role
                                        was moved to focus
                                        on
                                        learning and developing this fullstack application.
                                    </p>
                                    <hr className={'h-[1px] bg-orange-400 border-0'}/>
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
                                    <hr className={'h-[1px] bg-orange-400 border-0'}/>
                                    <p>
                                        Over time, I learnt a lot about practical web development, and started to become
                                        very passionate in the challenge of having to develop a feature in more than one
                                        area. You build the required data model, the schema, and the backend API routes.
                                        You
                                        build the frontend UI to to support the new API routes, the new incoming data.
                                        Build
                                        automated tests.
                                    </p>
                                    <hr className={'h-[1px] bg-orange-400 border-0'}/>
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
                    <h2 className="md:text-4xl text-xl font-tabi">
                        Traction on Demand

                        <Tooltip title={"Salesforce Consultancy. Bought by Salesforce."}>
                            <i className="fa-solid fa-square-info ml-3 self-center fa-xs"></i>
                        </Tooltip>
                    </h2>

                    <SubtitleRule classes={'md:text-2xl text-xl font-maru font-bold uppercase'}>
                        <p> Salesforce Developer</p>
                        <div className={`lg:flex-1 w-full h-[1px] bg-slate-900 self-center`}/>
                        <p> Marketing Automation</p>
                        <div className={`lg:flex-1 w-full h-[1px] bg-slate-900 self-center`}/>
                        <p> May 2021 - December 2021</p>
                    </SubtitleRule>

                    <div className={'flex mt-10 flex-row flex-wrap md:flex-nowrap gap-6'}>

                        <div className={'flex flex-col gap-3 md:max-w-[33%]'}>
                            <TODCarousels/>
                        </div>

                        <div className={'flex flex-col gap-2'}>
                            <h3 className={'font-aeonik font-bold'}>Description + Responsibilities + Achievements</h3>
                            <TextBox className={'font-rubik md:p-6 font-thin text-xl flex flex-col gap-5'}>
                                <>
                                    Collaborated within a large 20+ team of diverse roles to learn marketing automation
                                    principles through practical consultation, and Salesforce as a CRM solution for big
                                    and small clients.
                                    <hr className={'h-[1px] bg-orange-400 border-0'}/>
                                    A primary take away from this experience is the impact that
                                    individual contribution to a team project, no matter how small, will always lead to
                                    better growth and success, and transparent communication is essential.
                                    <hr className={'h-[1px] bg-orange-400 border-0'}/>
                                </>
                            </TextBox>
                        </div>
                    </div>


                    {/*<div className={'flex flex-col gap-2 mt-5'}>*/}
                    {/*    <h3 className={'font-aeonik font-bold'}>Description, Responsibilities, Achievements</h3>*/}

                    {/*    <TextBox className={'font-fira font-thin p-3 flex flex-col gap-5'}>*/}
                    {/*        <div className={'tree'}>*/}
                    {/*            <SubtitleRule classes={'text-xl text-center'} textPos={'center'}>*/}
                    {/*                Teamwork*/}
                    {/*            </SubtitleRule>*/}
                    {/*            <ul>*/}
                    {/*                <li>Collaborated within a large 20+ person team to shadow, learn, and apply*/}
                    {/*                    hands-on knowledge of Salesforce Marketing Cloud*/}
                    {/*                </li>*/}
                    {/*                <li>Trained as a Ranger, preparing and advising other interns for Salesforce*/}
                    {/*                    Adminstrator certifications*/}
                    {/*                </li>*/}
                    {/*            </ul>*/}
                    {/*        </div>*/}

                    {/*        <div className={'tree'}>*/}
                    {/*            <SubtitleRule classes={'text-xl text-center'} textPos={'center'}>*/}
                    {/*                Core Salesforce*/}
                    {/*            </SubtitleRule>*/}
                    {/*            <ul>*/}
                    {/*                <li>Trained in SOQL language to perform object-model queries</li>*/}
                    {/*                <li>Trained in the APEX object-oriented language to perform Salesforce*/}
                    {/*                    object*/}
                    {/*                    manipulation*/}
                    {/*                </li>*/}
                    {/*            </ul>*/}
                    {/*        </div>*/}

                    {/*        <div className={'tree'}>*/}
                    {/*            <SubtitleRule classes={'text-xl text-center'} textPos={'center'}>*/}
                    {/*                Salesforce Marketing Cloud*/}
                    {/*            </SubtitleRule>*/}
                    {/*            <ul>*/}
                    {/*                <li>Learnt of important legal marketing constraints such as the GDPR and the*/}
                    {/*                    various tasks to fulfill the requirements*/}
                    {/*                </li>*/}
                    {/*                <li>Learnt and utilized AMPScript as a templating language within emails and*/}
                    {/*                    webpages to personalize through referential data*/}
                    {/*                </li>*/}
                    {/*                <li>Used HTML, JavaScript, AMPScript, and CSS to create responsive*/}
                    {/*                    communication*/}
                    {/*                    preference centers*/}
                    {/*                </li>*/}
                    {/*                <li>Developed UAT scripts for clients based on the theoretical outputs of*/}
                    {/*                    AMPScript and overall marketing Journey flows*/}
                    {/*                </li>*/}
                    {/*                <li>Trained clients in user-handoff in areas such as the concepts of*/}
                    {/*                    AMPScript*/}
                    {/*                </li>*/}
                    {/*            </ul>*/}
                    {/*        </div>*/}

                    {/*        <div className={'text-center font-italic my-2'}>*/}
                    {/*            Apex, SOQL, AMPScript, HTML, JS, CSS, Marketing Automation, Marketing Journeys,*/}
                    {/*            GDPR*/}
                    {/*        </div>*/}

                    {/*    </TextBox>*/}

                    {/*</div>*/}

                </div>
            </Pane>
        </div>


    )
}