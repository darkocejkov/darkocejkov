import React, {useState, useEffect, useDebugValue, useLayoutEffect} from 'react';
import {BrowserRouter, Routes, Route, Link} from 'react-router-dom'

import Title from './Components/Title'
import Navbar from './Components/Navbar'
import Background from './Components/Background';

import Education from './Pages/Education';
import Experience from './Pages/Experience';
import Personal from './Pages/Personal';
import {Banner} from "./Components/Basics";

import {ScrollView} from "./Views/Scroll";
function App() {

	useEffect(() => {
		document.title = "Darko Cejkov"
	}, [])

	const [page, setPage] = useState('home')
	const [pull, setPull] = useState(false)
	
	const [playing, setPlaying] = useState(false)
	const [hideBg, setHideBg] = useState(false)
	const [showFront, setShowFront] = useState(false)

	const [view, setView] = useState(0)

	// const views = {
	// 	[]
	// }

	const handleView = (v) => {

	}



	return (
		<>

			<Banner>
				⚒️ This application is under active construction ⚒️
			</Banner>



			<div className={'fixed top-[4rem] left-[.5rem] z-50 flex gap-4'}>

				<button onClick={() => setView(0)} className={`${view === 0 ? 'rounded-xl' : 'rounded-sm'} hover:rounded-3xl transition-rounded bg-slate-900 opacity-70 text-white h-10 w-10`}>
					<small>0</small>
				</button>
				<button onClick={() => setView(1)} className={`${view === 1 ? 'rounded-xl' : 'rounded-sm'} hover:rounded-3xl transition-rounded bg-slate-900 opacity-70 text-white h-10 w-10`}>
					<small>1</small>
				</button>
				<button onClick={() => setView(2)} className={`${view === 2 ? 'rounded-xl' : 'rounded-sm'} hover:rounded-3xl transition-rounded bg-slate-900 opacity-70 text-white h-10 w-10`}>
					<small>2</small>
				</button>
			</div>

			{view === 0 &&
				<div className='h-screen w-screen fixed top-0 bg-gradient-to-r from-cyan-500 to-blue-500'>

					{hideBg === false &&
						<Background play={playing} hide={hideBg} showFront={showFront}/>
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
			}

			{view === 1 &&
				<ScrollView />
			}

		</>
	);
}

export default App;
