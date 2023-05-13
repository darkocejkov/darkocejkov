import React, {useMemo, useState} from "react";
import {CustomLink} from "../Components/Basics.tsx";
import {Arena, Notion, Linktree, Github, LinkedIn, Discord, HackerRank} from '../assets/svg/SVG'
import {ReactChild} from "../types";
import {Tooltip} from "antd";
import {Toast} from "../Hooks/Toast.tsx";
import {motion} from 'framer-motion'

import {SiNotion, SiHackerrank, SiDiscord, SiGithub, SiLinkedin, SiLinktree, SiYoutube} from "react-icons/si";
import {IconContext} from "react-icons";

type Link = {
    label: string,
    icon?: ReactChild,
    url: string
}

const links = [
    {
        label: 'Github',
        icon: <SiGithub/>,
        url: 'https://github.com/darkocejkov'
    },
    {
        label: 'LinkedIn',
        icon: <SiLinkedin/>,
        url: 'https://www.linkedin.com/in/darko-cejkov/\n'
    },
    {
        label: 'Notion',
        icon: <SiNotion/>,
        url: 'https://www.notion.so/darkocheykov/Darko-Cejkov-4ad2da60e1da4b83a24c3fbd809293be?pvs=4'
    },
    {
        label: 'Are.na',
        icon: <Arena/>,
        url: 'https://www.are.na/darko-cejkov-t-ekov-cheykov'
    },
    {
        label: 'Youtube',
        icon: <SiYoutube/>,
        url: 'https://www.are.na/darko-cejkov-t-ekov-cheykov'
    },
    {
        label: 'Discord',
        icon: <SiDiscord/>,
        clipboard: {
            text: 'cybersaint#0118',
        }
    },
    {
        label: 'Linktree',
        icon: <SiLinktree/>,
        url: 'https://linktr.ee/darkocejkov'
    },
    {
        label: 'HackerRank',
        icon: <SiHackerrank/>,
        url: 'https://www.hackerrank.com/darkocheykov'
    },


]

const Link = ({label, icon, url}: Link) => {
    return (
        <Tooltip title={label}>
            <a className={'p-4 rounded-xl link-background-to-r'} href={url} target={'_blank'}
               rel={"noreferrer noopener"}>
                {icon}
            </a>
        </Tooltip>

    )
}

const HEADER_TEXT = "socials"

export default function Links({}) {

    const [selected, setSelected] = useState<Link>()

    // Cycling marquee container, in which each the elements are rendered within "3D" space
    // Inspired by the Apple time-picker UI, in which you "scroll" a "barrel" or "cylinder" to pick an active element
    //      - except this one is horizontal

    const header = useMemo(() => {

        let array = []

        for (let i = 0; i < HEADER_TEXT.length; i++) {
            array.push(
                <span className={'z-20 select-none'}>
                    {HEADER_TEXT[i]}
                </span>
            )
        }

        return array

    }, [])

    const [headerHovered, setHeaderHovered] = useState(false)

    const headerVariants = {
        static: {
            letterSpacing: '0px',
            transition: {
                type: 'spring',
                when: 'beforeChildren',
            }
        },
        hovered: {
            letterSpacing: '5px',
            transition: {
                type: 'spring',
                when: 'beforeChildren',
            }
        }
    }


    return (
        <div className={'flex flex-col justify-center items-center gap-3'}>
            {/*<CustomLink className={'text-9xl z-10 font-rubik font-medium'} url={'https://www.linkedin.com/darko-cejkov'}>*/}
            {/*    LinkedIn*/}
            {/*</CustomLink>*/}


            <motion.h1
                variants={headerVariants}
                animate={headerHovered ? "hovered" : "static"}
                onMouseEnter={() => setHeaderHovered(true)}
                onMouseLeave={() => setHeaderHovered(false)}
                className={'text-[12rem] relative font-tabi uppercase flex flex-nowrap group'}>
                <span className={'z-30 select-none'}>Socials</span>
                {/**/}


            </motion.h1>

            <div className={'w-screen p-6 flex justify-center items-center flex-nowrap'}>

                <div className={'flex flex-nowrap gap-4 justify-center relative items-center group link-container'}>
                    <IconContext.Provider value={{size: '100px'}}>

                        {links.map((x) => {
                            return (
                                <CustomLink {...x}>
                                    {x.icon}
                                </CustomLink>
                            )
                        })}
                    </IconContext.Provider>

                    <div
                        className={'pointer-events-none absolute top-0 left-0 h-[100%] w-[200vw] -translate-x-1/2 bg-lime-300 z-10 group-hover:h-[200%] group-hover:-translate-y-[50%] group-hover:-skew-y-2  transition-all'}></div>
                    <div
                        className={'pointer-events-none absolute top-0 left-0 h-[100%] w-[200vw] -translate-x-1/2 bg-rose-400 z-10 group-hover:h-[200%] group-hover:-translate-y-[25%] group-hover:skew-y-2 transition-all'}></div>
                    <div
                        className={'pointer-events-none absolute top-0 left-0 h-[100%] w-[200vw] -translate-x-1/2 bg-blue-400 z-10 group-hover:h-[200%] group-hover:skew-y-6 transition-all'}></div>
                    <div
                        className={'pointer-events-none absolute top-0 left-0 h-[100%] w-[200vw] -translate-x-1/2 bg-orange-400 z-10 group-hover:h-[200%] group-hover:skew-y-12 group-hover:translate-y-[25%]  transition-all'}></div>

                </div>
            </div>


        </div>
    )
}