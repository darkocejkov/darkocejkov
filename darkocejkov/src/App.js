import React, { useState, useEffect } from 'react';
import {BrowserRouter, Routes, Route, Link} from 'react-router-dom'

import Title from './Components/Title'
import Navbar from './Components/Navbar'


function App() {

	// npm run start

	useEffect(() => {
		document.title = "Darko Cejkov"
	}, [])


	const [page, setPage] = useState('home')
	const [pull, setPull] = useState(false)
	
	const [playing, setPlaying] = useState(true)

	return (
		<div className='h-screen w-screen fixed top-0 bg-gradient-to-r from-cyan-500 to-blue-500'>
			<BrowserRouter>

				<div className="grid grid-cols-1 grid-rows-2 h-full w-full transition-all">

					<Title pull={pull}/>

					<Routes>

						<Route exact path="/education" element={
							<div className={`transition-all ${pull ? 'opacity-100' : 'opacity-0'} transition-opacity flex justify-center`}>
								<div className="w-fit h-80 overflow-y-auto p-5">
									<h1 className="text-4xl font-tabi dark:text-white">
										Honors BSc.&nbsp;
										<span className="group hover:bg-opacity-80 bg-black bg-opacity-20 rounded-lg p-2 transition-colors">Computer Science
											<span className="group-hover:opacity-100 opacity-0 transition-opacity absolute right-[43%] -mt-14">
												GPA: <span className="font-sectraDisplay">8.3</span> of <span className="font-sectraDisplay">12</span>
											</span>
										</span> +&nbsp;
										<span className="group hover:bg-opacity-80 bg-black bg-opacity-20 rounded-lg p-2 transition-colors">Psychology
											<span className="group-hover:opacity-100 opacity-0 transition-opacity absolute right-[25%] -mt-14">
												GPA: <span className="font-sectraDisplay">9</span> of <span className="font-sectraDisplay">12</span>
											</span>
										</span>
									</h1>
									

									<h3 className="mt-2 ml-16 text-2xl font-sectra">Wilfrid <span className="text-[#320071] decoration-[#f2a900] hover:text-[#f2a900] hover:decoration-[#320071] underline transition-colors">Laurier</span> University <i class="fa-duotone fa-leaf-maple mx-3 hover:-rotate-90 text-text-[#320071] transition-all"></i></h3>
								</div>
							</div>
						} />

						<Route exact path="/experience" element={
							// <div className='flex justify-center items-center'>

								<div className={`transition-all ${pull ? 'opacity-100' : 'opacity-0'} transition-opacity flex justify-center`}>
									<div className="w-fit h-80 overflow-y-auto p-5 dark:text-white light:text-black">
										<h1 className="text-2xl mb-3 flex justify-center">
											<a href="https://www.vvc.ca" target={'_blank'} className="font-tabi underline">
												Van Valkenburg Communications
											</a> <i class="fa-duotone fa-photo-film mx-2"></i>
										</h1>
										<h1 className="text-2xl mb-3 flex justify-center">
											<a href="https://www.linkedin.com/company/traction-on-demand/" className="font-tabi underline">
											Traction on Demand. (Now acquired by Salesforce)
											</a>
											<i class="fa-duotone fa-cloud-rainbow mx-2"></i>
										</h1>
										<h1 className="text-2xl mb-3 flex justify-center">
											<a href="https://www.linkedin.com/company/traction-on-demand/" className="font-tabi underline">
											Traction on Demand. (Now acquired by Salesforce)
											</a>
											<i class="fa-duotone fa-cloud-rainbow mx-2"></i>
										</h1>
										<h1 className="text-2xl mb-3 flex justify-center">
											<a href="https://www.google.com/search?q=vvc&sourceid=chrome&ie=UTF-8" target={'_blank'} className="font-tabi underline">
												Van Valkenburg Communications
											</a> <i class="fa-duotone fa-photo-film mx-2"></i>
										</h1>
										<h1 className="text-2xl mb-3 flex justify-center">
											<a href="https://www.linkedin.com/company/traction-on-demand/" className="font-tabi underline">
											Traction on Demand. (Now acquired by Salesforce)
											</a>
											<i class="fa-duotone fa-cloud-rainbow mx-2"></i>
										</h1>
										<h1 className="text-2xl mb-3 flex justify-center">
											<a href="https://www.linkedin.com/company/traction-on-demand/" className="font-tabi underline">
											Traction on Demand. (Now acquired by Salesforce)
											</a>
											<i class="fa-duotone fa-cloud-rainbow mx-2"></i>
										</h1>
										<h1 className="text-2xl mb-3 flex justify-center">
											<a href="https://www.google.com/search?q=vvc&sourceid=chrome&ie=UTF-8" target={'_blank'} className="font-tabi underline">
												Van Valkenburg Communications
											</a> <i class="fa-duotone fa-photo-film mx-2"></i>
										</h1>
										<h1 className="text-2xl mb-3 flex justify-center">
											<a href="https://www.linkedin.com/company/traction-on-demand/" className="font-tabi underline">
											Traction on Demand. (Now acquired by Salesforce)
											</a>
											<i class="fa-duotone fa-cloud-rainbow mx-2"></i>
										</h1>
										<h1 className="text-2xl mb-3 flex justify-center">
											<a href="https://www.linkedin.com/company/traction-on-demand/" className="font-tabi underline">
											Traction on Demand. (Now acquired by Salesforce)
											</a>
											<i class="fa-duotone fa-cloud-rainbow mx-2"></i>
										</h1>
										<h1 className="text-2xl mb-3 flex justify-center">
											<a href="https://www.google.com/search?q=vvc&sourceid=chrome&ie=UTF-8" target={'_blank'} className="font-tabi underline">
												Van Valkenburg Communications
											</a> <i class="fa-duotone fa-photo-film mx-2"></i>
										</h1>
										<h1 className="text-2xl mb-3 flex justify-center">
											<a href="https://www.linkedin.com/company/traction-on-demand/" className="font-tabi underline">
											Traction on Demand. (Now acquired by Salesforce)
											</a>
											<i class="fa-duotone fa-cloud-rainbow mx-2"></i>
										</h1>
										<h1 className="text-2xl mb-3 flex justify-center">
											<a href="https://www.linkedin.com/company/traction-on-demand/" className="font-tabi underline">
											Traction on Demand. (Now acquired by Salesforce)
											</a>
											<i class="fa-duotone fa-cloud-rainbow mx-2"></i>
										</h1>
									</div>
								</div>
						} />

						<Route exact path="/personal" element={
							<div className='text-5xl flex justify-center items-center'>
								Fun.
							</div>
						} />

					</Routes>

				</div>

				<Navbar setPull={setPull} playing={playing} setPlaying={setPlaying}/>

			</BrowserRouter>
		</div>
	);
}

export default App;
