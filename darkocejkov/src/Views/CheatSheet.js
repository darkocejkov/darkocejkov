// import React, {useState, useEffect, Suspense} from "react";
// import {LoadingSpinner} from "../Components/Basics";
// import {smoothScrollId} from "../GlobalFunctions";
//
//
// export const CheatSheet = ({}) => {
//
//     const [pxLines, setPxLines] = useState([])
//     const [doubles, setDoubles] = useState([])
//     const [quarters, setQuarters] = useState([])
//
//     const [values, setValues] = useState([])
//
//     useEffect(() => {
//         // if(!pxLines) setPxLines(genPxLines(50))
//         setPxLines(genSquares(50))
//         setDoubles(genDoubles(50))
//         setQuarters(genQuarters(100))
//         genArrays(100)
//     }, [])
//
//     const genSquares = (max) => {
//         let array = []
//
//         for(let x = 1; x < (max); x++){
//
//             if(x === 1){
//                 array.push(x)
//             }else{
//                 array.push(x * x)
//             }
//
//             // console.log(x * 2)
//         }
//
//         console.log(array)
//
//         return array
//     }
//
//     const genDoubles = (max) => {
//         let array = []
//
//         for(let x = 1; x <= (max); x++){
//
//             if(x === 1){
//                 array.push(x)
//             }else{
//                 array.push(x * 2)
//             }
//
//             // console.log(x * 2)
//         }
//
//         console.log(array)
//
//         return array
//     }
//
//     const genQuarters = (max) => {
//         let array = []
//
//         for(let x = 1; x <= (max); x++){
//             array.push(x / 4)
//         }
//
//         console.log(array)
//
//         return array
//     }
//
//     const genArrays = (max) => {
//         let squares = []
//         let doubles = []
//         let quarters = []
//         let halves = []
//         let eighths = []
//
//         for(let x = 0; x <= (max); x++){
//             squares.push(x*x)
//             doubles.push(x*2)
//             halves.push(x/2)
//             quarters.push(x/4)
//             eighths.push(x/8)
//         }
//
//         // setTimeout(() => {
//             setValues({
//                 squares,
//                 doubles,
//                 quarters,
//                 halves,
//                 eighths,
//             })
//         // }, 5000)
//
//
//     }
//
//     const fontClasses = [
//         'font-cositimes',
//         'font-maru',
//         'font-maruMega',
//         'font-sectraDisplay',
//         'font-sectra',
//         'font-tabi',
//         'font-wulkan',
//         'font-rubik',
//         'font-aeonik',
//     ]
//
//
//
//     const [activeFont, setActiveFont] = useState('')
//     const [previewText, setPreviewText] = useState('')
//
//     return(
//         <div className={'min-h-screen z-0 overflow-x-clip bg-gradient-to-b to-cyan-200 from-blue-500 flex flex-col gap-5 p-12 items-center justify-evenly select-none'}>
//
//             <div className={'fixed z-10 bottom-0 left-0 flex flex-col gap-6 p-2 bg-slate-900/30 rounded-xl m-2'}>
//                 <a onClick={() => smoothScrollId('1')}>
//                     <code>px</code> Length
//                 </a>
//                 <a onClick={() => smoothScrollId('2')}>
//                     <code>rem</code> Length
//                 </a>
//                 <a onClick={() => smoothScrollId('3')}>
//                     <code>rem</code> font-size
//                 </a>
//                 <a onClick={() => smoothScrollId('4')}>
//                     <code>rem</code> border-radius
//                 </a>
//             </div>
//
//             <Suspense fallback={<h1>Generating Figures</h1>}>
//
//                 <h1><code>px</code> Length</h1>
//                 <div id={'1'} className={'w-[95%] p-14  overflow-x-auto bg-slate-200/20 backdrop-blur-sm flex flex-wrap gap-3'}>
//                     {values.squares && values.squares.map(x => {
//                         return(
//                             <div>
//                                 <small className={'block'}>{x}px</small>
//                                 <div className={`block h-[1px] bg-black`} style={{width: `${x}px`}}></div>
//                             </div>
//                         )
//                     })}
//
//                 </div>
//
//                 <h1><code>rem</code> Length</h1>
//                 <div className={'w-[95%] p-14 overflow-x-auto bg-slate-200/20 backdrop-blur-sm flex flex-wrap gap-3'}>
//                     {values.doubles && values.doubles.map(x => {
//                         return(
//                             <div>
//                                 <small className={'block'}>{x}rem</small>
//                                 <div className={`block h-[1px] bg-black`} style={{width: `${x}rem`}}></div>
//                             </div>
//                         )
//                     })}
//                 </div>
//
//                 <div id={'2'} className={'flex md:flex-row flex-col w-full justify-center flex gap-3'}>
//                     <select className={`p-2 rounded-xl`} onChange={(e) => setActiveFont(e.target.value)}>
//                         <option className={'text-center text-gray'}>none</option>
//                         {fontClasses.map(x => {
//                             return <option className={`${x} p-2`}>{x}</option>
//                         })}
//                     </select>
//
//                     <input type={'text'} value={previewText} onChange={(e) => setPreviewText(e.target.value)} className={`p-2 rounded-xl border-none`}/>
//                 </div>
//
//                 <h1><code>rem</code> font-size</h1>
//                 <div id={'3'} className={`w-[95%] p-14 overflow-x-auto bg-slate-200/20 backdrop-blur-sm flex flex-wrap gap-6 ${activeFont}`}>
//                     {values.quarters && values.quarters.map(x => {
//                         return(
//                             <div>
//                                 <p className={'p-2 bg-slate-900/10 rounded-xl'} style={{fontSize: `${x}rem`}}>
//                                     {previewText
//                                         ? (
//                                             <>
//                                                 ({x}rem) {previewText}
//                                             </>
//                                         )
//                                         : (
//                                             <>
//                                                 {x}rem
//                                             </>
//                                         )}
//
//                                 </p>
//                                 {/*<div className={`block h-[1px] bg-black`} style={{width: `${x}rem`}}></div>*/}
//                             </div>
//                         )
//                     })}
//                 </div>
//
//                 <h1><code>rem</code> border-radius</h1>
//                 <div id={'4'} className={`w-[95%] p-14 overflow-x-auto bg-slate-200/20 backdrop-blur-sm flex flex-wrap gap-6 ${activeFont}`}>
//                     {values.eighths && values.eighths.map(x => {
//                         return(
//                             <div>
//                                 <p className={'p-2 bg-slate-900/10'} style={{borderRadius: `${x}rem`}}>{x}rem</p>
//                                 {/*<div className={`block h-[1px] bg-black`} style={{width: `${x}rem`}}></div>*/}
//                             </div>
//                         )
//                     })}
//                 </div>
//
//             </Suspense>
//
//
//
//
//
//         </div>
//     )
//
// }