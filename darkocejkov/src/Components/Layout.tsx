import React from "react";

type LayoutProps = {
    children: JSX.Element | string,
    className?: string
}

export function Layout(props: LayoutProps) {

    const {children} = props

    return (
        <div
            className={'perspective-lg min-h-screen min-w-screen p-24 flex flex-col items-center justify-center gap-5 bg-gradient-to-b from-blue-100 to-orange-400'}>
            {children}
        </div>
    )
}

export function Container(props: LayoutProps) {
    const {children} = props

    return (
        <div className={'container mx-auto flex justify-center items-center'}>
            {children}
        </div>
    )
}