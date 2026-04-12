import { useEffect, useRef, useState } from "react";
import FeaturedCarousel from "../components/FeaturedCarousel";

// Dummy data
const sports = ["Cricket", "Football", "Basketball", "Tennis", "Esports", "Racing"];

const featuredMatches = [
	{
		id: 1,
		team1: "MI",
		team2: "CSK",
		score1: "156/4",
		score2: "155/8",
		status: "Live",
		sport: "cricket",
	},
	{
		id: 2,
		team1: "LAL",
		team2: "GSW",
		score1: "110",
		score2: "105",
		status: "Q4 3:12",
		sport: "basketball",
	},
	{ id: 3, team1: "MCI", team2: "ARS", score1: "2", score2: "1", status: "88'", sport: "football" },
];

const matchCards = [
	{
		id: 1,
		title: "Premier League",
		team1: "Chelsea",
		team2: "Spurs",
		time: "Today, 8:00 PM",
		sport: "football",
	},
	{
		id: 2,
		title: "T20 World Cup",
		team1: "IND",
		team2: "AUS",
		time: "Tomorrow, 2:30 PM",
		sport: "cricket",
	},
	{
		id: 3,
		title: "NBA Regular Season",
		team1: "BOS",
		team2: "MIA",
		time: "Wed, 6:00 AM",
		sport: "basketball",
	},
	{
		id: 4,
		title: "Wimbledon Final",
		team1: "Alcaraz",
		team2: "Djokovic",
		time: "Sun, 6:30 PM",
		sport: "tennis",
	},
];

export default function Home() {
	const [selectedSport, setSelectedSport] = useState("All");
	const [isFilterVisible, setIsFilterVisible] = useState(true);
	const lastScrollY = useRef(0);

	// Scroll visibility logic for the filter bar
	useEffect(() => {
		const handleScroll = () => {
			const currentScrollY = window.scrollY;
			// Only hide if we scroll down significantly from the top
			if (currentScrollY > lastScrollY.current && currentScrollY > 64) {
				// Scrolling down
				setIsFilterVisible(false);
			} else {
				// Scrolling up
				setIsFilterVisible(true);
			}
			lastScrollY.current = currentScrollY;
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<div
			className="pb-6 min-h-[calc(100vh-128px)] relative"
			data-sport={selectedSport === "All" ? "default" : selectedSport.toLowerCase()}
		>
			{/* Aesthetic background gradients based on selected sport */}
			<div className="fixed inset-0 pointer-events-none transition-sport duration-700 bg-[radial-gradient(ellipse_at_top_right,var(--sport-accent-soft),transparent_70%)] opacity-80" />
			<div className="fixed inset-0 pointer-events-none transition-sport duration-700 bg-[radial-gradient(ellipse_at_top_left,var(--sport-accent-soft),transparent_70%)] opacity-80" />

			{/* Sport Filter Bar - Sticky */}
			<div
				className={`fixed top-16 left-0 right-0 z-20 bg-background/80 backdrop-blur-xl border-b border-(--color-border) transition-transform duration-300 ${
					isFilterVisible ? "translate-y-0" : "-translate-y-full"
				}`}
			>
				<div
					className="max-w-2xl mx-auto flex items-center px-4 h-16 gap-3 transition-sport"
					data-sport={selectedSport === "All" ? "default" : selectedSport.toLowerCase()}
				>
					<button
						type="button"
						className={`shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-sport ${
							selectedSport === "All"
								? "nav-active shadow-md"
								: "bg-(--color-surface) border border-(--color-border) hover:bg-(--color-surface-muted)"
						}`}
						onClick={() => setSelectedSport("All")}
					>
						All
					</button>

					<div className="h-8 w-px bg-(--color-border) shrink-0 mx-1" />

					<div className="flex-1 overflow-x-auto no-scrollbar flex items-center gap-2 px-1">
						{sports.map((sport) => (
							<button
								type="button"
								key={sport}
								className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-sport ${
									selectedSport === sport
										? "nav-active shadow-md"
										: "bg-(--color-surface) border border-(--color-border) hover:bg-(--color-surface-muted)"
								}`}
								onClick={() => setSelectedSport(sport)}
							>
								{sport}
							</button>
						))}
					</div>

					<button
						type="button"
						className="shrink-0 p-2.5 rounded-xl bg-(--color-surface) border border-(--color-border) hover:bg-(--color-surface-muted) shadow-sm transition-sport flex items-center justify-center"
					>
						{/* Horizontal Nails / Slider Icon */}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5 text-(--color-foreground)"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<title>Filter</title>
							<path d="M4 21v-7" />
							<path d="M4 10V3" />
							<path d="M12 21v-9" />
							<path d="M12 8V3" />
							<path d="M20 21v-5" />
							<path d="M20 12V3" />
							<path d="M1 14h6" />
							<path d="M9 8h6" />
							<path d="M17 16h6" />
						</svg>
					</button>
				</div>
			</div>

			{/* Spacing placeholder for the fixed filter bar */}
			<div className="h-16" />

			{/* Featured Carousel Component */}
			<FeaturedCarousel featuredMatches={featuredMatches} />

			{/* Upcoming Games */}
			<section className="px-2 pb-6 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-150">
				<h2 className="text-xl font-bold mb-4">Ongoing & Upcoming</h2>
				<div className="flex flex-col gap-4">
					{matchCards.map((match) => (
						<div
							key={match.id}
							className="glass-card rounded-card p-4 flex flex-col gap-3 transition-sport hover:-translate-y-1 cursor-pointer relative overflow-hidden"
							data-sport={match.sport}
						>
							<div className="absolute left-0 top-0 bottom-0 w-1 bg-accent" />

							<div className="flex justify-between text-sm pl-2">
								<span className="font-bold text-(--color-foreground) opacity-80">
									{match.title}
								</span>
								<span className="font-medium text-accent bg-[color-mix(in_oklch,var(--sport-accent),transparent_85%)] px-2 py-0.5 rounded-sm">
									{match.time}
								</span>
							</div>

							<div className="flex items-center justify-between mt-1 pl-2">
								<div className="flex items-center gap-4 flex-1">
									<div className="w-10 h-10 rounded-full bg-(--color-surface-muted) flex items-center justify-center text-sm font-bold border border-(--color-border) shadow-sm shrink-0">
										{match.team1.substring(0, 3)}
									</div>
									<span className="font-bold text-lg">{match.team1}</span>
								</div>

								<div className="text-xs font-black text-(--color-foreground) opacity-30 px-3 bg-(--color-surface-muted) py-1 rounded-full shrink-0">
									VS
								</div>

								<div className="flex items-center gap-4 flex-1 justify-end">
									<span className="font-bold text-lg text-right">{match.team2}</span>
									<div className="w-10 h-10 rounded-full bg-(--color-surface-muted) flex items-center justify-center text-sm font-bold border border-(--color-border) shadow-sm shrink-0">
										{match.team2.substring(0, 3)}
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</section>
		</div>
	);
}
