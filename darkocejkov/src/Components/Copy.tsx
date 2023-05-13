import {SubtitleRule} from "./Basics.tsx";
import React from "react";

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