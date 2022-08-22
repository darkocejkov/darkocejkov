import React, { useState, useEffect } from 'react';

export default function Title(props){

    const title = "Darko Cejkov"
    

    function renderByCharacter(string, style){
		let a = []
		for(let x = 0; x < string.length; x++){

            let char
            if(string[x] === " "){
                a.push(
                    <span key={x} className="text-8xl">&nbsp;</span>
                )
            }else{
                a.push(
                    <span className={style} key={x}>{string[x]}</span>
                )
            }

			
		}

        return a
	}

    return(

        <div className={`flex justify-center items-center select-none light:text-black dark:text-white transition-transform ${props.pull ? '-translate-y-1/4' : 'translate-y-1/2'}`}>
            <div className="w-fit h-fit overflow-hidden">
                {/* <h1 className=" font-sectraDisplay text-8xl break-word">
                    Darko Cejkov
                </h1> */}
                {renderByCharacter(title, "font-maru hover:font-maruMega hover:bg-sky-700 text-8xl p-2 rounded-lg transition-all hover:rotate-45")}

            </div>
            

            <div className="w-50 h-6 absolute top-[70%] opacity-50 hover:opacity-100">
                <button>
                    <i class="fa-duotone fa-shuffle"></i>
                </button>
            </div>
        </div>
    )
}