import React, {useState, useEffect, useDebugValue, useLayoutEffect, useRef, useCallback} from 'react';
import {BrowserRouter, Routes, Route, Link} from 'react-router-dom'

import Marquee from "react-fast-marquee";

import Title from './Components/Title'
import Navbar from './Components/Navbar'
import Background, {useSketch} from './Components/Background';

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



	const views = [
		{
			title: 'Scroll Design',
			component: <ScrollView  />,
			icon: <i className="fa-thin fa-scroll"></i>,
		},
		{
			title: 'Image Grids',
			component: <PhotoGrid />,
			icon: <i className="fa-thin fa-grid"></i>,
		},
		{
			title: 'Reference Sheet',
			component: <CheatSheet />,
			icon: <i className="fa-thin fa-cookie"></i>,
		},
		{
			title: 'Flexbox Playground',
			component: <FlexView />,
			icon: <i className="fa-thin fa-boxes-stacked"></i>,
		},
	]


	return (
		<>

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
							</div>
						</Marquee>
					</div>

					<div className={'w-fit flex gap-4 flex-col font-maru pointer-events-auto'}>
						{views.map((x, i) => {
							return(
								<LabelledButton dir={'right'} tabIndex={1} active={view === i} onClick={() => setView(i)} label={x.title || `View ${i}`}>
									<small>
										{x.icon || i}
									</small>
								</LabelledButton>
							)
						})}
					</div>

					<div className={'w-fit mt-6 flex gap-4 flex-col font-maru pointer-events-auto'}>
						<button onClick={() => setShowOffcanvas(true)} className={'bg-orange-400 text-black h-10 w-10 relative group'}>
							<i className="fa-solid fa-terminal fa-sm"></i>
							<span className={`font-tabi p-2 rounded-xl bg-slate-900/30 text-shadow absolute text-white -top-1/2 right-0 group-hover:translate-x-[110%] scale-0 group-hover:scale-100 -translate-x-full transition-all`}>Git Commits & Activity</span>
						</button>
					</div>
				</div>
			</div>

			{views[view].component}
		</>
	);
}

export default App;
