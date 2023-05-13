import React, {useState} from "react";
import {Link, useLocation} from 'react-router-dom'

import {NavRoute, Placements, ReactChild} from "../types.ts";


import {motion} from "framer-motion";

import {IconContext} from "react-icons";
import {colors} from "../theme.ts";

export default function Navigation({routes}: { routes: NavRoute[] }) {

    const [childHovering, setChildHovering] = useState(false)

    let rounding = 'rounded-t-sm rounded-b-xl'
    if (childHovering) {
        rounding = 'rounded-none'
    }

    return (
        <div
            className={`z-50 select-none fixed inset-x-1/2 -translate-x-1/2  transition-all bg-slate-900/10 backdrop-blur-lg shadow-lg p-3 min-w-fit opacity-60 hover:opacity-100 ${rounding}`}>

            {/*-translate-y-1/2 hover:-translate-y-0*/}
            <div className={'flex gap-3 hover:gap-4 justify-evenly transition-all font-aeonik tracking-tighter'}>

                <IconContext.Provider value={{size: '1.5rem'}}>


                    {routes.map(route => {

                        if (route.includeInNav === false) return

                        return (
                            <Link key={route.path} to={route.path}>
                                <NavButton label={route.label || route.path} placement={"BOTTOM"}
                                           onHover={setChildHovering} icon={route.icon} path={route.path}
                                           description={route.description}>
                                    {route.icon || route.path}
                                </NavButton>
                            </Link>
                        )
                    })}
                </IconContext.Provider>
            </div>
        </div>
    )
}

export const FixedBar = ({placement = 'TOP', children}: {
    placement?: Placements,
    children: ReactChild
}) => {

    let position = ``

    switch (placement) {
        case "BOTTOM":
            position = 'fixed inset-x-1/2 -translate-x-1/2 w-screen flex justify-center items-center'
            break;
        case "LEFT":
            position = 'fixed inset-x-1/2 -translate-x-1/2 h-screen'
            break;
        case "RIGHT":
            position = 'fixed inset-x-1/2 -translate-x-1/2 h-screen'
            break;
        case "TOP":
            position = 'fixed inset-x-1/2 -translate-x-1/2 w-screen flex justify-center items-center'
            break;
    }

    //

    return (
        <div
            className={`z-50 select-none ${position} pointer-events-none`}>
            {children}
        </div>
    )
}

export const PaneBar = ({children}: {
    children: ReactChild
}) => {

    // const [childHovering, setChildHovering] = useState(false)
    //
    // let rounding = 'rounded-t-sm rounded-b-xl'
    // if (childHovering) {
    //     rounding = 'rounded-none'
    // }

    return (
        <div
            className={'transition-all bg-slate-900/10 backdrop-blur-sm shadow-lg p-3 max-w-fit opacity-60 hover:opacity-100 pointer-events-auto'}>
            <div className={'flex gap-3 hover:gap-4 justify-evenly transition-all font-aeonik tracking-tighter'}>
                {children}
            </div>
        </div>
    )
}

export const TopNav = ({routes}: {
    routes: NavRoute[]
}) => {
    return (
        <FixedBar placement={'TOP'}>
            <PaneBar>
                <IconContext.Provider value={{size: '1.5rem'}}>

                    {routes.map(route => {

                        if (route.includeInNav === false) return

                        return (
                            <Link key={route.path} to={route.path}>
                                <NavButton label={route.label || route.path} placement={"BOTTOM"}
                                           icon={route.icon} path={route.path}
                                           description={route.description}>
                                    {route.icon || route.path}
                                </NavButton>
                            </Link>
                        )
                    })}

                </IconContext.Provider>
            </PaneBar>
        </FixedBar>
    )
}

export const NavButton = ({
                              label,
                              hidden = false,
                              onClick,
                              children,
                              disabled = false,
                              placement = 'TOP',
                              holdEvents = false,
                              onHover,
                              icon,
                              path,
                              description = ''
                          }: {
    label: string,
    hidden?: boolean,
    onClick?: () => void,
    children: ReactChild,
    disabled?: boolean,
    placement?: Placements,
    holdEvents?: boolean,
    onHover?: (b: boolean) => void,
    icon?: ReactChild,
    path?: string,
    description?: string,
}) => {

    const location = useLocation()


    const active = location.pathname.toLowerCase() === path?.toLowerCase() ? 'bg-slate-900/20' : 'bg-transparent'

    const [down, setDown] = useState(false)

    const handlePointerDown = () => {
        setDown(true)
    }

    const handlePointerUp = () => {
        setDown(false)
    }

    const variants = {
        label: {},
        icon: {}
    }

    const [hover, setHover] = useState(false)

    const handleEnter = () => {
        if (onHover) onHover(true)
        setHover(true)
    }

    const handleLeave = () => {
        if (onHover) onHover(false)
        setHover(false)
    }

    const handleClick = () => {
        if (onClick) onClick()
    }

    return (
        <button disabled={disabled}

                onMouseEnter={handleEnter}
                onMouseLeave={handleLeave}

                onClick={handleClick}

                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}

                className={`${hidden ? 'hidden' : 'visible'} hover:bg-slate-600/10 ${active} rounded-md group transition-all`}
        >

            <div className={'flex flex-col justify-center items-center relative overflow-hidden'}>

                <motion.span
                    className={`p-3`}
                    animate={{
                        translateY: hover ? '100%' : '0%',
                        opacity: hover ? 0 : 1
                    }}
                >
                    {icon}
                </motion.span>

                <motion.span
                    className={'absolute w-full h-full top-0 left-0 text-3xl font-fira break-all uppercase text-justify leading-none font-bold '}
                    animate={{
                        translateY: hover ? '0%' : '100%',
                        opacity: hover ? 1 : 0
                    }}
                >
                    {description}
                </motion.span>

            </div>

            {/*<div className={'flex flex-col justify-center items-center'}>*/}
            {/*    */}
            {/*    <motion.span*/}
            {/*        animate={{*/}
            {/*            translateY: hover ? '100%' : '0%',*/}
            {/*            opacity: hover ? 0 : 1*/}
            {/*        }}*/}
            {/*    >*/}
            {/*        {icon}*/}
            {/*    </motion.span>*/}
            {/*    */}
            {/*    <motion.span*/}
            {/*        animate={{*/}
            {/*            translateY: hover ? '-100%' : '0%',*/}
            {/*            opacity: hover ? 1 : 0*/}
            {/*        }}*/}
            {/*    >*/}
            {/*        {path}*/}
            {/*    </motion.span>*/}

            {/*</div>*/}


            <Label down={down} disabled={disabled} label={label} placement={placement}/>
        </button>
    )
}

const Label = ({label, down, disabled = false, placement = 'TOP'}: {
    label: ReactChild,
    down?: boolean,
    disabled?: boolean,
    placement?: Placements
}) => {

    let position = ''

    switch (placement) {
        case "TOP":
            position = "left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:translate-y-0 bottom-[100%] origin-bottom rounded-t-xl rounded-b-md"
            break;
        case "BOTTOM":
            position = "left-1/2 -translate-x-1/2 translate-y-1/2 group-hover:translate-y-0 top-[100%] origin-top rounded-b-xl"
    }


    const colorFrames = [
        colors.slate,
        colors.orange,
    ]

    const [clicked, setClicked] = useState(false)

    return (
        <motion.span
            initial={{
                backgroundColor: colors.slate
            }}
            animate={{
                backgroundColor: down ? colorFrames : colors.slate
            }}
            // transition={{
            //     type: 'just',
            // }}
            className={`w-full pointer-events-none z-10 tracking-tighter drop-shadow-2xl font-rubik text-white lowercase whitespace-nowrap py-1 px-4 text-xl overflow-hidden group-hover:opacity-100 opacity-0 absolute ${position} transition-all`}>
            {/*bg-slate-900/80*/}
            <motion.i
                initial={{
                    opacity: 0,
                    translateX: 0,
                }}
                animate={{
                    opacity: down ? 1 : 0,
                    translateX: down ? [-0, -3, -6, -9, -20, -30, -50, -80, -120, -200] : 0,
                }}
                transition={{
                    type: 'spring'
                }}
                className="fa-solid fa-arrow-left mr-3 self-center"></motion.i>


            {label} {disabled && " (Disabled)"}

            <motion.i
                initial={{
                    opacity: 0,
                    translateX: 0
                }}
                animate={{
                    opacity: down ? 1 : 0,
                    translateX: down ? [0, 3, 6, 9, 20, 30, 50, 80, 120, 200] : 0
                }}
                transition={{
                    type: 'spring'
                }}
                className="fa-solid fa-arrow-right ml-3 self-center"></motion.i>

        </motion.span>
    )
}