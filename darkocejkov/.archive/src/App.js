import {BrowserRouter as Router} from 'react-router-dom'
import React from "react";

import Apex from "./Views/Apex.tsx";


// import "./fonts/tabi/Tabi-Regular.ttf"
// import "./fonts/tabi/Tabi-Super.ttf"

import {
	QueryClient,
	QueryClientProvider,
} from '@tanstack/react-query'

const queryClient = new QueryClient()

export default function App() {

	return (
		<Router>
			<QueryClientProvider client={queryClient}>
				<Apex/>
			</QueryClientProvider>
		</Router>
	);
}