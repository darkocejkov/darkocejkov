import React, {useState} from "react";
import {Link} from 'react-router-dom'
import {ControlButton} from "./Basics.tsx";
import {NavRoute} from "../types.ts";

export default function Navigation({routes}: { routes: NavRoute[] }) {

    const [childHovering, setChildHovering] = useState(false)

    let rounding = 'rounded-t-sm rounded-b-xl'
    if (childHovering) {
        rounding = 'rounded-none'
    }

    return (
        <div
            className={`z-50 select-none fixed inset-x-1/2 -translate-x-1/2 -translate-y-1/2 hover:-translate-y-0 transition-all bg-slate-900/10 backdrop-blur-sm shadow-lg p-3 min-w-fit opacity-60 hover:opacity-100 ${rounding}`}>
            <div

                className={'flex gap-3 hover:gap-4 justify-evenly transition-all font-aeonik tracking-tighter'}>

                {routes.map(route => {

                    if (route.includeInNav === false) return

                    return (
                        <Link key={route.path} to={route.path}>
                            <ControlButton label={route.label || route.path} placement={"BOTTOM"}
                                           onHover={setChildHovering}>
                                {route.icon || route.path}
                            </ControlButton>
                        </Link>
                    )
                })}

            </div>
        </div>
    )
}