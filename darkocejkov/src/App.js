import React, {useState, useEffect, useDebugValue, useLayoutEffect, useRef, useCallback} from 'react';
import {BrowserRouter, Routes, Route, Link} from 'react-router-dom'

import Marquee from "react-fast-marquee";

import Title from './Components/Title'
import Navbar from './Components/Navbar'
import Background from './Components/Background';

import Education from './Pages/Education';
import Experience from './Pages/Experience';
import Personal from './Pages/Personal';
import {Banner, Drawer, GithubCal, LabelledButton, OffcanvasDrawer, ScrollingText} from "./Components/Basics";

import {ScrollView} from "./Views/Scroll";
import {PhotoGrid, SuspenseGrid} from "./Views/PhotoGrid";
import {CheatSheet} from "./Views/CheatSheet";

import GitHubCalendar from "react-github-calendar";
import {FlexView} from "./Views/Flex";
import {OriginalView} from "./Views/Original";

function App() {

	useEffect(() => {
		document.title = "Darko Cejkov → Fullstack Developer"
	}, [])


	const [view, setView] = useState(0)

	const [showOffcanvas, setShowOffcanvas] = useState(false)

	return (
		<>

			{/*<Banner>*/}
			{/*	⚒️ This application is under active construction ⚒️*/}
			{/*</Banner>*/}

			<OffcanvasDrawer show={showOffcanvas} setShow={setShowOffcanvas}>
				<div className={'p-12 flex flex-col items-center justify-center'}>

					<GitHubCalendar username={'darkocejkov'} />

				</div>
			</OffcanvasDrawer>


			<div className={'fixed top-0 left-0 z-[100] h-screen w-screen pointer-events-none'}>

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
						<LabelledButton dir={'right'} tabIndex={1} active={view === 4} onClick={() => setView(4)} label={'Flexbox Playground'}>
							<small>4</small>
						</LabelledButton>
					</div>

					<div className={'w-fit mt-6 flex gap-4 flex-col font-maru pointer-events-auto'}>
						<button onClick={() => setShowOffcanvas(true)} className={'bg-orange-400 text-black md:h-10 md:w-10 h-5 w-5 relative group'}>
							<i className="fa-solid fa-terminal fa-sm"></i>

							<span className={`font-tabi p-2 rounded-xl bg-slate-900/30 text-shadow absolute text-white -top-1/2 right-0 group-hover:translate-x-[110%] scale-0 group-hover:scale-100 -translate-x-full transition-all`}>Git Commits & Activity</span>

						</button>
					</div>
				</div>
			</div>


			{view === 1 &&
				<OriginalView />
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

			{view === 4 &&
				<FlexView />
			}

		</>
	);
}

export default App;
