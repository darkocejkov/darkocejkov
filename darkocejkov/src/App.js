import React, {useState, useEffect, useDebugValue, useLayoutEffect} from 'react';
import {BrowserRouter, Routes, Route, Link} from 'react-router-dom'

import Marquee from "react-fast-marquee";

import Title from './Components/Title'
import Navbar from './Components/Navbar'
import Background from './Components/Background';

import Education from './Pages/Education';
import Experience from './Pages/Experience';
import Personal from './Pages/Personal';
import {Banner, LabelledButton, ScrollingText} from "./Components/Basics";

import {ScrollView} from "./Views/Scroll";
import {PhotoGrid, SuspenseGrid} from "./Views/PhotoGrid";
import {CheatSheet} from "./Views/CheatSheet";
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

			{/*<Banner>*/}
			{/*	⚒️ This application is under active construction ⚒️*/}
			{/*</Banner>*/}


			<div className={'fixed top-0 left-0 z-20 h-screen w-screen pointer-events-none'}>

				<div className={'flex flex-col p-2 gap-2'}>

					<div className={'rounded-xl overflow-hidden backdrop-blur-sm p-1 bg-slate-900/70 text-white flex justify-center lg:items-center uppercase'}>

						<Marquee gradient={false} className={'flex gap-5'}>
							<div className={'flex gap-5'}>
								<span className={'font-tabi'}>
								This application is under active construction ⚒️
								</span>
								{/*<span className={'font-aeonik'}>*/}
								{/*	This application is under active construction ⚒️*/}
								{/*</span>*/}
								{/*	<span className={'font-rubik'}>*/}
								{/*	This application is under active construction ⚒️*/}
								{/*</span>*/}
								{/*	<span className={'font-maru'}>*/}
								{/*	This application is under active construction ⚒️*/}
								{/*</span>*/}
							</div>
						</Marquee>
						{/*<ScrollingText text={"This application is under active construction ⚒️"}/>*/}
						{/*<ScrollingText>*/}
						{/*	<span>*/}
						{/*		This application is under active construction ⚒️*/}
						{/*	</span>*/}
						{/*</ScrollingText>*/}
						{/*⚒️ This application is under active construction ⚒️*/}
					</div>

						<div className={'w-fit flex gap-4 flex-col font-maru pointer-events-auto'}>

							<LabelledButton dir={'right'} tabIndex={1} active={view === 0} onClick={() => setView(0)} label={'Scroll Design'}>
								<small>0</small>
							</LabelledButton>
							<LabelledButton dir={'right'} tabIndex={1} active={view === 1} onClick={() => setView(1)} label={'Original Design'}>
								<small>1</small>
							</LabelledButton>
							<LabelledButton dir={'right'} tabIndex={1} active={view === 2} onClick={() => setView(2)} label={'Image Grid'}>
								<small>2</small>
							</LabelledButton>
							<LabelledButton dir={'right'} tabIndex={1} active={view === 3} onClick={() => setView(3)} label={'Reference Sheet'}>
								<small>3</small>
							</LabelledButton>
							{/*<LabelledButton dir={'right'} tabIndex=1 active={view === 3} onClick={() => setView(3)} label={'Original'}>*/}
							{/*	<small>3</small>*/}
							{/*</LabelledButton>*/}

							{/*<button onClick={() => setView(0)} className={`${view === 0 ? 'rounded-xl' : 'rounded-sm'} flex items-center justify-center hover:rounded-3xl transition-rounded bg-slate-900 opacity-70 text-white md:h-10 md:w-10 h-5 w-5`}>*/}
							{/*	<small>0</small>*/}
							{/*</button>*/}
							{/*<button onClick={() => setView(1)} className={`${view === 1 ? 'rounded-xl' : 'rounded-sm'} flex items-center justify-center hover:rounded-3xl transition-rounded bg-slate-900 opacity-70 text-white md:h-10 md:w-10 h-5 w-5`}>*/}
							{/*	<small>1</small>*/}
							{/*</button>*/}
							{/*<button onClick={() => setView(2)} className={`${view === 2 ? 'rounded-xl' : 'rounded-sm'} flex items-center justify-center hover:rounded-3xl transition-rounded bg-slate-900 opacity-70 text-white md:h-10 md:w-10 h-5 w-5`}>*/}
							{/*	<small>2</small>*/}
							{/*</button>*/}
						</div>


				</div>



			</div>


			{/*<div className={'fixed top-[4rem] left-[.5rem] z-50 flex gap-4 flex-col md:flex-row'}>*/}
			{/*	<button onClick={() => setView(0)} className={`${view === 0 ? 'rounded-xl' : 'rounded-sm'} flex items-center justify-center hover:rounded-3xl transition-rounded bg-slate-900 opacity-70 text-white md:h-10 md:w-10 h-5 w-5`}>*/}
			{/*		<small>0</small>*/}
			{/*	</button>*/}
			{/*	<button onClick={() => setView(1)} className={`${view === 1 ? 'rounded-xl' : 'rounded-sm'} flex items-center justify-center hover:rounded-3xl transition-rounded bg-slate-900 opacity-70 text-white md:h-10 md:w-10 h-5 w-5`}>*/}
			{/*		<small>1</small>*/}
			{/*	</button>*/}
			{/*	<button onClick={() => setView(2)} className={`${view === 2 ? 'rounded-xl' : 'rounded-sm'} flex items-center justify-center hover:rounded-3xl transition-rounded bg-slate-900 opacity-70 text-white md:h-10 md:w-10 h-5 w-5`}>*/}
			{/*		<small>2</small>*/}
			{/*	</button>*/}
			{/*</div>*/}

			{view === 1 &&
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
			}

			{view === 0 &&
				<ScrollView />
			}

			{view === 2 &&
				<PhotoGrid />
			}

			{view === 3 &&
				<CheatSheet />
			}

		</>
	);
}

export default App;
