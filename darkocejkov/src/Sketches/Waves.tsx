import React from "react";
import {ReactChild} from "../types.ts";

const colors = [
    // 'bg-neutral-600',
    // 'bg-stone-700',
    'bg-red-600',
    'bg-orange-500',
    'bg-amber-600',
    'bg-yellow-400',
    'bg-lime-300',
    'bg-green-300',
    'bg-cyan-400',
    'bg-blue-700',
    'bg-indigo-400',
    'bg-rose-500',
]

export const FanWave = ({n = 10, contentMap}: {
    n: number,
    contentMap?: ReactChild[]
}) => {
    const stripes = []

    for (let i = 0; i < n; i++) {

        if (contentMap) {
            stripes.push(
                <div className={`stripe ${colors[i]} skew-dance-subtle`}
                     anim-delay={`${i * 0.24}s`}
                     style={{
                         animationDelay: `${i * 0.4}s`,
                         zIndex: i,
                     }}>
                    {contentMap[i]}
                </div>
            )
        } else {
            stripes.push(
                <div className={`stripe ${colors[i]} skew-dance-subtle`}
                     anim-delay={`${i * 0.24}s`}
                     style={{
                         animationDelay: `${i * 0.4}s`,
                         zIndex: i,
                     }}
                />
            )
        }


    }

    return (
        <div className={'stripe-container group'}>
            {stripes}
        </div>
    )
}