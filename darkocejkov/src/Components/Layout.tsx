import React from "react";

type LayoutProps = {
    children: JSX.Element | string,
    className?: string
}

export function Layout(props: LayoutProps) {

    const {children} = props

    return (
        <div
            className={'perspective-lg min-h-screen min-w-screen p-24 pt-32 flex flex-col items-center gap-5 bg-gradient-to-b from-blue-100 to-blue-400 overflow-hidden'}>
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