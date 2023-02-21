import React, { useState, useEffect } from 'react';

export default function FoldPage({content}){

    // tilt-shift blur renderer, based on:
    //  https://codepen.io/tehoko/pen/bGormeX
    function renderBlurDivs(n, start, dir){
        let arr = []


        // start = '25' = 25%
        let increment = start / n
        
        for(let x = 0; x < n; x++){

            let h = `${start - (increment*x) }%`


            arr.push(
                <div className={`absolute ${dir}-0 opacity-10`} style={{zIndex: x, backdropFilter: `blur(${x* 0.1}px)`, height: h, width: '100%'}}>

                </div>
            )
        }

        return arr
    }
    // TODO: LEARN + CREATE some component/interface that allows for animating classes.

    return (
        // linear-progressive-blur hover:backdrop-blur-lg
        <div className={`transition-all fade-in-top flex justify-center relative`}>

            
            {/* {renderBlurDivs(20, 5, 'bottom')} */}
            {/* {renderBlurDivs(100, 10, 'top')} */}
            <div className="w-fit h-80 overflow-y-auto overflow-x-hidden p-5">
                
                {content}
            </div>
            

        </div>
    )
}
