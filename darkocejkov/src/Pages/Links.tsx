import React, {useState} from "react";
import {CustomLink} from "../Components/Basics.tsx";
import {Arena, Notion, Linktree, Github, LinkedIn, Discord} from '../assets/svg/SVG'
import {ReactChild} from "../types";

type Link = {
    label: string,
    icon?: ReactChild,
    url: string
}

const links = [
    {
        label: 'Github',
        icon: <Github />,
        url: ''
    },
    {
        label: 'LinkedIn',
        icon: <LinkedIn />,
        url: ''
    },
    {
        label: 'Notion',
        icon: <Notion/>,
        url: ''
    },
    {
        label: 'Are.na',
        icon: <Arena />,
        url: ''
    },
    {
        label: 'Discord',
        icon: <Discord />,
        url: ''
    },
    {
        label: 'Linktree',
        icon: <Linktree />,
        url: ''
    },

]

const Link = ({label, icon, url}: Link) => {
    return (
        <div className={'p-4 bg-orange-400 rounded-xl'}>
            {icon}
        </div>
    )
}

export default function Links({}) {

    const [selected, setSelected] = useState<Link>()

    // Cycling marquee container, in which each the elements are rendered within "3D" space
    // Inspired by the Apple time-picker UI, in which you "scroll" a "barrel" or "cylinder" to pick an active element
    //      - except this one is horizontal

    return (
        <div className={'flex flex-col justify-center items-center gap-3'}>
            {/*<CustomLink className={'text-9xl z-10 font-rubik font-medium'} url={'https://www.linkedin.com/darko-cejkov'}>*/}
            {/*    LinkedIn*/}
            {/*</CustomLink>*/}

            <div className={'w-screen h-[20vh] bg-slate-900/10 flex justify-center items-center flex-nowrap'}>

                <div className={'gap-16 flex flex-nowrap gap-4 justify-center items-center'}>
                    {links.map((x) => {
                        return (
                            <Link {...x}/>
                        )
                    })}
                </div>
            </div>



        </div>
    )
}