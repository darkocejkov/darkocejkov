import React, {Suspense, useEffect, useRef, useState} from 'react'
import {useInView, motion, useScroll, useDragControls, useMotionValueEvent, useTransform} from "framer-motion";
import {byteSized, getFileInfo, humanFileSize, mimeType} from "../GlobalFunctions";
import {useDragScroll} from "../Hooks/CustomHooks";

export const TitleLetters = ({title}) => {

    let array = []

    return(



        title && title.map(x => {
            return(
                <span className={'hover:font-bold'}>
                    x
                </span>
            )
        })
    )

}
export const ScrollingText = ({children, text}) => {

    const [pause, setPause] = useState(false)

    const [translate, setTranslate] = useState('100%')

    const parentRef = useRef()

    const [textArray, setTextArray] = useState([])

    return(
        <div ref={parentRef} className={`w-fit whitespace-nowrap`}
            onMouseEnter={() => setPause(true)}
            onMouseLeave={() => setPause(false)}
        >

            <span>
                {text}
            </span>

            {/*<marquee>*/}
            {/*    {text}*/}
            {/*</marquee>*/}

            {/*<div className={'flex flex-row gap-5 scroll-text-l'}>*/}
            {/*    */}
            {/*</div>*/}

        </div>
    )
}

export const Banner = ({children, top = true}) => {

    if(top){
        return(
            <div className={'backdrop-blur-sm z-50 fixed top-0 inset-x-0 font-tabi p-2 bg-slate-900/70 text-white flex justify-center lg:items-center uppercase'}>
                {children}
            </div>
        )
    }

    return(
        <div className={'backdrop-blur-sm z-50 fixed bottom-0 inset-x-0 font-tabi p-2 bg-slate-900/70 text-white flex justify-center lg:items-center uppercase'}>
            {children}
        </div>
    )
}

export const LabelledButton = ({label, children, dir = 'right', active = false, onClick = () => null}) => {

    return(
        // ${view === 0 ? 'rounded-xl' : 'rounded-sm'}
        <button onClick={() => onClick()} className={`${active ? 'rounded-xl' : 'rounded-sm'} relative group flex items-center justify-center hover:rounded-3xl transition-rounded bg-slate-900 opacity-70 text-white md:h-10 md:w-10 h-5 w-5`}>
            {children}

            <span className={`font-tabi p-2 rounded-xl bg-slate-900/30 text-shadow absolute text-white ${dir}-0 group-hover:translate-x-[110%] scale-0 group-hover:scale-100 -translate-x-full transition-all`}>{label}</span>
        </button>

    )
}

export const FillLink = ({}) => {
    return(

        <Link className={'text-4xl font-rubik font-medium p-2 relative border-slate-900 border rounded-xl group overflow-hidden hover:text-white transition-all'} url={'https://www.linkedin.com/company/traction-on-demand'}>
            <div className={'z-20'}>
                GitHub
            </div>


            <div className={'absolute rounded-xl bg-slate-900/50 z-10 top-0 left-0 w-full h-full scale-x-0 group-hover:scale-x-100 origin-left transition-all'} />

        </Link>

    )
}

export const OffcanvasDrawer = ({show, setShow, children}) => {

    // const [show, setShow] = useState(false)

    const handleKeyDown = (e) => {
        console.log(e)
        if(e.key === "Escape"){
            setShow(false)
            window.removeEventListener("keyup", handleKeyDown)
        }
    }

    useEffect(() => {
        if(show){
            window.addEventListener("keyup", handleKeyDown)
        }
    }, [show])



    return(

        <>
            <motion.div
                animate={{
                    translateX: show ? '0' : '100%'
                    // width: show ? '100vw' : '0'
                }}
                transition={{
                    type: 'spring'
                }}


                className={`modal ${show ? 'show' : ''} z-[70] w-screen bg-gray-50 h-screen fixed right-0 top-0 lg:max-w-[50%]`}>

                {children}
            </motion.div>

            <motion.div
                animate={{
                    opacity: show ? 1 : 0,
                    zIndex: show ? 60 : 0
                }}

                onClick={() => setShow(false)}

                className={'modal-backdrop backdrop-blur-sm fixed top-0 left-0 h-screen w-screen bg-slate-900/60 overflow-hidden'}
            />
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

export const TextBox = ({children, className = ''}) => {
    return(
        <p className={`bg-slate-900/10 max-h-[50vh] overflow-y-auto p-4 rounded-tl-xl rounded-bl-xl ${className}`}>
            {children}
        </p>
    )
}

export const Accordion = ({className, children, data}) => {

    return(
        <div className={`bg-slate-900/10 rounded-2xl ${className}`}>
            {data && data.map((x, i) => {
                return(
                    <>
                        <div key={x.key}>
                            <div className={'text-3xl font-bold text-center p-3'}>{x.title}</div>
                        </div>

                        {i !== data.length - 1 &&
                            <div className={`w-full h-[1px] bg-slate-900/20 self-center`} />
                        }
                    </>

                )
            })}
        </div>
    )
}

export const Rule = ({className}) => {
    return (
        <div className={`w-full h-[1px] ${className} self-center`} />
    )
}

export const InfoBox = ({id, children, classes = '', sceneRef}) => {

    const ref = useRef()
    const inView = useInView(ref)

    // const {scrollYProgress} = useScroll({
    //     target: ref,
    //     offset: ["end end", "start start"]
    // })

    const dragControls = useDragControls()

    function startDrag(event) {
        console.log(event)
        dragControls.start(event, { snapToCursor: true })
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
                    opacity: inView ? 1 : 0,
                    translateX: inView ? '0px' : '-200px',
                    rotateZ: inView ? '0deg' : '12deg',
                    // transitionDelay: '0.1s'
                }}
                style={{
                    // transform: inView ? "none" : "translateX(-200px) rotate3d(1,1,1, 12deg)",
                    filter: inView ? 'blur(0px)' : 'blur(5px)',
                }}
                transition={{ type: 'spring' }}
                className={`info-box p-5 relative md:max-w-[80%] origin-center max-w-full rounded-lg shadow ${classes}`}>
            {children}


            <div className={'absolute right-1 top-0 p-2'} onPointerDown={startDrag}>
                <i className="fa-solid fa-grip-dots"></i>
            </div>
        </motion.div>

    )
}

export const BoxCarousel = ({children, className, id}) => {

    const carouselRef = useRef()

    const scrollLeft = () => {
        if(carouselRef.current){
            carouselRef.current.scrollBy({
                left: -150,
                behavior: 'smooth'
            })
        }
    }

    const scrollRight = () => {
        if(carouselRef.current){
            carouselRef.current.scrollBy({
                left: 150,
                behavior: 'smooth'
            })
        }
    }


    const {scrollXProgress, scrollX} = useScroll({container: carouselRef})

    const [showL, setShowL] = useState(false)
    const [showR, setShowR] = useState(true)

    useMotionValueEvent(scrollXProgress, 'change', (latest) => {
        // console.log(`[scrollXProgress]`, latest)



        if((latest >= 1 || (1 - latest <= 1/100)) && showR === true){
            setShowR(false)
        }else if(showR === false){
            setShowR(true)
        }

        if(latest === 0 && showL === true){
            setShowL(false)
        }else if(showL === false){
            setShowL(true)
        }

    })

    const {mouseDownHandler, hasScroll} = useDragScroll({container: carouselRef, id})

    useEffect(() => {
        // console.log(`[carousel] ${id} hasScroll: `, hasScroll)

        if(hasScroll === false){
            setShowL(false)
            setShowR(false)
        }
    }, [hasScroll])

    return(

            <div className={`flex flex-nowrap justify-center gap-3 relative ${className ? className : ''}`}>

                <motion.div
                    animate={{
                        opacity: hasScroll === false ? 0 : 1,
                    }}
                    className={'absolute alien-gradient -top-[5px] rounded-sm gr left-0 w-full h-[2px]'}
                    style={{
                        scaleX: scrollXProgress
                    }}
                />


                {/*absolute left-0 bottom-0*/}
                <motion.button
                    animate={{
                        opacity: showL === true ? 1 : 0,
                        translateX: showL === true ? '0%' : '-20%'
                    }}
                    transition={{ type: 'spring' }}
                    className={`bg-slate-900/20 p-2 rounded-full`}
                    onClick={() => scrollLeft()}>
                    <i className="fa-solid fa-chevron-left "></i>
                </motion.button>

                <motion.div
                    // animate={{
                    //     borderRadius:  showL === false || showR === false ? '10%' : '20%'
                    // }}
                    onMouseDown={mouseDownHandler} id={id} ref={carouselRef} className={'rounded-xl scrollbar-none flex overflow-x-auto flex-nowrap gap-2'}>
                    {children}
                </motion.div>

                {/*absolute right-0 bottom-0*/}
                {/*{scrollXProgress < 1 &&*/}
                    <motion.button
                        animate={{
                            opacity: showR === true ? 1 : 0,
                            translateX: showR === true ? '0%' : '20%'
                        }}
                        transition={{ type: 'spring' }}
                        className={`bg-slate-900/20 p-2 rounded-full`} onClick={() => scrollRight()}>
                        <i className="fa-solid fa-chevron-right"></i>
                    </motion.button>
                {/*}*/}



            </div>


    )
}

export const CardBox = ({children, className}) => {

    return(
        <motion.div
            animate={{
                opacity: [0, 1],
            }}
            className={`flex flex-col h-full items-center justify-center bg-slate-700/10 md:p-2 p-1 rounded-xl ${className ? className : ''}`}
        >
            {children}
        </motion.div>
    )

}

export const StatBox = ({title, stat, children, className}) => {

    return(
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

const isExternalLink = (url) => {
    const tmp = document.createElement('a');
    tmp.href = url;
    return tmp.host !== window.location.host;
};

export const Link = ({url, children, className}) => {

    return(
        <a target={"_blank"} className={`hover:underline z-20  ${className ? className : 'text-xl font-rubik normal-case'}`} href={url}>
            {children
                ? (children)
                : (url?.split('/')[2])}
            {isExternalLink(url) &&
                <i className="fa-solid fa-square-arrow-up-right ml-2"></i>
            }
        </a>
    )
}

export const CustomLink = ({url, children, className}) => {

    // link-background
    return(
        <a target={"_blank"} tabIndex={0} className={`p-2 hover:scale-125 hover:rotate-2  rounded-sm link-background bg-gradient-to-b from-amber-400 to-amber-400 z-20  ${className ? className : 'text-xl font-rubik normal-case'}`} href={url}>
            {children}
            {isExternalLink(url) &&
                <i className="fa-solid fa-square-arrow-up-right ml-2 fa-xs"></i>
            }
        </a>
    )
}

export const FunLink = ({url, className}) => {
    return(
        <a href={url} className={`p-2 flex link-background-to-r rounded-sm bg-gradient-to-r from-amber-400 to-amber-400 z-20  ${className ? className : 'text-xl font-rubik normal-case'}`}>
            {url && url.split('/')[2]}
        </a>
    )
}

export const CustomButton = ({onClick, children, className}) => {

    // link-background
    return(
        <button type={'button'} onClick={onClick} className={`p-2 flex link-background-to-r rounded-sm bg-gradient-to-r from-amber-400 to-amber-400 z-20  ${className ? className : 'text-xl font-rubik normal-case'}`}>
            {children}
        </button>
    )
}

export const BorderDiv = ({children, className = ''}) => {
    return(
        <div className={`flex link-background-to-r bg-gradient-to-r from-amber-400 ${className} to-amber-400 z-20`}>
            {children}
        </div>
    )
}

export const MenuWrapper = ({children, items = [], open = false}) => {

    const [show, setShow] = useState(false)

    // useEffect(() => {
    //     console.log(items)
    // }, [])

    return(
        <div className={'relative'} onClick={() => setShow(!show)} onMouseLeave={() => setShow(false)}>

            {children}

            <div  className={`${show ? 'scale-1' : 'scale-0'} origin-left left-[100%] bottom-[-50%] transition-all absolute rounded-xl p-2 bg-slate-900/20`}>
                <div className={'flex flex-col gap-2'}>
                    {items && items.map((x, i) => {
                        return(
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

const MenuItem = ({label, onEffect, onClick, file}) => {

    const [info, setInfo] = useState(null)

    useEffect( () => {

        getFileInfo(file)
            .then(data => {
                setInfo(data)
            })

        // console.log('INFO: ', )

    }, [])

    return(
        <Suspense fallback={<Spinner />}>
            <button type={'button'} onClick={onClick ? () => onClick() : null} className={'p-1 rounded-sm '}>
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



        </Suspense>
    )

}

export const FlexList = ({items}) => {

    return(
        <div className={'flex flex-wrap flex-1 gap-2 mt-2 font-aeonik'}>

        </div>
    )

}

export const TitleRule = ({children, classes, ruleClass}) => {

    return(
        <h3 className={`${classes} lg:whitespace-nowrap flex lg:flex-row flex-wrap flex-col gap-3 justify-between`}>
            {children}
            <div className={`lg:flex-1 w-full h-[1px] bg-slate-900 self-center ${ruleClass}`} />
        </h3>
    )
}

export const CenterRule = ({children, classes, ruleClass}) => {

    return(
        <h3 className={`${classes} lg:whitespace-nowrap flex lg:flex-row flex-wrap flex-col gap-3 justify-between`}>
            <div className={`lg:flex-1 w-full h-[1px] bg-slate-900 self-center ${ruleClass}`} />
            {children}
            <div className={`lg:flex-1 w-full h-[1px] bg-slate-900 self-center ${ruleClass}`} />
        </h3>
    )
}

export const SubtitleRule = ({children, classes, ruleClass, textPos = 'left'}) => {

    return(
        <h3 className={`${classes} lg:whitespace-nowrap flex lg:flex-row flex-wrap flex-col gap-3 justify-between`}>


            {(textPos === 'center' || textPos === 'right') &&
                <div className={`lg:flex-1 w-full h-[1px] bg-slate-900 self-center ${ruleClass}`} />
            }
            {children}
            {(textPos === 'center' || textPos === 'left') &&
                <div className={`lg:flex-1 w-full h-[1px] bg-slate-900 self-center ${ruleClass}`} />

            }
        </h3>
    )
}



export const Tooltip = ({children}) => {

    return(
        <div className={'group relative '}>
            <i className="fa-solid fa-circle-info ml-2"></i>
            <div className={'bg-slate-900/80 overflow-hidden text-white p-1 absolute -top-[150%] px-3 group-hover:scale-100 scale-0 rounded-tl-3xl rounded-tr-3xl group-hover:rounded-tl-none group-hover:rounded-tr-none origin-bottom transition-all'}>
                {children}
            </div>
        </div>
    )
}

export const TooltipWrapper = ({children, className = '', tooltip, fit = false, position = 'tm'}) => {

    let positionClass = null

    if(position === 'tm'){
        positionClass = '-translate-x-1/2 bottom-[110%] left-1/2 origin-bottom'
    }else if(position === 'tl'){
        positionClass = 'bottom-[110%] left-0 origin-bottom-left'
    }

    return(
        <div className={`group relative ${className}`}>

            {children}

            {tooltip &&
                <p className={`bg-slate-900/60  ${positionClass} overscroll-contain overflow-y-auto max-h-[150px] ${fit ? 'w-fit' : 'w-full'} text-white p-1 absolute px-3 group-hover:scale-100 scale-0 rounded-tl-3xl rounded-tr-3xl group-hover:rounded-tl-none group-hover:rounded-tr-none transition-all`}>
                    <div className={'mb-0'}>
                        {tooltip}
                    </div>
                </p>
            }

        </div>
    )

}