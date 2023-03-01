import React, {useState, useEffect} from "react";

import Background from "../Components/Background";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Title from "../Components/Title";
import Education from "../Pages/Education";
import Experience from "../Pages/Experience";
import Personal from "../Pages/Personal";
import Navbar from "../Components/Navbar";


export const OriginalView = () => {

    const [page, setPage] = useState('home')
    const [pull, setPull] = useState(false)

    const [playing, setPlaying] = useState(false)
    const [hideBg, setHideBg] = useState(false)
    const [showFront, setShowFront] = useState(false)


    return(
        <div className='h-screen w-screen fixed top-0 bg-gradient-to-r from-cyan-500 to-blue-500'>

            {hideBg === false &&
                <Background play={playing} hide={hideBg} showFront={showFront} className={'height-minus-nav'}/>
            }

            <BrowserRouter>

                <div className="grid grid-cols-1 grid-rows-2 h-full w-full transition-all z-50">

                    <Title pull={pull}/>

                    <Routes>

                        <Route exact path="/education" element={
                            <Education />
                        } />

                        <Route exact path="/experience" element={
                            <Experience />
                        } />

                        <Route exact path="/personal" element={
                            <Personal />
                        } />

                    </Routes>

                </div>

                <Navbar setPull={setPull} playing={playing} setPlaying={setPlaying} hideBg={hideBg} setHideBg={setHideBg} setShowFront={setShowFront} showFront={showFront}/>

            </BrowserRouter>
        </div>
    )
}