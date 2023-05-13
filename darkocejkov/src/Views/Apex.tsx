import React, {useEffect, useRef, useState} from 'react'

import {Routes, Route, Navigate, useLocation} from 'react-router-dom'

import {Layout} from "../Components/Layout.tsx";
import Navigation, {TopNav} from "../Components/Navigation.tsx";
import {ControlBar, MusicBar} from "../Components/Controller.tsx";

import Hero from '../Pages/Hero.tsx'
import Experience from '../Pages/Experience.tsx'
import Blog from "../Pages/Blog.tsx";
import Education from "../Pages/Education.tsx";
import Projects from "../Pages/Projects.tsx";
import About from '../Pages/About.tsx'
import Tools from "../Pages/Tools.tsx";
import Links from '../Pages/Links.tsx'
import Contact from "../Pages/Contact.tsx";
import Files from '../Pages/Files.tsx'
import NotFound from "../Pages/404.tsx";

import {NavRoute, ReactChild} from '../types.ts'
import {LoadBar} from "../Components/Basics.tsx";
import {Toast, ToastProvider, useToast} from "../Hooks/Toast.tsx";

import {BsArrowUpLeftCircle} from "react-icons/bs";
import {SiAboutdotme} from 'react-icons/si'
import {
    TbSchool,
    TbHeartHandshake,
    TbBrain,
    TbFolder,
    TbTerminal2,
    TbMail,
    TbAsterisk,
    TbMathPi,
    TbRegex
} from 'react-icons/tb'

import {RiHomeLine} from 'react-icons/ri'

import {MdAlternateEmail} from "react-icons/md";
import {FiTool} from "react-icons/fi";

const LocationIcon = ({primary, secondary, path}: {
    primary: ReactChild,
    secondary: ReactChild,
    path: string,
}) => {

    const location = useLocation()

    if (location.pathname === path) {
        return (
            <>
                {primary}
            </>
        )
    }

    return (
        <>
            {secondary}
        </>
    )
}

const Icon = ({children, className = ''}: {
    children: ReactChild,
    className?: string,
}) => {
    return (
        <div className={`p-1 ${className}`}>
            {children}
        </div>
    )
}

export default function Apex({}) {


    const routes: NavRoute[] = [
        {
            path: '/',
            description: 'Home',
            element: <Hero/>,
            icon: (

                <LocationIcon primary={(
                    <Icon>
                        <RiHomeLine/>
                    </Icon>
                )} secondary={(
                    <Icon>
                        <BsArrowUpLeftCircle/>
                    </Icon>
                )} path={'/'}/>


            ),
            label: 'Home'
        },
        {
            path: '/about',
            description: 'About',
            element: <About/>,
            label: 'About Me',
            icon: (
                <div className={'p-1'}>
                    <TbRegex/>
                    {/*<SiAboutdotme/>*/}
                </div>
            ),
        },
        {
            path: '/education',
            element: <Education/>,
            label: 'Education',
            description: 'Education',
            icon: (
                <div className={'p-1'}>
                    <TbMathPi/>
                    {/*<TbSchool/>*/}
                </div>
            ),
        },
        {
            path: '/experience',
            element: <Experience/>,
            description: 'Experience',
            label: 'Professional Experience',
            icon: (
                <div className={'p-1'}>
                    <TbAsterisk/>
                    {/*<TbHeartHandshake/>*/}
                </div>
            ),
        },
        {
            path: '/projects',
            element: <Projects/>,
            description: 'Projects',
            label: 'Project Portfolio',
            icon: (
                <div className={'p-1'}>
                    <TbTerminal2/>


                </div>
            ),
        },
        {
            path: '/links',
            description: 'Socials',
            element: <Links/>,
            icon: (
                <div className={'p-1'}>
                    <MdAlternateEmail/>
                </div>
            ),
            label: 'Socials & Links',
        },
        {
            description: 'Files',
            path: '/files',
            element: <Files/>,
            icon: (
                <div className={'p-1'}>
                    <TbFolder/>
                </div>
            ),
            label: 'Files & Downloads',
        },
        {
            description: 'Contact',
            path: '/contact',
            element: <Contact/>,
            icon: (
                <div className={'p-1'}>
                    <TbMail/>
                </div>
            ),
            label: 'Contact Me',
        },
        {
            description: 'Tools',
            path: '/tools',
            element: <Tools/>,
            icon: (
                <div className={'p-1'}>
                    <FiTool/>
                </div>
            ),
            label: 'Tools & Utilities',
        },
        {
            description: 'Blog',
            path: '/blog',
            element: <Blog/>,
            icon: (
                <div className={'p-1'}>
                    <TbBrain/>
                </div>
            ),
            label: 'Knowledge Base & Blog',
        },
        {
            path: '*',
            element: <Navigate to={'/404'}/>,
            includeInNav: false,
        },
        {
            path: '/404',
            element: <NotFound/>,
            label: 'Home',
            includeInNav: false,
        }
    ]

    const layoutClassName = ''

    const [selectedRoute, setSelectedRoute] = useState<NavRoute>()

    const location = useLocation()

    useEffect(() => {
        let route = routes.find(x => x.path === location.pathname)
        setSelectedRoute(route)

    }, [location])


    return (
        <ToastProvider>
            <LoadBar progress={0}/>

            {/*<ToolController/>*/}

            {/*<Navigation routes={routes}/>*/}
            <TopNav routes={routes}/>

            <Layout>
                <Routes>
                    {routes.map(route => {
                        return <Route {...route} key={route.path}/>
                    })}
                </Routes>
            </Layout>

            {/*<ControlBar/>*/}
            {/*<MusicBar/>*/}

        </ToastProvider>
    )

}