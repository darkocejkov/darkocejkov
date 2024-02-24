import React, {useContext} from "react";
import {ReactChild} from "../types.ts";
import {MenuContext} from "../Contexts/Menu";

type LayoutProps = {
    children: JSX.Element | string,
    className?: string
}

export function Layout(props: LayoutProps) {

    const {children} = props

    const {state: menuOpen} = useContext(MenuContext)

    //FIXME: On the "SOCIALS" Page, this "fixed" position hack to force scroll-removal bugs out because of the wackiness of the layout of the socials circle.
    return (
        <div
            // className={'perspective-lg min-h-screen min-w-screen p-24 flex flex-col items-center gap-5 bg-gradient-to-b from-blue-100 to-blue-400 overflow-hidden'}>
            className={`${menuOpen ? 'fixed' : ''} perspective-lg min-h-screen min-w-screen justify-center p-3 md:p-24 pt-12 md:pt-32 flex flex-col items-center gap-5 bg-gradient-to-b from-blue-100 to-blue-400 overflow-hidden`}>
            {children}
        </div>
    )
}

export function Container({children, className = ''}: LayoutProps) {

    return (
        <div className={`container mx-auto flex justify-center items-center ${className}`}>
            {children}
        </div>
    )
}

export const Rule = () => {
    return (
        <div className={`hr-fill`}/>
    )
}
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