import React, {useState} from 'react'

import {Routes, Route, Navigate} from 'react-router-dom'

import {Layout} from "../Components/Layout.tsx";
import Navigation from "../Components/Navigation.tsx";
import {ControlBar, SketchControls, ToolController} from "../Components/Controller.tsx";

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

import {NavRoute} from '../types.ts'
import {LoadBar} from "../Components/Basics.tsx";

export default function Apex({}) {

    const routes: NavRoute[] = [
        {
            path: '/',
            element: <Hero/>,
            icon: '🏠',
            label: 'Home'
        },
        {
            path: 'about',
            element: <About/>,
            label: 'Home',
        },
        {
            path: 'education',
            element: <Education/>,
            label: 'Education',
        },
        {
            path: 'experience',
            element: <Experience/>,
            label: 'Professional Experience',
        },
        {
            path: 'projects',
            element: <Projects/>,
            label: 'Project Portfolio',
        },
        {
            path: 'links',
            element: <Links/>,
            label: 'Socials & Links',
        },
        {
            path: 'files',
            element: <Files/>,
            label: 'Files & Downloads',
        },
        {
            path: 'contact',
            element: <Contact/>,
            label: 'Contact Me',
        },
        {
            path: 'tools',
            element: <Tools/>,
            label: 'Tools & Utilities',
        },
        {
            path: 'blog',
            element: <Blog/>,
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


    return (
        <>
            <LoadBar progress={0}/>

            {/*<ToolController/>*/}

            <Navigation routes={routes}/>

            <Layout>
                <Routes>
                    {routes.map(route => {
                        return <Route {...route} key={route.path}/>
                    })}
                </Routes>
            </Layout>

            <ControlBar/>
        </>
    )

}