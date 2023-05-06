import {BrowserRouter as Router} from 'react-router-dom'
import React from "react";

import Apex from "./Views/Apex.tsx";

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