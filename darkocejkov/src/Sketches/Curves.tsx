import {getRandom, getRandomFloat, randomFromList, randomHex} from "../helpers.ts";
import React, {useMemo} from 'react'
import {motion} from "framer-motion";

const fonts = [
    'font-cositimes',
    'font-maru',
    'font-maruMega',
    'font-sectraDisplay',
    'font-sectra',
    'font-tabi',
    'font-tabi',
    'font-wulkan',
    'font-rubik',
    'font-aeonik',
    'font-fira',
]

const colors = [
    'fill-slate-900',
    'fill-orange-500',
    'fill-lime-500',
    'fill-sky-600',
    'fill-blue-600',
    'fill-rose-500',
]

const words = [
    "Darko",
    "Cejkov",
    "Developer",
    "Fullstack",
    "Fun",
    "Design",
    "Creative",
]

// const paths = require('../assets/svg/SVGPaths').contourPaths
const paths = [
    'M 7 851.9 C 1012.6 961.3 1154.3 98.6 1918 266',
    // 'M 3.6 998.1 C 1012.6 961.3 1154.3 98.6 30.4 19.3',
    'M 3.6 998.1 C 1012.6 961.3 1154.3 98.6 1918 909',
    'M 1918 -6 C 1012.6 961.3 1154.3 98.6 1916 1079',
    'M 1916 328 C 1012.6 961.3 1154.3 98.6 -0.8 994.8',
    // 'M 888 -6 C 1691.2 564 18.1 175.6 1781 1079',
    'M -0.8 464.6 L 1918 467',
    'M 1918 246 C 56 938 61 53 845 59 C 1722 58 1703 977 904 1079',
    'M 172 1076 C 550.3333 759 557 55 1918 535 C 1343 1003 -1 -4 0 916',

    'M 13 798 C 251 712.3333 394 489 750 563 C 1195 672 1388 380 1918 437',
    'M 13 799 C 251 713.3333 556 917 727 542 C 857 232 1443 600 1918 342',
]

const curves = useMemo(() => {

    return paths.map((x, i) => {

        let hex = randomHex()

        //stroke={`#${hex}`}

        return (
            <path id={`curve${i}`} strokeOpacity={0.8} strokeDasharray={"4 2"} stroke={`#${hex}`} fill="transparent"
                  d={x}></path>
        )
    })
}, [])

const textPaths = useMemo(() => {

    return paths.map((x, i) => {

        let nDivisions = getRandom(0, 5)

        let offsetList = ['-100%', '100%']

        let nSize = getRandom(1, 4)

        let fontSizeList = []
        for (let x = 0; x < nSize; x++) {
            fontSizeList.push(
                `${getRandom(0, 12)}rem`
            )
        }

        let randomFont = randomFromList(fonts)
        let randomColor = randomFromList(colors)
        let randomWord = randomFromList(words)
        // let randomStroke = randomFromList(colors)

        let transitionConfig = {
            type: 'spring',
            // mass: getRandomFloat(.1, 3),
            // bounce: getRandomFloat(0, 1),
            delay: getRandom(1, 6),
            duration: getRandomFloat(3, 10),
            repeat: Infinity,
        }

        console.log({transitionConfig, offsetList})

        return (
            <motion.textPath
                animate={{
                    // startOffset: ['-100%', '100%'],
                    startOffset: offsetList,
                    fontSize: ['0rem', '5rem', '2rem']

                }}
                transition={transitionConfig}
                // style={{
                //     fontSize: ['0rem'],
                // }}
                // alignmentBaseline="center"
                href={`#curve${i}`}
                className={`${randomFont} ${randomColor}`}
            >
                {randomWord}
            </motion.textPath>

        )
    })
}, [])

const CurvedText = () => {
    return (
        <motion.svg
            height={'100%'}
            viewBox="0 0 1920 900">

            {curves}

            <text width="100%">
                {textPaths}
            </text>
        </motion.svg>

    )
}