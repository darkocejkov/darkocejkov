import React, { useState, useEffect } from 'react';
import {BrowserRouter, Routes, Route, Link} from 'react-router-dom'

function App() {

	// npm run start

	return (
		<div className='h-screen w-screen bg-gradient-to-r from-cyan-500 to-blue-500'>
		
		<BrowserRouter>
			<Routes>
				<Route exact path="/" element={
					<div className='text-5xl h-full w-full flex justify-center items-center'>
						Darko Cejkov
					</div>
				} />

				<Route exact path="/edu" element={
					<div className='text-5xl h-full w-full flex justify-center items-center'>
						Honors BSc.
					</div>
				} />

				<Route exact path="/exp" element={
					<div className='text-5xl h-full w-full flex justify-center items-center'>
						VVC.
					</div>
				} />

			</Routes>
		</BrowserRouter>
		</div>
	);
}

export default App;
