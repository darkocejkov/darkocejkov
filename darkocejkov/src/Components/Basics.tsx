import React, {
    Dispatch,
    MouseEventHandler,
    PointerEventHandler,
    Suspense,
    useEffect, useLayoutEffect,
    useMemo,
    useRef,
    useState
} from 'react'
import {
    useInView,
    motion,
    useScroll,
    useDragControls,
    useMotionValueEvent,
    useTransform,
    useMotionValue, useSpring, useAnimationFrame, MotionValue
} from "framer-motion";
import {byteSized, getFileInfo, humanFileSize, mimeType} from "../GlobalFunctions";
import {useDragScroll} from "../Hooks/CustomHooks";
import {useControls} from "leva";
import {ReactChild, FileInformation, Placements} from "../types.ts";
import {random, writeClipboard} from "../helpers.ts";
import {colors} from "../theme.ts";
import {Tooltip as TT} from "antd";
import {useToast} from "../Hooks/Toast.tsx";


const ControlsStats = () => {

    const {} = useControls('Metadata', {
        showLighting: true,
        showStats: true
    })

    return null

}

export const SketchControls = ({}) => {

    const {name, aNumber} = useControls({name: 'World', aNumber: 0})

    return (
        <>
            <ControlsStats/>
        </>
    )
}


export const LoadingSpinner = ({}) => {
    return(
        <div className={'h-screen w-screen flex items-center justify-center'}>
            <i className="fa-solid fa-spinner-third fa-spin"></i>
        </div>
    )
}

export const Spinner = () => {
    return(
        <i className="fa-solid fa-spinner-third fa-spin"></i>
    )
}

export const TextBox = ({children, className = ''}: {
    children: ReactChild,
    className?: string
}) => {
    return (
        <p className={`bg-slate-900/10 max-h-[50vh] overflow-y-auto p-4 rounded-tl-xl rounded-bl-xl ${className}`}>
            {children}
        </p>
    )
}

export const DragPane = ({children, className, id, subtle = false}: {
    children: ReactChild,
    id: string,
    className?: string,
    subtle?: boolean
}) => {

    let translateY = random(subtle ? 10 : 50, true)
    let rotateZ = random(subtle ? 3 : 15, true)

    const constraintRef = useRef(null)

    return (

        <>
            <div ref={constraintRef} className={'fixed top-0 left-0 h-screen w-screen'}/>
            <motion.div id={id}
                        drag
                        dragElastic={0.15}
                        whileDrag={{
                            backgroundColor: 'rgba(7, 89, 133, 0.09)',
                            scale: 1.05
                        }}
                        dragConstraints={constraintRef}
                        initial={{
                            opacity: 0,
                            translateY: translateY,
                            rotateZ: rotateZ
                        }}
                        animate={{
                            opacity: 1,
                            translateY: 0,
                            rotateZ: 0,
                            // transitionDelay: '0.1s'
                        }}
                        transition={{
                            type: 'spring',
                            mass: 2,
                        }}
                        className={`select-none info-box p-5 relative md:max-w-[80%] z-10 origin-center max-w-full rounded-lg shadow-lg ${className}`}>
                {children}
            </motion.div>
        </>
    )
}

export const Pane = ({children, className, id, subtle = false}: {
    children: ReactChild,
    id: string,
    className?: string,
    subtle?: boolean
}) => {

    let translateY = random(subtle ? 10 : 50, true)
    let rotateZ = random(subtle ? 3 : 15, true)

    return (
        <motion.div id={id}
                    initial={{
                        opacity: 0,
                        translateY: translateY,
                        rotateZ: rotateZ
                    }}
                    animate={{
                        opacity: 1,
                        translateY: 0,
                        rotateZ: 0,
                        // transitionDelay: '0.1s'
                    }}
                    transition={{
                        type: 'spring',
                        mass: 2,
                    }}
                    className={`info-box p-5 relative md:max-w-[80%] z-10 origin-center max-w-full rounded-lg shadow-lg ${className}`}>
            {children}
        </motion.div>
    )
}

export const InfoBox = ({id, children, classes = '', sceneRef}: {
    id: string,
    children: JSX.Element,
    classes?: string,
    sceneRef?: Object
}) => {

    const ref = useRef<HTMLDivElement>(null)
    const inView = useInView(ref)

    const [viewToggle, setViewToggle] = useState(false)

    useEffect(() => {
        console.log(`${id} = ${inView} (${viewToggle})`)
        if (inView && !viewToggle) setViewToggle(true)
    }, [inView])

    // const {scrollYProgress} = useScroll({
    //     target: ref,
    //     offset: ["end end", "start start"]
    // })

    const dragControls = useDragControls()

    function startDrag(event: PointerEvent) {
        console.log(event)
        dragControls.start(event, {snapToCursor: true})
    }

    return(
        <motion.div ref={ref} id={id}
                // drag
                dragElastic={0.15}
                    whileDrag={{
                        backgroundColor: 'rgba(7, 89, 133, 0.1)'
                        // backgroundColor: 'rgba(255,255,255,0.1)'
                        // className: `bg-slate-900/30`
                        // scale: 1.05
                    }}
                    dragControls={dragControls}
                // dragListener={false}
                    // dragConstraints={sceneRef}
                dragConstraints={{
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0
                }}
                animate={{
                    opacity: inView || viewToggle ? 1 : 0,
                    translateX: inView || viewToggle ? '0px' : '-100px',
                    rotateZ: inView || viewToggle ? '0deg' : '12deg',
                    // transitionDelay: '0.1s'
                }}
                style={{
                    // transform: inView || viewToggle ? "none" : "translateX(-200px) rotate3d(1,1,1, 12deg)",
                    filter: inView || viewToggle ? 'blur(0px)' : 'blur(5px)',
                }}
                transition={{
                    type: 'spring',
                    mass: 2,
                }}
                className={`info-box p-5 relative md:max-w-[80%] origin-center max-w-full rounded-lg shadow-lg ${classes}`}>
            {children}


            <div className={'absolute right-1 top-0 p-2'} onPointerDown={startDrag}>
                <i className="fa-solid fa-grip-dots"></i>
            </div>
        </motion.div>

    )
}


export const BoxCarousel = ({children, className, id, progressColor = 'bg-slate-900'}: {
    children: ReactChild,
    className?: string,
    id: string,
    progressColor?: string,
}) => {

    const carouselRef = useRef<HTMLDivElement>(null)

    const scrollLeft = (n = -150) => {
        if (carouselRef.current) {
            console.log('scrollLEft')
            carouselRef.current.scrollBy({
                left: n,
                behavior: 'smooth'
            })
        }
    }

    const scrollRight = (n = 150) => {
        if (carouselRef.current) {
            console.log('scrollRight')
            carouselRef.current.scrollBy({
                left: n,
                behavior: 'smooth'
            })
        }
    }

    const {scrollXProgress, scrollX} = useScroll({container: carouselRef})

    const [showL, setShowL] = useState(false)
    const [showR, setShowR] = useState(true)

    useMotionValueEvent(scrollXProgress, 'change', (latest) => {
        // console.log(`[scrollXProgress] ${id}`, latest)

        if (latest >= 1) {
            setShowR(false)
        } else if (!showR) {
            setShowR(true)
        }

        if (latest === 0) {
            setShowL(false)
        } else if (!showL) {
            setShowL(true)
        }

    })

    // useLayoutEffect(() => {
    //     let elem = carouselRef.current
    //     if (!elem) return
    //
    //     let maxScrollLeft = elem.scrollWidth - elem.clientWidth
    //
    //     console.log(`[carousel] ${id} hasScroll: `, maxScrollLeft)
    //     if (maxScrollLeft <= 0) {
    //         setShowR(false)
    //         setShowL(false)
    //     }
    // }, [])

    const {mouseDownHandler, hasScroll} = useDragScroll({container: carouselRef, id})

    useEffect(() => {
        // console.log(`[carousel] ${id} hasScroll: `, hasScroll)

        if (hasScroll === false) {
            setShowL(false)
            setShowR(false)
        }
    }, [hasScroll])

    const timerRef = useRef<any>()

    const handlePointerDown = (n: number) => {
        timerRef.current = setInterval(() => {

            carouselRef.current?.scrollBy({
                left: n,
                behavior: 'smooth'
            })
        }, 50)
    }
    const handlePointerUp = () => {
        clearInterval(timerRef.current)
    }


    return (

        <div className={`flex select-none flex-nowrap justify-center gap-1 relative ${className ? className : ''}`}>

            <motion.div
                animate={{
                    opacity: (!showL && !showR) ? 0 : 1,
                }}
                className={`absolute ${progressColor} -top-[5px] rounded-sm gr left-0 w-full h-[2px]`}
                style={{
                    scaleX: scrollXProgress
                }}
            />


            {/*absolute left-0 bottom-0*/}
            <motion.button
                animate={{
                    opacity: showL ? 1 : 0,
                    translateX: showL ? '0%' : '-20%',
                }}
                transition={{type: 'spring'}}
                className={`bg-slate-900/20 p-2 rounded-xl`}
                onClick={() => scrollLeft(-9999)}
            >
                <i className="fa-solid fa-chevrons-left fa-sm "></i>
            </motion.button>
            <motion.button
                animate={{
                    opacity: showL ? 1 : 0,
                    translateX: showL ? '0%' : '-20%',
                }}
                transition={{type: 'spring'}}
                className={`bg-slate-900/20 p-2 rounded-xl`}
                // onClick={() => scrollLeft()}
                onPointerDown={() => handlePointerDown(-25)}
                onPointerUp={handlePointerUp}
                onMouseLeave={handlePointerUp}
            >

                <i className="fa-solid fa-chevron-left fa-sm"></i>
            </motion.button>


            <motion.div
                // animate={{
                //     borderRadius:  showL === false || showR === false ? '10%' : '20%'
                // }}
                onMouseDown={mouseDownHandler} id={id} ref={carouselRef}
                className={'rounded-xl scrollbar-none flex overflow-x-auto flex-nowrap gap-2'}>
                {children}
            </motion.div>

            {/*absolute right-0 bottom-0*/}
            {/*{scrollXProgress < 1 &&*/}
            <motion.button
                animate={{
                    opacity: showR ? 1 : 0,
                    translateX: showR ? '0%' : '20%',
                }}
                transition={{type: 'spring'}}
                className={`bg-slate-900/20 p-2 rounded-xl`}
                // onClick={() => scrollRight()}
                onPointerDown={() => handlePointerDown(25)}
                onPointerUp={handlePointerUp}
                onMouseLeave={handlePointerUp}
            >
                <i className="fa-solid fa-chevron-right fa-sm"></i>
            </motion.button>

            <motion.button
                animate={{
                    opacity: showR ? 1 : 0,
                    translateX: showR ? '0%' : '20%',
                }}
                transition={{type: 'spring'}}
                className={`bg-slate-900/20 p-2 rounded-xl`}
                onClick={() => scrollRight(9999)}
            >
                <i className="fa-solid fa-chevrons-right fa-sm"></i>
            </motion.button>
            {/*}*/}


        </div>


    )
}

export const Chip = ({children, className = '', description = ''}: {
    children: ReactChild,
    className?: string,
    description?: string
}) => {

    return (
        <TooltipWrapper tooltip={description}>
            <div
                className={`flex flex-col h-full items-center justify-center bg-slate-700/10 md:px-2 px-1 py-1 rounded-xl ${className}`}>
                {children}
            </div>
        </TooltipWrapper>

    )

}

export const CardBox = ({children, className}: {
    children: ReactChild,
    className?: string
}) => {

    return (
        <motion.div
            animate={{
                opacity: [0, 1],
            }}
            className={`flex gap-4 h-full items-center justify-center bg-slate-700/10 md:py-2 py-1 px-4 rounded-xl ${className ? className : ''}`}
        >
            {children}
        </motion.div>
    )

}

export const StatBox = ({title, stat, children, className}: {
    title?: string,
    stat?: string,
    children?: ReactChild,
    className?: string
}) => {

    return (
        <motion.div
            animate={{
                opacity: [0, 1],
            }}
            className={`flex flex-col h-full items-center bg-slate-700/10 p-2 rounded-xl ${className ? className : ''}`}
        >
            {children}
            {title &&
                <h4 className={'font-bold md:text-xl md:whitespace-nowrap text-sm overflow-y-auto text-center'}>{title}</h4>
            }
            {stat &&
                <p className={'italic'}>{stat}</p>
            }
        </motion.div>
    )
}

const isExternalLink = (url: string) => {
    const tmp = document.createElement('a');
    tmp.href = url;
    return tmp.host !== window.location.host;
};

export const Link = ({url, children, className}: {
    url?: string,
    children?: ReactChild,
    className?: string
}) => {

    return (
        <a target={"_blank"}
           className={`hover:underline z-20  ${className ? className : 'text-xl font-rubik normal-case'}`} href={url}>
            {children
                ? (children)
                : (url?.split('/')[2])}
            {url && isExternalLink(url) &&
                <i className="fa-solid fa-square-arrow-up-right ml-2"></i>
            }
        </a>
    )
}

type ClipboardProps = {
    onClick: () => void,
    text: string,
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

export const CustomLink = ({label, clipboard, url, children, className = 'text-xl font-rubik normal-case'}: {
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
            className={`cursor-pointer relative p-4 rounded-sm link-background bg-gradient-to-b from-amber-400 to-amber-400 z-20 flex flex-col gap-1 ${className}`}
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

export const CustomButton = ({onClick, children, className}: {
    onClick: () => void,
    children: ReactChild,
    className?: string
}) => {

    // link-background
    return (
        <button type={'button'} onClick={onClick}
                className={`p-2 flex link-background-to-r rounded-sm bg-gradient-to-r from-amber-400 to-amber-400 z-20  ${className ? className : 'text-xl font-rubik normal-case'}`}>
            {children}
        </button>
    )
}


export const BorderDiv = ({children, className = ''}: {
    children: ReactChild,
    className?: string
}) => {
    return (
        <div className={`flex link-background-to-r bg-gradient-to-r from-amber-400 ${className} to-amber-400 z-20`}>
            {children}
        </div>
    )
}


export const Label = ({label, down, disabled = false, placement = 'TOP'}: {
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

    return (
        <motion.span
            initial={{
                backgroundColor: colors.slate
            }}
            animate={{
                backgroundColor: down ? colorFrames : colors.slate
            }}
            transition={{
                type: 'just',
            }}
            className={`w-full pointer-events-none z-10 tracking-tighter drop-shadow-2xl font-rubik text-white lowercase backdrop-blur-lg whitespace-nowrap py-1 px-4 text-xl overflow-hidden group-hover:opacity-100 opacity-0 absolute ${position} transition-all`}>
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

export const IconButton = ({
                               label,
                               onClick,
                               children,
                               disabled = false,
                               placement = 'TOP',
                               holdEvents = false
                           }: {
    label: string,
    onClick?: () => void,
    children: ReactChild,
    disabled?: boolean,
    placement?: Placements
    holdEvents?: boolean
}) => {

    const [down, setDown] = useState(false)

    const handlePointerDown = () => {
        setDown(true)
    }

    const handlePointerUp = () => {
        setDown(false)
    }

    return (
        <button disabled={disabled} onClick={onClick} onPointerDown={handlePointerDown} onPointerUp={handlePointerUp}
                className={`bg-transparent hover:bg-slate-600/10 p-3 rounded-md group transition-all`}>
            {children}

            <Label down={down} disabled={disabled} label={label} placement={placement}/>
        </button>
    )
}

export const ControlButton = ({
                                  label,
                                  hidden = false,
                                  onClick,
                                  children,
                                  disabled = false,
                                  placement = 'TOP',
                                  holdEvents = false,
                                  onHover
                              }: {
    label: string,
    hidden?: boolean,
    onClick?: () => void,
    children: ReactChild,
    disabled?: boolean,
    placement?: Placements
    holdEvents?: boolean
    onHover?: (b: boolean) => void
}) => {

    const [down, setDown] = useState(false)

    const handlePointerDown = () => {
        setDown(true)
    }

    const handlePointerUp = () => {
        setDown(false)
    }


    return (
        <button disabled={disabled}
                onMouseEnter={() => onHover ? onHover(true) : null}
                onMouseLeave={() => onHover ? onHover(false) : null}
                onClick={onClick}
                onPointerDown={handlePointerDown} onPointerUp={handlePointerUp}
                className={`${hidden ? 'hidden' : 'visible'} bg-transparent hover:bg-slate-600/10 p-3 rounded-md group transition-all`}>
            {children}

            <Label down={down} disabled={disabled} label={label} placement={placement}/>
        </button>
    )
}


const colorMap = [
    'text-slate-900',
    'text-orange-50',
    // 'text-orange-500',
    // 'text-lime-500',
    // 'text-sky-600',
    // 'text-blue-600',
    // 'text-rose-500',
]

const angle = Math.random()*Math.PI*2;

const TitleText = ({total, i, x, y, active, setActive, spread}: {
    total: number,
    i: number,
    x: MotionValue,
    y: MotionValue,
    active: number,
    setActive: Dispatch<number>,
    spread: number,

}) => {

    const d = total - (i * total)

    const springConfig = {
        // stiffness: Math.max(700 - d * 120, 0),
        // damping: (20 + (i * -2)),
        mass: Number((1 + (i * (1 / total))).toFixed(2)),
        // mass: x,
    };

    const dx = useSpring(x, springConfig)
    // const dx = useSpring(x)
    const dy = useSpring(y, springConfig)
    // const dy = useSpring(y)

    const ref = useRef<HTMLDivElement>(null)

    var angle = 0
    const r = 250

    // useAnimationFrame((time, delta) => {
    //     if(active) return
    //
    //     console.log(`theta ${angle} x ${Math.cos(angle)*r} y ${Math.sin(angle)*r}`)
    //
    //     x.set(Math.cos(angle)*r)
    //     y.set(Math.sin(angle)*r)
    //
    //     angle += 1/360
    // })

    return(
        <motion.div
            ref={ref}
            drag
            dragElastic={1}
            dragConstraints={{
                left: 0,
                top: 0,
                right: 0,
                bottom: 0
            }}
            dragTransition={{bounceStiffness: 500, bounceDamping: 20, mass: 1}}
            onDragStart={() => setActive(1)}
            style={{
                scale: `${(1 - (i * (1 / spread))).toFixed(2)}`,
                opacity: (1 - (i * (1 / spread))).toFixed(2),
                // filter: `blur(${((i * (1/10))).toFixed(2)}px)`,
                zIndex: total - i,
                x: active === i ? x : dx,
                y: active === i ? y : dy,
            }}
            className={`absolute inset-1/2 flex flex-col justify-center items-center gap-0 ${colorMap[i] || colorMap[colorMap.length - 1]}`}>

            <motion.h1
                initial={{
                    scale: Math.random() * 2,
                    rotateZ: Math.random() * 10,
                    rotateX: Math.random() * 15,
                }}
                animate={{
                    scale: 1,
                    rotateZ: 0,
                    rotateX: 10,
                }}
                transition={{
                    type: 'spring',
                    // bounce: .25,
                    // damping: 2,
                }}
                className={'md:text-9xl text-5xl font-tabi font-bold'}>Darko Cejkov</motion.h1>
            <motion.h2
                initial={{
                    scale: Math.random() * 2,
                    rotateZ: Math.random() * -4,
                    rotateX: Math.random() * 13,
                }}
                animate={{
                    scale: 1,
                    rotateZ: 0,
                    rotateX: 0,
                }}
                transition={{
                    type: 'spring',
                    // bounce: .25,
                    // damping: 2,
                }}
                className={'text-4xl font-tabi mt-3'}>Fullstack Developer
            </motion.h2>

            {/*{children}*/}
        </motion.div>
    )
}

export const DepthText = ({n, spread = n}: { n: number, spread: number }) => {

    const springConfig = {
        // stiffness: Math.max(700 - d * 120, 0),
        // damping: (20 + (i * -2)),
        mass: 2,
        // mass: x,
    };

    const xx = useSpring(useMotionValue(0), springConfig)
    const yy = useSpring(useMotionValue(0), springConfig)

    const [active, setActive] = useState<number>(0)

    const textArray = useMemo(() => {


        let array = []

        for (let x = 0; x < n; x++) {

            array.push(
                <TitleText x={xx} y={yy} total={n} i={x} setActive={setActive} spread={spread} active={active}/>
            )
        }

        return array
    }, [n])

    return(
        <div className={'w-2/3 z-0 text-center relative flex flex-col justify-center items-center gap-0'}>
            {textArray}
        </div>
    )
}

export const MenuWrapper = ({children, items = [], open = false}: {
    children: ReactChild,
    items?: FileInformation[],
    open?: boolean

}) => {

    const [show, setShow] = useState(false)

    // useEffect(() => {
    //     console.log(items)
    // }, [])

    return (
        <div className={'relative'} onClick={() => setShow(!show)} onMouseLeave={() => setShow(false)}>

            {children}

            <div
                className={`${show ? 'scale-1' : 'scale-0'} backdrop-blur-md origin-bottom left-0 -top-full transition-all absolute rounded-xl p-2 bg-slate-900/40 text-white`}>
                <div className={'flex flex-col gap-2'}>
                    {items && items.map((x, i) => {
                        return (
                            <>
                                <MenuItem {...x}/>

                                {i !== items.length - 1 &&
                                    <hr/>
                                }
                            </>
                        )
                    })}
                </div>

            </div>
        </div>
    )
}

const MenuItem = ({label, onClick, file}: {
    label: string,
    onClick?: () => void,
    file: File,
}) => {

    const [info, setInfo] = useState<FileInformation | null>(null)

    useEffect(() => {
        getFileInfo(file)
            .then((data: FileInformation) => {
                setInfo(data)
                return
            })
    }, [])

    return (
        <button type={'button'} onClick={() => onClick ? onClick() : null} className={'p-1 rounded-sm '}>
            {label}

            {info &&
                <code className={'mx-1'}>
                    ({humanFileSize(info.size, true, 2)})
                </code>
            }

            {info &&
                <code className={'mx-1'}>
                    ({mimeType(info.type)})
                </code>
            }

        </button>
    )

}

export const LoadBar = ({progress}: {
    progress: number
}) => {
    return (
        <motion.div
            initial={{
                width: '0vw'
            }}
            animate={{
                width: `${progress}vw`
            }}
            transition={{
                ease: 'easeOut'
            }}
            className={'fixed top-0 left-0 h-[5px] bg-blue-400/50 rounded-br-xl z-[100]'}/>
    )
}

export const CTAButton = ({label, icon = 'fa-arrow-right'}: {
    label: string,
    icon?: string
}) => {

    const [hover, setHover] = useState(false)

    return (
        <button
            type={'submit'}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            className={'font-rubik group cursor-pointer bg-slate-900/10 p-3 button-shadow rounded-lg justify-center transition-all active:bg-slate-900/20 flex gap-3'}>
            <p>{label}</p>
            <motion.i
                initial={{
                    translateX: '0%'
                }}
                animate={{
                    translateX: hover ? '150%' : '0%'
                }}
                className={`fa-regular ${icon} group-hover:text-slate-100 self-center fa-xl transition-colors`}></motion.i>
        </button>
    )
}

export const Rule = () => (
    <div className={`lg:flex-1 w-full h-[1px] bg-slate-900 self-center`}/>
)

export const TitleRule = ({children, classes, ruleClass}: {
    children: ReactChild,
    classes?: string,
    ruleClass?: string
}) => {

    return (
        <h3 className={`${classes} lg:whitespace-nowrap flex lg:flex-row flex-wrap flex-col gap-3 justify-between`}>
            {children}
            <div className={`lg:flex-1 w-full h-[1px] bg-slate-900 self-center ${ruleClass}`}/>
        </h3>
    )
}

export const SubtitleRule = ({children, classes, ruleClass, textPos = 'left'}: {
    children: ReactChild,
    classes?: string,
    ruleClass?: string
    textPos?: string
}) => {

    return (
        <h3 className={`${classes} lg:whitespace-nowrap flex lg:flex-row flex-wrap flex-col gap-3 justify-between`}>


            {(textPos === 'center' || textPos === 'right') &&
                <div className={`lg:flex-1 w-full h-[1px] bg-slate-900 self-center ${ruleClass}`}/>
            }
            {children}
            {(textPos === 'center' || textPos === 'left') &&
                <div className={`lg:flex-1 w-full h-[1px] bg-slate-900 self-center ${ruleClass}`}/>

            }
        </h3>
    )
}


export const Tooltip = ({children}: { children: ReactChild }) => {

    return (
        <div className={'group relative '}>
            <i className="fa-solid fa-circle-info ml-2"></i>
            <div
                className={'bg-slate-900/80 overflow-hidden text-white p-1 absolute -top-[150%] px-3 group-hover:scale-100 scale-0 rounded-tl-3xl rounded-tr-3xl group-hover:rounded-tl-none group-hover:rounded-tr-none origin-bottom transition-all'}>
                {children}
            </div>
        </div>
    )
}

export const GlobalTooltipWrapper = ({children, className = '', tooltip, fit = false, position = 'tm'}: {
    children: ReactChild,
    tooltip?: JSX.Element | string,
    fit?: boolean,
    position?: string,
    className?: string
}) => {

    return (
        <div className={`group ${className}`}>

            {children}

            {tooltip &&
                <div
                    className={`max-w-[150px] z-[100] overscroll-contain bg-slate-900/60 -translate-x-1/2 backdrop-blur-md overflow-y-auto max-h-[150px] text-white px-3 origin-center group-hover:scale-100 scale-0 rounded-md transition-all absolute left-0 whitespace-normal`}>
                    <div className={'mb-0'}>
                        {tooltip}
                    </div>
                </div>
            }

        </div>
    )

}

export const TooltipWrapper = ({children, className = '', tooltip, fit = false, position = 'tm'}: {
    children: ReactChild,
    tooltip?: JSX.Element | string,
    fit?: boolean,
    position?: string,
    className?: string
}) => {

    let positionClass = null

    if (position === 'tm') {
        positionClass = '-translate-x-1/2 bottom-[110%] left-1/2 origin-bottom'
    } else if (position === 'tl') {
        positionClass = 'bottom-[110%] left-0 origin-bottom-left'
    } else if (position === 'absolute') {
        positionClass = ''
    }

    return (
        <div className={`group relative backdrop-blur-lg  ${className}`}>

            {children}

            {tooltip &&
                <div
                    className={`bg-slate-900/60 ${positionClass} overscroll-contain overflow-y-auto max-h-[150px] ${fit ? 'w-auto' : 'w-full'} text-white p-1 absolute px-3 group-hover:scale-100 scale-0 rounded-tl-3xl rounded-tr-3xl group-hover:rounded-tl-none group-hover:rounded-tr-none transition-all`}>
                    <div className={'mb-0'}>
                        {tooltip}
                    </div>
                </div>
            }

        </div>
    )

}