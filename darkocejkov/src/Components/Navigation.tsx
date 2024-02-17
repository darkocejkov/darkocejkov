import React, {useContext, useEffect, useLayoutEffect, useState} from "react";
import {Link, useLocation} from 'react-router-dom'

import {ClipboardProps, NavRoute, Placements, ReactChild} from "../types.ts";


import {motion} from "framer-motion";

import {IconContext} from "react-icons";
import {colors} from "../theme.ts";
import {useToast} from "../Hooks/Toast.tsx";
import {isExternalLink, px2vh, random, writeClipboard} from "../helpers.ts";
import {HamburgerMenu} from "./Icons";
import {LocationContext} from "../Contexts/Location";
import Marquee from "react-fast-marquee";
import {MenuContext} from "../Contexts/Menu";

export default function Navigation({routes}: { routes: NavRoute[] }) {

    const [childHovering, setChildHovering] = useState(false)

    let rounding = 'rounded-t-sm rounded-b-xl'
    if (childHovering) {
        rounding = 'rounded-none'
    }

    return (
        <nav
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
        </nav>
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

export const PaneBar = ({children, routes}: {
    children: ReactChild,
    routes?: NavRoute[]
}) => {

    const variants = {
        open: {
            height: '90vh',
        },
        closed: {
            height: '3rem',
            minHeight: '3rem',
        },
        exit: {
            translateY: '-100%'
        }
    }

    const {state: menuOpen, setState: setMenuOpen} = useContext(MenuContext)

    // const [menuOpen, setMenuOpen] = useState(false)

    const location = useContext(LocationContext)

    useLayoutEffect(() => {
        setMenuOpen(false)
    }, [location])

    useLayoutEffect(() => {

        const handleResize = (e: UIEvent) => {

            let {innerHeight, innerWidth} = e.srcElement as Window

            console.log('[NAVIGATION] RESIZE: ', innerWidth)
            if (innerWidth < 640 && menuOpen) {
                setMenuOpen(false)
            }
        }

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    return (
        <>

            <motion.div
                className={'!hidden sm:!block transition-all bg-slate-900/10 backdrop-blur-sm shadow-lg p-3  opacity-60 hover:opacity-100 hover:bg-white/90  pointer-events-auto'}>
                <div className={'flex gap-3 hover:gap-4 justify-evenly transition-all font-aeonik tracking-tighter'}>
                    <IconContext.Provider value={{className: 'sm:text-2xl text-sm'}}>
                        {children}
                    </IconContext.Provider>
                </div>
            </motion.div>


            <motion.div
                variants={variants}
                animate={menuOpen ? 'open' : 'closed'}
                className={`!block sm:!hidden min-h-12 transition-colors w-screen backdrop-blur-sm shadow-lg ${menuOpen ? 'bg-white/90' : 'bg-white/20'} pointer-events-auto overflow-hidden`}
            >
                <div className={'fixed top-0 right-0 flex relative justify-between items-center'}>

                    <section className={'max-w-[80vw] max-h-12 flex flex-row gap-2 items-center justify-center'}>
                        <IconContext.Provider value={{size: '2.5rem'}}>
                            {location?.icon}
                        </IconContext.Provider>

                        <Marquee
                            className={'text-[2.5rem] border-2 border-slate-900 uppercase font-tabi h-10 rounded-full text-center overflow-hidden'}>
                            <span className={'mx-3 self-center'}>
                                {location?.label}
                            </span>
                        </Marquee>

                        {/*<span className={'text-3xl self-center font-nineties truncate'}>*/}
                        {/*    {location?.label}*/}
                        {/*</span>*/}
                        {/*<Marquee gradient={false} className={'font-kiosk flex-1'} autoFill={true}>*/}
                        {/*    {location?.label}*/}
                        {/*</Marquee>*/}
                    </section>

                    <button
                        className={` bg-slate-900/10 ${menuOpen ? 'rounded-full' : ''} transition-all`}
                        onClick={() => setMenuOpen(!menuOpen)}>
                        <HamburgerMenu open={menuOpen}/>
                    </button>
                </div>
                <div className={'flex flex-col items-start justify-center p-1 overflow-y-scroll'}>
                    <IconContext.Provider value={{className: 'text-2xl'}}>
                        {children}
                    </IconContext.Provider>
                </div>
            </motion.div>
        </>
    )
}

export const TopNav = ({routes}: {
    routes: NavRoute[],
}) => {


    return (
        <FixedBar placement={'TOP'}>
            <PaneBar>


                {routes.map(route => {

                    if (route.includeInNav === false) return

                    return (
                        <Link key={route.path} to={route.path} className={`w-full sm:w-fit`}>
                            <NavButton label={route.label || route.path} placement={"BOTTOM"}
                                       icon={route.icon} path={route.path}
                                       description={route.description}>
                                {route.icon || route.path}
                            </NavButton>
                        </Link>
                    )
                })}

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

                className={`${hidden ? 'hidden' : 'visible'} hover:bg-slate-600/10 ${active} rounded-md group transition-all w-full sm:w-fit`}
        >

            <div className={'flex sm:flex-col justify-start sm:justify-center items-center relative overflow-hidden '}>

                <motion.span
                    className={`p-3 !hidden sm:!block`}
                    animate={{
                        translateY: hover ? '100%' : '0%',
                        opacity: hover ? 0 : 1
                    }}
                >
                    {icon}
                </motion.span>

                <motion.span
                    className={`p-3 sm:!hidden`}
                >
                    {icon}
                </motion.span>


                <motion.span
                    className={'!hidden sm:!block absolute w-full h-full top-0 left-0 text-3xl font-fira break-all uppercase text-justify leading-none font-bold '}
                    animate={{
                        translateY: hover ? '0%' : '100%',
                        opacity: hover ? 1 : 0
                    }}
                >
                    {description}
                </motion.span>

                <motion.span
                    className={'sm:!hidden text-3xl font-fira break-all uppercase text-justify leading-none font-bold '}
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
export const HoverLink = ({label, clipboard, url, children, className = 'text-xl font-rubik normal-case'}: {
    url?: string,
    clipboard?: ClipboardProps,
    onClick?: () => void,
    children: ReactChild,
    className?: string,
    label: string,
}) => {

    const [hover, setHover] = useState(false)

    const {addToast} = useToast()

    const copyToClip = (text: string) => {
        writeClipboard(text, () => addToast(`Copied: "${text}"`))
    }

    // link-background
    // hover:scale-125 hover:rotate-2
    return (
        <motion.a
            rel="noreferrer noopener"
            target={"_blank"}
            tabIndex={0}
            className={`cursor-pointer relative p-4 rounded-sm origin-center link-background bg-gradient-to-b from-amber-400 to-amber-400 z-20 flex flex-col gap-1 ${className}`}
            href={url}

            onClick={() => clipboard ? copyToClip(clipboard.text) : null}

            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            initial={{
                scale: 1,
                rotateX: '0deg'
            }}
            style={{
                scale: hover ? 1.25 : 1,
                rotateX: hover ? `${random(10, true, 0, false)}deg` : '0deg'
            }}

        >
            {children}
            {url && isExternalLink(url) &&
                <i className="absolute fa-solid top-3 right-1 fa-square-arrow-up-right ml-2 fa-xs"></i>
            }
            {clipboard &&
                <>
                    <i className="absolute fa-solid top-3 right-1 fa-copy ml-2 fa-xs"></i>
                </>
            }

            <motion.p
                className={'text-sm text-center'}>{label}</motion.p>

            {/*<motion.p*/}
            {/*    animate={{*/}
            {/*        opacity: hover ? 1 : 0*/}
            {/*    }}*/}
            {/*    className={'text-sm text-center'}>{label}</motion.p>*/}
        </motion.a>

    )
}
export const BasicLink = ({children, url}: {
    children: ReactChild,
    url: string,
}) => {
    return (
        <motion.a
            rel="noreferrer noopener"
            target={"_blank"}
            tabIndex={0}
            className={`link`}
            href={url}
        >
            {children}
            {url && isExternalLink(url) &&
                <i className="fa-regular fa-square-arrow-up-right fa-xs ml-2"></i>
            }

        </motion.a>
    )
}