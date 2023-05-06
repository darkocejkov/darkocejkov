import React, {
    Dispatch,
    ForwardedRef,
    forwardRef,
    RefObject,
    useLayoutEffect,
    useEffect,
    useMemo,
    useRef,
    useState, useDeferredValue
} from "react";
import {DragPane, InfoBox} from "../Components/Basics.tsx";
import {
    animate,
    motion,
    MotionValue,
    useDragControls,
    useMotionValue,
    useMotionValueEvent,
    useSpring
} from "framer-motion";
import {createPortal} from "react-dom";
import {ReactChild} from "../types.ts";
import {start} from "repl";
import {boundingBoxRange, LipSum5, random, vh2px, vw2px} from "../helpers.ts";
import {SpriteMap} from "use-sound/dist/types";

import useSound from "use-sound";

import popSFX from '../assets/sfx/pops.mp3'
import hover from '../assets/sfx/primarySystemSounds/navigation_hover-tap.wav'
import transitionRight from '../assets/sfx/primarySystemSounds/navigation_transition-right.wav'
import confirm from '../assets/sfx/primarySystemSounds/state-change_confirm-up.wav'

import {open, closing, closed} from '../assets/ascii/eyes.js'

import {IconContext} from "react-icons";
import {
    SiTypescript,
    SiBlender,
    SiJavascript,
    SiMysql,
    SiRedis,
    SiAdobeillustrator,
    SiAdobephotoshop,
    SiAdobepremierepro,
    SiPassport,
    SiExpress,
} from "react-icons/si";
import {TbBrandThreejs, TbBrandCpp, TbArrowsRandom} from 'react-icons/tb'
import {FaNodeJs, FaFigma, FaGit, FaReact, FaAws, FaJava, FaLinux, FaPython} from "react-icons/fa";
import {Link} from "react-router-dom";
import {Tooltip} from "antd";

const popSpriteMap: SpriteMap = {
    a: [250, 420],
    b: [650, 820],
    c: [1830, 1920],
    d: [2780, 2880],
    e: [3750, 3840]
}

const facts = [
    '＼ʕ •ᴥ•ʔ／',
    'fun',
    'creative',
    'illustrative',
    'design',
    'developer',
    'innovator'
]

type Position = {
    x: number,
    y: number
}

type Node = {
    // startPos: Position,
    children: ReactChild
    id: number
}

const NodeContainer = ({contentList}: {
    contentList: Node[]
}) => {

    const constraintRef = useRef(null)

    const springConfig = {
        // stiffness: Math.max(700 - d * 120, 0),
        // damping: (20 + (i * -2)),
        mass: 2,
        // mass: x,
    };

    const x = useSpring(useMotionValue(0), springConfig)
    const y = useSpring(useMotionValue(0), springConfig)

    const [active, setActive] = useState<number | null>(null)

    const total = contentList.length

    const [flag, setFlag] = useState(0)
    const [resetting, setResetting] = useState(false)

    const elementArray = useMemo(() => {
        return contentList.map((content, i) => {

            return (
                <NodePane
                    key={content.id}
                    total={total}
                    i={content.id}
                    x={x}
                    y={y}
                    active={active}
                    setActive={setActive}
                    constraint={constraintRef}
                    resetFlag={flag}
                >
                    {content.children}
                </NodePane>
            )
        })
    }, [flag])

    const [reset] = useSound(transitionRight, {
        interrupt: true,
        playbackRate: 1,
        volume: 0.5
    })

    const [shuffle] = useSound(confirm, {
        interrupt: true,
        volume: 0.5,
    })

    const handleReset = () => {
        reset()
        setFlag(flag => flag + 1)
        setResetting(true)
    }

    const handleShuffle = () => {
        shuffle()
    }


    if (resetting) {
        setTimeout(() => setResetting(false), 1000)
    }


    const actionVariants = {
        spin: {
            rotate: '-1turn',
            transition: {
                duration: .5
            }
        },
        still: {}
    }


    return createPortal(
        <div className={'fixed top-[5%] left-[5%] h-[90%] w-[90%]'}>

            <div className={'flex flex-col gap-2'}>
                <div ref={constraintRef}
                     className={'max-h-[80vh] bg-slate-900/10 rounded-xl grid grid-cols-4 grid-rows-3 gap-4 p-6'}>
                    {elementArray}
                </div>

                <div className={'flex justify-center gap-4 bg-slate-900/10 rounded-xl p-2 pb-3'}>
                    <button
                        onClick={handleReset}
                        className={'p-2 px-5 bg-slate-900/10 font-rubik rounded-xl button-shadow backdrop-blur-md transition-all'}>
                        <motion.i
                            variants={actionVariants}
                            animate={resetting ? 'spin' : 'still'}
                            className="fa-solid fa-arrow-rotate-left"
                        ></motion.i>
                    </button>

                    <button
                        onClick={handleShuffle}
                        className={'p-2 px-5 bg-slate-900/10 font-rubik rounded-xl button-shadow backdrop-blur-md transition-all'}>
                        <TbArrowsRandom/>
                    </button>

                </div>

            </div>


            {/*<div className={'fixed top-[80vh] left-1/2 -translate-x-1/2 -translate-y-1/2 z-30'}>*/}
            {/*    <button*/}
            {/*        onClick={handleReset}*/}
            {/*        className={'p-2 px-5 bg-slate-900/10 font-rubik rounded-xl button-shadow backdrop-blur-md transition-all'}>*/}
            {/*        <motion.i*/}
            {/*            variants={actionVariants}*/}
            {/*            animate={resetting ? 'spin' : 'still'}*/}
            {/*            className="fa-solid fa-arrow-rotate-left"*/}
            {/*        ></motion.i>*/}
            {/*    </button>*/}
            {/*</div>*/}

            {/*<Measure/>*/}

            {/*{elementArray}*/}
        </div>,
        document.body
    )
}

const resetIndexDelay = 200

const NodePane = ({total, i, x, y, active, setActive, children, constraint, resetFlag}: {
    children: ReactChild
    total: number,
    i: number,
    x: MotionValue,
    y: MotionValue,
    active: number | null,
    setActive: Dispatch<number | null>,
    constraint: RefObject<HTMLDivElement>,
    resetFlag: number
}) => {
    // const d = total - (i * total)

    const springConfig = {
        // stiffness: Math.max(700 - d * 120, 0),
        // damping: (20 + (i * -2)),
        mass: 1,
        // mass: x,
    };


    const dx = useSpring(x)
    // const dx = useSpring(x)
    const dy = useSpring(y)
    // const dy = useSpring(y)

    // const ref = useRef<HTMLDivElement>(null)

    // <i className="fa-solid fa-grip-dots"></i>
    const dragControls = useDragControls()

    function startDrag(event: React.PointerEvent<HTMLDivElement>) {
        dragControls.start(event, {snapToCursor: false})
    }

    const [up] = useSound(hover, {
        volume: 0.5
    })
    const [down] = useSound(hover, {
        playbackRate: 0.75,
        volume: 0.5
    })

    const [play] = useSound(popSFX, {
        sprite: popSpriteMap,
        volume: 0.1,
        interrupt: true,
    })

    const xx = useMotionValue(0)
    const yy = useMotionValue(0)

    const paneRef = useRef(null)

    const oldFlag = useRef(resetFlag)

    if (oldFlag.current !== resetFlag) {

        // console.log(`${i} old ${oldFlag.current} new ${resetFlag} ${xx} ${yy}`)
        oldFlag.current = resetFlag

        if (xx.get() !== 0 || yy.get() !== 0) {
            setTimeout(() => {
                //
                xx.stop()
                yy.stop()

                animate(xx.get(), 0, {
                    onUpdate: latest => xx.set(latest),
                    // onComplete: () => play({id: 'a'})
                })

                animate(yy.get(), 0, {
                    onUpdate: latest => yy.set(latest),
                    onComplete: () => play({id: 'b'})
                })
            }, i * resetIndexDelay)
        }

        // xx.stop()
        // yy.stop()
        //
        // animate(xx.get(), 0, {
        //     onUpdate: latest => xx.set(latest),
        //     onComplete: () => play({id: 'a'})
        // })
        //
        // animate(yy.get(), 0, {
        //     onUpdate: latest => yy.set(latest),
        //     onComplete: () => play({id: 'b'})
        // })
    }


    return (
        <>
            <motion.div
                ref={paneRef}
                drag
                dragConstraints={constraint}
                // dragTransition={{bounceStiffness: 500, bounceDamping: 20}}
                onDragStart={() => {
                    setActive(i)
                    // play({id: 'a'})
                    up()
                    return
                }}
                onDragEnd={() => {
                    setActive(null)
                    // play({id: 'b'})
                    down()
                    return
                }}
                dragControls={dragControls}
                dragListener={false}
                whileDrag={{
                    scale: 1.05,
                    rotateZ: `${random(25, true)}deg`
                }}
                initial={{
                    opacity: 0,
                }}
                animate={{
                    opacity: 1,
                }}
                style={{
                    x: xx,
                    y: yy,
                }}
                className={'backdrop-blur-md p-5 bg-slate-900/0 relative origin-center rounded-lg shadow-lg overflow-hidden select-none z-10'}
            >
                <div className={'absolute right-0 -top-2 p-1'} onPointerDown={startDrag}>
                    <i className="fa-solid fa-grip-dots"></i>
                </div>

                {children}
            </motion.div>
        </>
    )
}

const distances = [
    10, 20, 30, 50, 100, 125, 150, 200, 300, 400
]

let contents: Node[] = []

for (let d of distances) {
    contents.push(
        {
            id: d, children:
                <div className={'flex'}>

                </div>
        }
    )
}

const boundingW = 90
const boundingH = 90

const differenceX = (100 - boundingW) / 2
const differenceY = (100 - boundingH) / 2

const bounding = boundingBoxRange(boundingW, boundingH)

const Measure = () => {
    return (
        <div className={'bg-slate-900 fixed'} style={{
            height: '1px',
            width: `${vw2px(differenceX)}px`,
            top: '50vh',
            left: 0
        }}/>
    )
}

const Content = ({children}: {
    children: ReactChild
}) => (
    // bg-white/10
    <div className={'flex justify-center h-full w-full items-center rounded-xl overflow-y-auto'}>
        {children}
    </div>
)

const textArray = [
    '┏ʕ •ᴥ•ʔ┛',
    '＼ʕ •ᴥ•ʔ＼',
    'ʕ •ₒ• ʔ',
    'ʕ ꈍᴥꈍʔ',
    'ʕ ´•̥̥̥ ᴥ•̥̥̥',
    '＼ʕ •ᴥ•ʔ／',
    '＼ʕ •ᴥ•ʔ＼',
    'ʕʘ̅͜ʘ̅ʔ',
    ' ʕ – o – ʔ',
    '(✪㉨✪)',
    'ʕ ﹷ ᴥ ﹷʔ',
    'ᕕʕ •ₒ• ʔ୨',
    'ʅʕ•ᴥ•ʔʃ',
    'ʕ´•㉨•`ʔ',
]

const dancing = [
    '＼ʕ •ᴥ•ʔ＼',
    '／ʕ•ᴥ• ʔ／',
    '＼ʕ •ᴥ• ʔ／',
    'ʅ_ʕ •ᴥ• ʔ_ʃ',
]

const AnimateText = () => {
    return (
        <motion.p
            className={'h-full w-full'}
        >

        </motion.p>
    )
}

const TextReplace = ({textArray, time = 1000, className = '', restartDelay = 0}: {
    textArray: string[],
    time?: number //ms
    className?: string,
    restartDelay?: number
}) => {

    const [text, setText] = useState({text: textArray[0], i: 0})

    useEffect(() => {
        const id = setInterval(() => {

            setText(text => {
                let n = text.i + 1
                if (n > (textArray.length - 1)) n = 0


                return {text: textArray[n], i: n}
            })
        }, time)

        return () => {
            clearInterval(id)
        }
    }, [])

    return (
        <p className={className}>{text.text}</p>
    )

}

const contentData = [
    {}
]


const contentChildren: ReactChild[] = [
    <p className={'font-rubik '}>
        <span className={'font-tabi text-3xl'}>Hellooo!</span>
        <hr/>
        <span>I'm Darko ʕ ꈍᴥꈍʔ</span>
    </p>,
    <p className={'font-rubik text-center'}>
        I'm a developer/engineer. Experience in Web. Pursuing dreams that coalesce technical and creative skills.
    </p>,
    <p className={'font-rubik flex flex-col text-center gap-1'}>
        Here's a quick look at tech I've used:
        <div className={'flex gap-2 justify-evenly flex-wrap'}>
            <IconContext.Provider value={{size: '1.5rem'}}>

                <Tooltip title={'TypeScript'}>
                    <SiTypescript/>
                </Tooltip>


                <Tooltip title={'JavaScript/ES6'}>

                    <SiJavascript/>
                </Tooltip>

                <Tooltip title={'Python 3'}>

                    <FaPython/>
                </Tooltip>

                <Tooltip title={'CLANG (C/C++)'}>

                    <TbBrandCpp/>
                </Tooltip>

                <Tooltip title={'Java OOP'}>

                    <FaJava/>
                </Tooltip>

                <Tooltip title={'Blender'}>

                    <SiBlender/>
                </Tooltip>

                <Tooltip title={'ReactJS'}>

                    <FaReact/>
                </Tooltip>

                <Tooltip title={'ThreeJS'}>

                    <TbBrandThreejs/>
                </Tooltip>

                <Tooltip title={'NodeJS Runtime'}>

                    <FaNodeJs/>
                </Tooltip>

                <Tooltip title={'Git VCS'}>

                    <FaGit/>
                </Tooltip>

                <Tooltip title={'PassportJS Auth'}>

                    <SiPassport/>
                </Tooltip>

                <Tooltip title={'ExpressJS Middleware'}>

                    <SiExpress/>
                </Tooltip>

                <Tooltip title={'MySQL relational database'}>

                    <SiMysql/>
                </Tooltip>

                <Tooltip title={'Redis key/value database'}>

                    <SiRedis/>
                </Tooltip>

                <Tooltip title={'Linux administration'}>

                    <FaLinux/>
                </Tooltip>

                <Tooltip title={'Illustrator'}>

                    <SiAdobeillustrator/>
                </Tooltip>

                <Tooltip title={'Photoshop'}>

                    <SiAdobephotoshop/>
                </Tooltip>

                <Tooltip title={'Premiere Pro'}>

                    <SiAdobepremierepro/>
                </Tooltip>

                <Tooltip title={'Figma design prototypes'}>

                    <FaFigma/>
                </Tooltip>

                <Tooltip title={'AWS (S3, SES, EC2, ECS, Lightsail, Amplify)'}>

                    <FaAws/>
                </Tooltip>
            </IconContext.Provider>
        </div>
        <span>for specifics, check out my <Link className={'link'} to={'/experience'}>experience</Link> </span>
    </p>,
    <p className={'font-rubik flex flex-col gap-2 items-center justify-center'}>
        <p className={'text-xl'}>Here's what I <em className={'link'}>really</em> do:</p>
        <TextReplace className={'font-fira'} textArray={[
            'Develop code',
            'Design ideas',
            'Create action',
            'Curate taste',
            'Break things',
            '... then fix them.',
            'Overcomplicate',
            'Simplify',
            'Refactor'
        ]}/>
    </p>,
    <p className={'font-rubik text-center'}>
        <span className={'text-xl'}>My Mantra</span>
        <br/>
        <span>I learn. I make. I do. I have fun.</span>
    </p>,
    <p className={'font-rubik text-center'}>At the heart of my soul, I am creative and never like to sit still. My
        passion is in finding new things and learning about the
        fundamentals.</p>,
    <p className={'font-rubik text-center'}>Gaming, Computers, Software, Audio/Video Production & Editing, DJing,
        Animals, Sketching & Painting, Tinkering.</p>,
    <p className={'font-rubik text-center'}>I'm inspired by new, sleek, modern designs - while at the same time,
        love the nostalgia of the 90s/Y2K era.</p>,
    <p className={'font-rubik text-center'}>I love thrifting and vintage. I love animals - rats, cats, dogs, bears,
        snakes.</p>,
    <p className={'font-rubik text-center'}>Obsessed with cyberpunk/dystopia/sci-fi. Akira, Lain, Ghost In The
        Shell, Tokyo Ghost, Sandman,
        Blade Runner, Blade, Matrix.</p>,
    <pre className={'font-fira text-[.25rem]'}>
        <TextReplace time={250} textArray={[
            open,
            closing,
            closed,
            closing,
            open,
        ]}/>
    </pre>,
    <TextReplace textArray={dancing} time={500}/>,
]


export default function About({}) {

    const w = window.innerWidth
    const h = window.innerHeight


    // console.log('bounding: ', {bounding})


    const content: Node[] = contentChildren.map((x, i) => {
        return {
            id: i,
            children: (
                <Content>
                    {x}
                </Content>
            )
        }
    })

    //given that we know the height AND width in VIEWPORT units, and the bounding box is "centered"
    //thus, the allowed area for Panes will be in the range defined by the box where x is the known length
    // (1/2)*(100-x)

    return (
        <>
            <NodeContainer contentList={content}/>

        </>
    )
}
