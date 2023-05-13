import React, {useMemo} from "react";
import {Pane} from '../Components/Basics.tsx'
import {random} from "../helpers.ts";

export default function Projects({}) {


    const panes = useMemo(() => {
        let arr: JSX.Element[] = []

        for (let i = 0; i < 10; i++) {
            arr.push(
                <Pane id={String(i)} className={'bg-slate-900/5 flex-grow'}>
                    <div style={{
                        height: random(500, false),
                        width: random(600, false)
                    }}>

                    </div>
                </Pane>
            )
        }

        return arr
    }, [])

    return (
        <div className={'flex flex-row flex-wrap gap-6 w-full'}>
            {panes}
        </div>
    )
}