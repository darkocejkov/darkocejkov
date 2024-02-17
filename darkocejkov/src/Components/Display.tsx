import {ReactChild} from "../types.ts";
import {motion} from "framer-motion";
import React from "react";
import {TooltipWrapper} from "./Tooltip.tsx";

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
export const Spinner = () => {
    return (
        <i className="fa-solid fa-spinner-third fa-spin"></i>
    )
}
export const TextBox = ({children, className = ''}: {
    children: ReactChild,
    className?: string
}) => {
    return (
        <p className={`bg-slate-900/10 max-h-[30vh] overflow-y-auto p-4 rounded-tl-xl rounded-bl-xl ${className}`}>
            {children}
        </p>
    )
}