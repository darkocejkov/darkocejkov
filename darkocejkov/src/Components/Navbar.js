import React, { useState, useEffect } from 'react';

import {Link, useLocation} from 'react-router-dom'
import useSound from 'use-sound';

// import spell from '../assets/sounds/bubble_spell.wav'

export default function Navbar(props){

    // const [play, {stop}] = useSound(spell, {volume: 0.2})

    // const [mode, setMode] = useState('bottom')
    const [page, setPage] = useState('home')

    const location = useLocation()

    useEffect(() => {
        if(location.pathname.split('/')[1]){
            setPage(location.pathname.split('/')[1])
            props.setPull(true)
        }else{
            setPage('home')
            props.setPull(false)
        }
    }, [location])

    const [hiding, setHiding] = useState(false)
    const [opening, setOpening] = useState(false)
    const [hidden, setHidden] = useState(false)

    function handleHide(hide){
        console.log(hide)

        if(hide === true){
            setHiding(true)
            setTimeout(() => {
                setHiding(false)
                setHidden(true)
                props.setHideBg(true)
            }, 200)
        }else{
            props.setHideBg(false)
            setOpening(true)
            setHidden(false)
            setTimeout(() => {
                setOpening(false)
            }, 200)
        }
    }

    // onMouseEnter={() => play({playbackRate: 1.4})}


    return(
        <div className="fixed bg-gradient-to-r from-cyan-100 to-blue-500 opacity-25 hover:opacity-50 transition-all bottom-0 w-full h-24 flex items-center justify-evenly text-2xl">


                {/* nav */}
                <div className="flex justify-around opacity-100 gap-10">

                    {/* <Icon icon={<i class="fa-solid fa-arrow-down-left"></i>} value={page} setter={setPage} route={"/home"} text={"Home"}/> */}
                    <div className={`rounded-lg w-10 h-10 flex justify-center items-center ${page !== 'home' ? 'opacity-100' : 'opacity-0 invisible'} hover:bg-slate-900 hover:text-white transition-all group hover:multi-shadow-open-t`}>
                        <Link to="/" onClick={() => setPage('home')}>
                            <i class="fa-solid fa-arrow-down-left"></i>
                        </Link>
                        <span className="font-tabi absolute text-white  top-0 -m-10 scale-0 group-hover:scale-100 select-none transition-all">Home</span>
                        
                    </div>

                    <div className={`rounded-lg w-10 h-10 flex justify-center items-center hover:white-shadow ${page === 'education' ? 'bg-slate-900 text-white hover:bg-transparent hover:text-black' : 'hover:bg-slate-900 hover:text-white'}  transition-all group`}>
                        <Link to="/education" onClick={() => setPage('education')}>
                            <i className="fa-regular fa-graduation-cap h-100 w-100"></i>
                        </Link>
                        <span className="font-tabi absolute text-white  top-0 -m-10 scale-0 group-hover:scale-100 transition-all">Education</span>
                    </div>

                    <div className={`rounded-lg w-10 h-10 flex justify-center items-center hover:white-shadow ${page === 'experience' ? 'bg-slate-900 text-white hover:bg-transparent hover:text-black' : 'hover:bg-slate-900 hover:text-white'} transition-all group`} >
                        <Link to="/experience"  onClick={() => setPage('experience')}>
                            <i className="fa-regular fa-briefcase-blank h-100 w-100"></i>
                        </Link>
                        <span className="font-tabi absolute text-white  top-0 -m-10 scale-0 group-hover:scale-100 transition-all">Experience</span>
                    </div>

                    <div className={`rounded-lg w-10 h-10 flex justify-center items-center hover:white-shadow ${page === 'personal' ? 'bg-slate-900 text-white hover:bg-transparent hover:text-black' : 'hover:bg-slate-900 hover:text-white'} transition-all group`} >
                        <Link to="/personal"  onClick={() => setPage('personal')}>
                            <i className="fa-regular fa-face-smile  h-100 w-100"></i>
                        </Link>
                        <span className="font-tabi absolute text-white  top-0 -m-10 scale-0 group-hover:scale-100 transition-all">Personal</span>
                    </div>
                </div>

                <div className="flex justify-around opacity-100 gap-10">
                    {hidden === true
                        ? (
                            <div className={`rounded-lg w-10 h-10 flex justify-center items-center hover:white-shadow ${hiding === true && 'opacity-0'} hover:bg-slate-900 hover:text-white transition-all group`} onClick={() => handleHide(false)}>
                                <span className="font-tabi absolute text-white  top-0 -m-10 scale-0 group-hover:scale-100 select-none transition-all">Show Sketch</span>
                                <i class="fa-solid fa-eyes"></i>
                                
                            </div>
                        )
                        : (
                            <>
                                <div className={`rounded-lg w-10 h-10 ${opening === true && 'opacity-100'} hover:white-shadow flex justify-center items-center hover:bg-slate-900 hover:text-white transition-all group`} onClick={() => handleHide(true)}>
                                    <span className="font-tabi absolute text-white  top-0 -m-10 scale-0 group-hover:scale-100 select-none transition-all">Hide Sketch</span>
                                    <i class="fa-solid fa-face-dotted"></i>
                                </div>
                            
                            </>
                        )
                    }
                    <div className={`rounded-lg w-10 h-10 flex justify-center items-center hover:white-shadow hover:bg-slate-900 hover:text-white transition-all group ${hidden === true && '-translate-x-10 opacity-0 invisible'} ${hiding === true && '-translate-x-10 opacity-0'} ${opening === true && 'translate-x-24 opacity-100'}`} >
                    <span className="font-tabi absolute text-white  top-0 -m-10 scale-0 group-hover:scale-100 select-none transition-all">Previous</span>
                        <i class="fa-solid fa-chevron-left"></i>
                    </div>
                    <div className={`rounded-lg w-10 h-10 flex justify-center items-center hover:white-shadow hover:bg-slate-900 hover:text-white transition-all group ${hidden === true && '-translate-x-10 opacity-0 invisible'} ${hiding === true && '-translate-x-10 opacity-0'} ${opening === true && 'translate-x-11 opacity-100'}`} >
                        {props.playing === true
                            ? (
                                <>
                                    <span className="font-tabi absolute text-white  top-0 -m-10 scale-0 group-hover:scale-100 select-none transition-all">Pause</span>
                                    <i class="fa-solid fa-pause" onClick={() => props.setPlaying(false)}></i>
                                </>
                                
                            )
                            : (
                                <>
                                    <span className="font-tabi absolute text-white  top-0 -m-10 scale-0 group-hover:scale-100 select-none transition-all">Play</span>
                                    <i class="fa-solid fa-play" onClick={() => props.setPlaying(true)}></i>
                                </>
                                
                            )}
                        
                    </div>
                    <div className={`rounded-lg w-10 h-10 flex justify-center items-center hover:white-shadow hover:bg-slate-900 hover:text-white transition-all group ${hidden === true && '-translate-x-10 opacity-0 invisible'} ${hiding === true && '-translate-x-10 opacity-0'} ${opening === true && 'translate-x-1 opacity-100'}`}>
                        <span className="font-tabi absolute text-white  top-0 -m-10 scale-0 group-hover:scale-100 select-none transition-all">Next</span>
                        <i class="fa-solid fa-chevron-right "></i>
                    </div>
                </div>

                {/* socials */}

                <div className="flex justify-around opacity-100 gap-10">


                    <Icon iconClass={"font-tabi absolute text-white top-0 -m-10 scale-0 group-hover:scale-100 transition-all"} icon={<svg className="hover:fill-white" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                                    width="2rem" height="2.5rem" viewBox="0 0 150.38 88.986" >
                                <path d="M148.931,62.356l-20.848-16.384c-1.276-1-1.276-2.642,0-3.645l20.848-16.381c1.279-1.001,1.812-2.694,1.187-3.76
                                    c-0.626-1.061-2.374-1.44-3.88-0.838l-24.789,9.873c-1.508,0.603-2.928-0.222-3.154-1.831l-3.727-26.467
                                    C114.34,1.317,113.132,0,111.879,0c-1.248,0-2.457,1.317-2.681,2.925l-3.73,26.467c-0.228,1.609-1.646,2.434-3.155,1.831
                                    l-24.38-9.711c-1.512-0.602-3.975-0.602-5.483,0l-24.383,9.711c-1.508,0.603-2.928-0.222-3.154-1.831L41.186,2.925
                                    C40.957,1.317,39.748,0,38.499,0c-1.251,0-2.462,1.317-2.687,2.925l-3.729,26.467c-0.227,1.609-1.646,2.434-3.154,1.831L4.14,21.35
                                    c-1.507-0.603-3.252-0.223-3.878,0.838c-0.625,1.066-0.092,2.759,1.184,3.76l20.849,16.381c1.278,1.002,1.278,2.644,0,3.645
                                    L1.445,62.356c-1.276,1.002-1.809,2.796-1.184,3.985c0.626,1.188,2.371,1.667,3.876,1.063l24.567-9.866
                                    c1.509-0.603,2.914,0.218,3.125,1.828l3.547,26.696c0.214,1.607,1.618,2.923,3.121,2.923c1.499,0,2.904-1.315,3.119-2.923
                                    l3.55-26.696c0.211-1.61,1.621-2.431,3.122-1.828l24.164,9.698c1.505,0.606,3.968,0.606,5.476,0l24.16-9.698
                                    c1.504-0.603,2.91,0.218,3.125,1.828l3.55,26.696c0.212,1.607,1.617,2.923,3.115,2.923c1.502,0,2.907-1.315,3.121-2.923
                                    l3.548-26.696c0.217-1.61,1.62-2.431,3.125-1.828l24.568,9.866c1.502,0.604,3.25,0.125,3.876-1.063
                                    C150.743,65.152,150.21,63.358,148.931,62.356z M95.888,46.181L77.528,60.315c-1.285,0.99-3.393,0.99-4.674,0L54.491,46.181
                                    c-1.285-0.992-1.295-2.622-0.02-3.626l18.399-14.493c1.274-1.005,3.363-1.005,4.638,0l18.4,14.493
                                    C97.185,43.559,97.175,45.189,95.888,46.181z"/>
                            </svg>} route={'https://www.are.na/darko-cejkov-t-ekov-cheykov'} text={'Are.na'} external/>


                    <Icon icon={<i class="fa-brands fa-github h-100 w-100"></i>} iconClass={"font-tabi absolute text-white top-0 -m-10 scale-0 group-hover:scale-100 transition-all"} route={'https://github.com/darkocejkov'} text={'GitHub'} external/>

                    {/* <div className={`rounded-lg w-10 h-10  flex justify-center items-center hover:bg-slate-900 hover:text-white transition-all group`}>
                        <a href="https://github.com/darkocejkov" target={'_blank'}>
                            <i class="fa-brands fa-github h-100 w-100"></i>
                        </a>
                        <span className="font-tabi absolute text-white  top-0 -m-10 scale-0 group-hover:scale-100 transition-all">GitHub</span>
                    </div> */}
                </div>

        </div>
    )

}

const Icon = ({icon, route, iconClass, text, value, setter, external, fn}) => (
    <div className={`rounded-lg w-10 h-10 flex justify-center hover:white-shadow items-center ${value === route ? 'bg-slate-900 text-white hover:bg-transparent hover:text-black' : 'hover:bg-slate-900 hover:text-white'} transition-all group`}>
        {route
            ? (
                external
                    ? (
                        <a href={route} target='_blank' rel='noreferrer'>
                            {icon}
                            {/* <i className="fa-regular fa-face-smile  h-100 w-100"></i> */}
                        </a>
                    )
                    : (
                        <Link to={`/${route}`}  onClick={() => setter(route)}>
                            {icon}
                            {/* <i className="fa-regular fa-face-smile  h-100 w-100"></i> */}
                        </Link>
                    )
                
            )
            : (
                <span onClick={() => fn()}>{icon}</span>
            )}
        
        <span className={iconClass}>{text}</span>
    </div>
)
