import {Placements, ReactChild} from "../types.ts";
import React from "react";
import {colors} from "../theme.ts";
import {motion} from "framer-motion";

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