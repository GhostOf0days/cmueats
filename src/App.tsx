import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Navbar from './components/Navbar';
import ListPage from './pages/ListPage';
import MapPage from './pages/MapPage';
import NotFoundPage from './pages/NotFoundPage';
import {
	queryLocations,
	getExtendedLocationData as getExtraLocationData,
	LocationChecker,
} from './util/queryLocations';
import './App.css';
import {
	IReadOnlyLocation_FromAPI_PostProcessed,
	IReadOnlyLocation_ExtraData_Map,
} from './types/locationTypes';

const CMU_EATS_API_URL = 'https://dining-api-production.up.railway.app/locations';
// for debugging purposes (note that you need an example-response.json file in the /public folder)
// const CMU_EATS_API_URL = 'http://localhost:5173/example-response.json';
// for debugging purposes (note that you need an example-response.json file in the /public folder)
// const CMU_EATS_API_URL = 'http://localhost:5010/locations';

function App() {
	// Load locations
	const [locations, setLocations] =
		useState<IReadOnlyLocation_FromAPI_PostProcessed[]>();
	const [extraLocationData, setExtraLocationData] =
		useState<IReadOnlyLocation_ExtraData_Map>();
	useEffect(() => {
		queryLocations(CMU_EATS_API_URL).then((parsedLocations) => {
			setLocations(parsedLocations);
			setExtraLocationData(getExtraLocationData(parsedLocations));
			// set extended data in same render to keep the two things in sync
		});
	}, []);

	// periodically update extra location data
	useEffect(() => {
		const intervalId = setInterval(
			() => setExtraLocationData(getExtraLocationData(locations)),
			1000,
		);
		setExtraLocationData(getExtraLocationData(locations));
		return () => clearInterval(intervalId);
	}, [locations]);

	// Auto-refresh the page when the user goes online after previously being offline
	useEffect(() => {
		function handleOnline() {
			if (navigator.onLine) {
				// Refresh the page
				window.location.reload();
			}
		}

		window.addEventListener('online', handleOnline);

		return () => window.removeEventListener('online', handleOnline);
	}, []);

	new LocationChecker(locations).assertExtraDataInSync(extraLocationData);

	return (
		<React.StrictMode>
			<BrowserRouter>
				<div className="App">
					<div className="MainContent">
						<div className="AdBanner">
							CMUEats is now up to date with the official dining
							website! Sorry for the inconvenience. &gt;_&lt;
						</div>
						<Routes>
							<Route
								path="/"
								element={
									<ListPage
										extraLocationData={extraLocationData}
										locations={locations}
									/>
								}
							/>
							<Route
								path="/map"
								element={
									<MapPage
										locations={locations}
										extraLocationData={extraLocationData}
									/>
								}
							/>
							<Route path="*" element={<NotFoundPage />} />
						</Routes>
					</div>
					<Navbar />
				</div>
			</BrowserRouter>
		</React.StrictMode>
	);
}

export default App;
