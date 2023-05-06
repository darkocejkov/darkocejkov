import React, {useMemo, useState} from "react";
import {CustomLink} from "../Components/Basics.tsx";
import {Arena, Notion, Linktree, Github, LinkedIn, Discord, HackerRank} from '../assets/svg/SVG'
import {ReactChild} from "../types";
import {Tooltip} from "antd";
import {Toast} from "../Hooks/Toast.tsx";

type Link = {
    label: string,
    icon?: ReactChild,
    url: string
}

const links = [
    {
        label: 'Github',
        icon: <Github />,
        url: 'https://github.com/darkocejkov'
    },
    {
        label: 'LinkedIn',
        icon: <LinkedIn />,
        url: 'https://www.linkedin.com/in/darko-cejkov/\n'
    },
    {
        label: 'Notion',
        icon: <Notion/>,
        url: 'https://www.notion.so/darkocheykov/Darko-Cejkov-4ad2da60e1da4b83a24c3fbd809293be?pvs=4'
    },
    {
        label: 'Are.na',
        icon: <Arena />,
        url: 'https://www.are.na/darko-cejkov-t-ekov-cheykov'
    },
    {
        label: 'Discord',
        icon: <Discord/>,
        clipboard: {
            text: 'cybersaint#0118',
        }
    },
    {
        label: 'Linktree',
        icon: <Linktree/>,
        url: 'https://linktr.ee/darkocejkov'
    },
    {
        label: 'HackerRank',
        icon: <HackerRank/>,
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

    return (
        <div className={'flex flex-col justify-center items-center gap-3'}>
            {/*<CustomLink className={'text-9xl z-10 font-rubik font-medium'} url={'https://www.linkedin.com/darko-cejkov'}>*/}
            {/*    LinkedIn*/}
            {/*</CustomLink>*/}


            <h1 className={'text-[12rem] relative font-tabi uppercase flex flex-nowrap gap-0 hover:gap-3 transition-all group'}>
                {header}
                <div
                    className={'absolute top-0 left-0 h-full w-full bg-orange-400 z-10 group-hover:skew-x-12 group-hover:skew-y-6 transition-all scale-x-[1.1]'}></div>
            </h1>

            <div className={'w-screen h-[20vh] bg-slate-900/10 flex justify-center items-center flex-nowrap'}>

                <div className={'flex flex-nowrap gap-4 justify-center items-center'}>
                    {links.map((x) => {
                        return (
                            <CustomLink {...x}>
                                {x.icon}
                            </CustomLink>
                        )
                    })}
                </div>
            </div>


        </div>
    )
}