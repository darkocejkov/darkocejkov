import {motion} from "framer-motion";
import React from "react";

export const HamburgerMenu = ({open}: {
    open: boolean
}) => {
    const variantsTop = {
        open: {
            rotateZ: '45deg',
            translateY: '10px',
            strokeWidth: '8px'
        },
        closed: {
            rotateZ: '0deg',
            translateY: '0px',
            strokeWidth: '2px'
        }
    }

    const variantsMid = {
        open: {
            translateX: '100%',
            opacity: 0,
            strokeWidth: '8px'
        },
        closed: {
            translateX: '0%',
            opacity: 1,
            strokeWidth: '2px'
        }
    }

    const variantsBot = {
        open: {
            rotateZ: '-45deg',
            translateY: '-10px',
            strokeWidth: '8px'
        },
        closed: {
            rotateZ: '0deg',
            translateY: '0px',
            strokeWidth: '2px'
        }
    }

    return (
        <motion.svg viewBox={'0 0 50 50'} className={'h-12 w-12'}>

            {/*<line x1={'10'} y1={'15'} x2={'40'} y2={'15'} stroke={'black'}/>*/}

            <motion.path
                variants={variantsTop}
                animate={open ? "open" : "closed"}
                d={"M10 15 L 40 15"} strokeLinecap={'round'} stroke={'black'}/>
            <motion.path
                variants={variantsMid}
                animate={open ? "open" : "closed"}
                d={"M10 25 L 40 25"} strokeLinecap={'round'} stroke={'black'}/>
            <motion.path
                variants={variantsBot}
                animate={open ? "open" : "closed"}
                d={"M10 35 L 40 35"} strokeLinecap={'round'} stroke={'black'}/>
        </motion.svg>
    )
}