import { Typography, Grid, Alert, styled } from '@mui/material';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import Fuse, { IFuseOptions } from 'fuse.js';
import EateryCard from '../components/EateryCard';
import EateryCardSkeleton from '../components/EateryCardSkeleton';
import NoResultsError from '../components/NoResultsError';
import { getGreetings } from '../util/greeting';
import './ListPage.css';
import {
	IReadOnlyLocation_ExtraData_Map,
	IReadOnlyLocation_FromAPI_PostProcessed,
	LocationState,
} from '../types/locationTypes';
import assert from '../util/assert';

import SelectLocation from '../components/SelectLocation';
import { useTheme } from '../ThemeProvider';
import IS_MIKU_DAY from '../util/constants';
import mikuKeychainUrl from '../assets/miku/miku-keychain.svg';
import footerMikuUrl from '../assets/miku/miku2.png';
import mikuBgUrl from '../assets/miku/miku.jpg';

const LogoText = styled(Typography)({
	color: 'var(--logo-first-half)',
	padding: 0,
	fontFamily: 'var(--text-primary-font)',
	fontWeight: 800,
});

const FooterText = styled(Typography)({
	color: 'var(--text-primary)',
	marginBottom: 20,
	fontSize: 16,
});

const StyledAlert = styled(Alert)({
	backgroundColor: 'var(--main-bg-accent)',
	color: 'var(--text-primary)',
});

function getPittsburghTime() {
	const now = new Date();
	const options: Intl.DateTimeFormatOptions = {
		timeZone: 'America/New_York',
		hour: 'numeric',
		minute: 'numeric',
		second: 'numeric',
		timeZoneName: 'short',
	};
	return now.toLocaleString('en-US', options);
}

const FUSE_OPTIONS: IFuseOptions<IReadOnlyLocation_FromAPI_PostProcessed> = {
	// keys to perform the search on
	keys: ['name', 'location', 'shortDescription', 'description'],
	ignoreLocation: true,
	threshold: 0.2,
};

function ListPage({
	extraLocationData,
	locations,
}: {
	extraLocationData: IReadOnlyLocation_ExtraData_Map | undefined;
	locations: IReadOnlyLocation_FromAPI_PostProcessed[] | undefined;
}) {
	const { theme, updateTheme } = useTheme();
	const { mobileGreeting, desktopGreeting } = useMemo(
		() => getGreetings(new Date().getHours(), { isMikuDay: IS_MIKU_DAY }),
		[],
	);

	const fuse = useMemo(
		() => new Fuse(locations ?? [], FUSE_OPTIONS),
		[locations],
	); // only update fuse when the raw data actually changes (we don't care about the status (like time until close) changing)

	const [searchQuery, setSearchQuery] = useState('');
	const [shouldAnimateCards, setShouldAnimateCards] = useState(true);
	const processedSearchQuery = searchQuery.trim().toLowerCase();

	const [locationFilterSearchQuery, setLocationFilterSearchQuery] =
		useState('');

	const filteredLocations = useMemo(() => {
		const searchResults =
			processedSearchQuery.length === 0
				? (locations ?? [])
				: fuse
						.search(processedSearchQuery)
						.map((result) => result.item);

		const locationFilterResults = new Set(
			fuse
				.search(locationFilterSearchQuery)
				.map((results) => results.item),
		);

		const intersection =
			locationFilterSearchQuery === ''
				? searchResults
				: searchResults.filter((item) =>
						locationFilterResults.has(item),
					);

		return intersection;
	}, [fuse, searchQuery, locationFilterSearchQuery]);

	// const [showAlert, setShowAlert] = useState(true);
	const [showOfflineAlert, setShowOfflineAlert] = useState(!navigator.onLine);

	// Load the search query from the URL, if any
	useLayoutEffect(() => {
		const urlQuery = new URLSearchParams(window.location.search).get(
			'search',
		);
		if (urlQuery) {
			setSearchQuery(urlQuery);
		}
	}, []);

	// Monitor for the user being online
	useEffect(() => {
		const handleOnlineStatus = () => {
			setShowOfflineAlert(!navigator.onLine);
		};

		window.addEventListener('online', handleOnlineStatus);
		window.addEventListener('offline', handleOnlineStatus);

		return () => {
			window.removeEventListener('online', handleOnlineStatus);
			window.removeEventListener('offline', handleOnlineStatus);
		};
	}, []);

	return (
		<div className="ListPage">
			{/*  showAlert &&
      <StyledAlert severity="info" className="announcement" onClose={() => setShowAlert(false)}>
        🚧 [Issue Description]
        Please remain patient while we work on a fix. Thank you. 🚧
      </StyledAlert>  */}

			{showOfflineAlert && (
				<StyledAlert
					severity="info"
					className="announcement"
					onClose={() => setShowOfflineAlert(false)}
				>
					🚫🌐 We are temporarily unable to provide the latest
					available dining information or the map while you are
					offline. We apologize for any inconvenience. 🌐🚫
				</StyledAlert>
			)}
			<div className="ListPage__container">
				<header className="Locations-header">
					<div className="Locations-header__greeting-container">
						<h3 className="Locations-header__greeting Locations-header__greeting--desktop">
							{desktopGreeting}
						</h3>
						<h3 className="Locations-header__greeting Locations-header__greeting--mobile">
							{mobileGreeting}
						</h3>
					</div>
					<input
						className="Locations-search"
						type="search"
						value={searchQuery}
						onChange={(e) => {
							setSearchQuery(e.target.value);
							setShouldAnimateCards(false);
						}}
						placeholder="Search"
					/>
					<SelectLocation
						setlocationFilterSearchQuery={
							setLocationFilterSearchQuery
						}
						locations={locations}
					/>
					{IS_MIKU_DAY && (
						<button
							onClick={() =>
								updateTheme(theme === 'miku' ? 'none' : 'miku')
							}
							onTouchEnd={(e) => {
								e.stopPropagation();
								e.preventDefault();
								updateTheme(theme === 'miku' ? 'none' : 'miku');
							}}
							type="button"
							className="Locations-header__miku-toggle"
						>
							<img src={mikuKeychainUrl} alt="click me!" />
						</button>
					)}
				</header>
				{(() => {
					if (
						locations === undefined ||
						extraLocationData === undefined
					) {
						// Display skeleton cards while loading
						return (
							<Grid container spacing={2}>
								{Array(36)
									.fill(null)
									.map((_, index) => (
										<EateryCardSkeleton
											// we can make an exception here since this array won't change
											key={index} // eslint-disable-line react/no-array-index-key
											index={index}
										/>
									))}
							</Grid>
						);
					}
					if (locations.length === 0)
						return (
							<p className="locations__error-text">
								Oops! We received an invalid API response (or no
								data at all). If this problem persists, please
								let us know.
							</p>
						);
					if (filteredLocations.length === 0)
						return (
							<NoResultsError
								onClear={() => setSearchQuery('')}
							/>
						);
					return (
						// suboptimal rendering (with extra `key` prop) so that the card blinking animations stay in sync.
						// we can't simply just reset the animation startTime in each card on first render,
						// because sometimes the cards will get re-ordered, which doesn't trigger a re-render but does reset the CSS animation. Annoying, I know.
						<Grid container spacing={2} key={searchQuery}>
							{filteredLocations
								.map((location) => ({
									...location,
									...extraLocationData[location.conceptId], // add on our extra data here
								}))
								.sort((location1, location2) => {
									const state1 = location1.locationState;
									const state2 = location2.locationState;
									if (state1 !== state2)
										return state1 - state2;
									// this if statement is janky but otherwise TS won't
									// realize that the timeUntil property exists on both l1 and l2
									if (
										location1.closedLongTerm ||
										location2.closedLongTerm
									) {
										assert(
											location1.closedLongTerm &&
												location2.closedLongTerm,
										);
										return location1.name.localeCompare(
											location2.name,
										);
									}
									// flip sorting order if locations are both open or opening soon
									return (
										(state1 === LocationState.OPEN ||
										state1 === LocationState.OPENS_SOON
											? -1
											: 1) *
										(location1.timeUntil -
											location2.timeUntil)
									);
								})
								.map((location, i) => (
									<EateryCard
										location={location}
										key={location.conceptId}
										index={i}
										animate={shouldAnimateCards}
										partOfMainGrid
									/>
								))}
						</Grid>
					);
				})()}
			</div>
			<footer className="footer">
				{theme === 'miku' ? (
					<FooterText>
						Blue hair, blue tie, hiding in your wifi
						<br />
						All times are displayed in Pittsburgh local time (
						{getPittsburghTime()}).
					</FooterText>
				) : (
					<>
						<FooterText>
							All times are displayed in Pittsburgh local time (
							{getPittsburghTime()}).
						</FooterText>
						<FooterText>
							If you encounter any problems, please contact{' '}
							<a
								href="mailto:jaisal.patel45@gmail.com"
								style={{ color: 'white' }}
							>
								Jaisal
							</a>
							{', '}
							<a
								href="mailto:ericxu@andrew.cmu.edu"
								style={{ color: 'white' }}
							>
								Eric
							</a>
							{', '}
							or{' '}
							<a
								href="mailto:laki@andrew.cmu.edu"
								style={{ color: 'white' }}
							>
								Laasya
							</a>
							.
						</FooterText>
						<FooterText>
							Alternatively, fill out our{' '}
							<a
								href="https://forms.gle/7JxgdgDhWMznQJdk9"
								style={{ color: 'white' }}
							>
								feedback form
							</a>
							.
						</FooterText>
						<FooterText>
							To provide feedback on your dining experience,
							please contact{' '}
							<a
								href="mailto:dining@andrew.cmu.edu"
								style={{ color: 'white' }}
							>
								Dining Services
							</a>{' '}
							or take the{' '}
							<a
								href="https://forms.gle/fTnWrS7jkTFRB14DA"
								style={{ color: 'white' }}
							>
								dining survey
							</a>
							.
						</FooterText>
						<FooterText>
							Made with ❤️ by{' '}
							<a
								href="https://scottylabs.org"
								style={{ color: 'white' }}
							>
								ScottyLabs
							</a>
							. (Disclaimer: This is not the official{' '}
							<a
								href="https://apps.studentaffairs.cmu.edu/dining/conceptinfo/Schedule"
								style={{ color: 'white' }}
							>
								dining website
							</a>
							)
						</FooterText>
					</>
				)}
				<LogoText variant="h4">
					cmu
					<span style={{ color: 'var(--logo-second-half)' }}>
						:eats
					</span>
				</LogoText>
				{theme === 'miku' && (
					<img
						src={footerMikuUrl}
						alt="miku!"
						className="footer__miku"
					/>
				)}
			</footer>
			<link rel="prefetch" href={mikuBgUrl} />
		</div>
	);
}

export default ListPage;
