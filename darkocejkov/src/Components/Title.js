import React, { useState, useEffect } from 'react';

export default function Title({pull}){

    const title = "Darko Cejkov"
    
    const [chars, setChars] = useState(null)

    useEffect(() => {

        setChars(
            splitByCharacter(title, "font-sectra hover:font-sectraDisplay hover:bg-sky-700 text-8xl p-2 rounded-lg transition-all drop-shadow-xl")
        )

    }, [])

    function splitByCharacter(string, style){
        let a = []
		for(let x = 0; x < string.length; x++){

            if(string[x] === " "){
                a.push(
                    {char: ' ', style: "text-8xl", id: 'charSpace'}
                    // <span key={x} className="text-8xl" id='charSpace'>&nbsp;</span>
                )
            }else{
                a.push(
                    {char: string[x], style: style, id: `char${x}`}
                    // <span className={style} key={`char${x}`} id={`char${x}`}>{string[x]}</span>
                )
            }

			
		}

        return a
    }

    function crawl(){
        let arr = [...chars]

        let fonts = [
            'cositimes',
            'maru',
            'maruMega',
            'sectraDisplay',
            'sectra',
            'tabi',
            'wulkan'
        ]

        let primary = fonts[Math.floor(Math.random()*fonts.length)];

    }

    function randomize(){
        let delay = 500
        let arr = [...chars]

        let fonts = [
            'cositimes',
            'maru',
            'maruMega',
            'sectraDisplay',
            'sectra',
            'tabi',
            'wulkan'
        ]

        for(let x = 0; x < arr.length; x++){

            let current = arr[x]

            let primary = fonts[Math.floor(Math.random()*fonts.length)];
            let secondary 

            do{
                secondary = fonts[Math.floor(Math.random()*fonts.length)];
            }while(secondary !== primary)

            console.log(arr)

            current.style = `font-${primary} hover:font-${secondary} hover:bg-sky-700 text-8xl p-2 rounded-lg transition-all drop-shadow-xl`

            setTimeout(() => {
                

                setChars(arr)
            }, delay * x)
        }
    }

    function renderByCharacter(){
		let a = []
		for(let x = 0; x < chars.length; x++){

            let current = chars[x]

            if(current.char === " "){
                a.push(
                    <span key={current.id} className={current.style} id={current.id}>&nbsp;</span>
                )
            }else{
                a.push(
                    <span className={current.style} key={current.id} id={current.id} onClick={() => console.log(chars)}>{current.char}</span>
                )
            }

			
		}

        return a
	}

    return(

        <div className={`flex justify-center items-center select-none light:text-black dark:text-white transition-transform text-center ${pull ? '' : 'translate-y-1/2'}`}>
            <div className="w-fit h-fit overflow-hidden">
                <h1 className="font-tabi md:text-8xl text-4xl break-word">
                    Darko Cejkov
                </h1>
                {/* {renderByCharacter(title, "font-sectra hover:font-sectraDisplay hover:bg-sky-700 text-8xl p-2 rounded-lg transition-all hover:rotate-45")} */}
                {/*{chars !== null*/}
                {/*    ? (*/}
                {/*        renderByCharacter()*/}
                {/*    )*/}
                {/*    : (*/}
                {/*        <i class="fa-solid fa-asterisk fa-spin text-8xl transition-all"></i>*/}
                {/*    )}*/}

            </div>
            

            {/*<div className="w-50 h-6 absolute top-[70%] opacity-50 hover:opacity-100">*/}
            {/*    <button>*/}
            {/*        <i class="fa-duotone fa-shuffle" onClick={() => randomize()}></i>*/}
            {/*    </button>*/}
            {/*</div>*/}
        </div>
    )
}