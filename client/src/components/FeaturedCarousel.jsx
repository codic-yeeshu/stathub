import { useCallback, useEffect, useRef, useState } from "react";

export default function FeaturedCarousel({ featuredMatches }) {
	const carouselRef = useRef(null);
	const [autoScrollKey, setAutoScrollKey] = useState(0);
	const interactionTimeoutRef = useRef(null);

	const scrollNext = useCallback(() => {
		if (carouselRef.current) {
			const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
			const isEnd = scrollLeft + clientWidth + 5 >= scrollWidth;

			if (isEnd) {
				carouselRef.current.scrollTo({ left: 0, behavior: "smooth" });
			} else {
				carouselRef.current.scrollBy({ left: clientWidth, behavior: "smooth" });
			}
		}
	}, []);

	const scrollPrev = useCallback(() => {
		if (carouselRef.current) {
			const { scrollLeft, clientWidth, scrollWidth } = carouselRef.current;
			if (scrollLeft <= 0) {
				carouselRef.current.scrollTo({ left: scrollWidth, behavior: "smooth" });
			} else {
				carouselRef.current.scrollBy({ left: -clientWidth, behavior: "smooth" });
			}
		}
	}, []);

	// Auto-scroll logic for carousel with reset upon user interaction
	// biome-ignore lint/correctness/useExhaustiveDependencies: autoScrollKey intentionally excluded
	useEffect(() => {
		const interval = setInterval(scrollNext, 4000); // 4 seconds auto scroll
		return () => clearInterval(interval);
	}, [scrollNext, autoScrollKey]);

	const handleUserInteraction = useCallback(() => {
		if (interactionTimeoutRef.current) clearTimeout(interactionTimeoutRef.current);
		interactionTimeoutRef.current = setTimeout(() => {
			setAutoScrollKey((prev) => prev + 1);
		}, 150);
	}, []);

	useEffect(
		() => () => {
			if (interactionTimeoutRef.current) clearTimeout(interactionTimeoutRef.current);
		},
		[],
	);

	return (
		<section className="mt-6 mb-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
			<div className="flex items-center justify-between px-2 mb-4">
				<h2 className="text-2xl font-black tracking-tight">Featured Live</h2>
				<div className="flex items-center gap-2">
					<button
						type="button"
						onClick={() => {
							scrollPrev();
							handleUserInteraction();
						}}
						className="hidden sm:flex w-7 h-7 rounded-full bg-(--color-surface-muted) items-center justify-center border border-(--color-border) hover:bg-(--color-surface) transition-colors"
						aria-label="Previous slide"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-4 w-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<title>Previous slide</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M15 19l-7-7 7-7"
							/>
						</svg>
					</button>
					<button
						type="button"
						onClick={() => {
							scrollNext();
							handleUserInteraction();
						}}
						className="hidden sm:flex w-7 h-7 rounded-full bg-(--color-surface-muted) items-center justify-center border border-(--color-border) hover:bg-(--color-surface) transition-colors"
						aria-label="Next slide"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-4 w-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<title>Next slide</title>
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
						</svg>
					</button>
					<button
						type="button"
						className="text-sm font-semibold text-(--color-accent) hover:underline ml-2"
					>
						See all
					</button>
				</div>
			</div>

			<div
				ref={carouselRef}
				onScroll={handleUserInteraction}
				onTouchStart={handleUserInteraction}
				className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 no-scrollbar px-2 -mx-2 touch-pan-x"
			>
				{featuredMatches.map((match) => (
					<div
						key={match.id}
						className="shrink-0 w-[85%] sm:w-[320px] snap-center glass-card rounded-[1.5rem] p-5 relative overflow-hidden transition-sport cursor-pointer hover:scale-[1.02]"
						data-sport={match.sport}
					>
						{/* Decorative accent top border */}
						<div className="absolute top-0 left-0 right-0 h-1.5 bg-[var(--sport-accent)]" />

						<div className="flex justify-between items-center mb-6">
							<span className="text-xs font-bold text-[var(--sport-accent)] bg-[color-mix(in_oklch,var(--sport-accent),transparent_85%)] px-2.5 py-1 rounded-md uppercase tracking-widest flex items-center gap-1.5">
								<span className="w-1.5 h-1.5 rounded-full bg-[var(--sport-accent)] animate-pulse" />
								{match.status}
							</span>
							<span className="text-xs font-medium capitalize text-(--color-foreground)/60 flex items-center gap-1">
								{match.sport}
							</span>
						</div>

						<div className="flex justify-between items-center px-1">
							<div className="flex flex-col items-center gap-2">
								<div className="w-14 h-14 rounded-full bg-(--color-surface-muted) flex items-center justify-center font-bold text-lg border-2 border-(--color-border) shadow-sm">
									{match.team1.substring(0, 3)}
								</div>
								<span className="font-bold text-sm">{match.team1}</span>
							</div>

							<div className="flex flex-col items-center justify-center">
								<span className="text-3xl font-black tracking-tighter mb-4">
									{match.score1} <span className="text-foreground/30 mx-1">-</span> {match.score2}
								</span>
							</div>

							<div className="flex flex-col items-center gap-2">
								<div className="w-14 h-14 rounded-full bg-(--color-surface-muted) flex items-center justify-center font-bold text-lg border-2 border-(--color-border) shadow-sm">
									{match.team2.substring(0, 3)}
								</div>
								<span className="font-bold text-sm">{match.team2}</span>
							</div>
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
