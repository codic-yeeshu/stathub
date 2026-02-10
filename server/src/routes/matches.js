import { desc } from "drizzle-orm";
import { Router } from "express";
import { db } from "../db/db.js";
import { matches } from "../db/schema.js";
import { getMatchStatus } from "../utils/match-status.js";
import { logError, logIt } from "../utils/utils.js";
import { createMatchSchema, listMatchesQuerySchema } from "../validation/matches.js";

export const matchesRouter = Router();
const MAX_LIMIT = 100;

// To fetch all the matches list.
matchesRouter.get("/", async (req, res) => {
	logIt("matchesRouter:", "Starting to fetch the matches list.");
	const parsedQuery = await listMatchesQuerySchema.safeParseAsync(req.query);
	if (!parsedQuery.success) {
		return res.status(400).json({ error: "Invalid Query.", details: parsedQuery.error.issues });
	}

	const limit = Math.min(parsedQuery.data.limit ?? 50, MAX_LIMIT);
	try {
		const matchData = await db.select().from(matches).orderBy(desc(matches.createdAt)).limit(limit);
		logIt("matchesRouter:", "Match List fetched successfully.");
		return res.status(200).json({ message: "Fetched matches list.", data: matchData });
	} catch (error) {
		logIt("matchesRouter:", "error while fetching the matches list", error);
		return res.status(500).json({
			error: "Failed to fetch the matches list. Internal Server Error",
		});
	}
});

// create a match
matchesRouter.post("/", async (req, res) => {
	const parsedMatch = await createMatchSchema.safeParseAsync(req.body);
	if (!parsedMatch.success) {
		return res.status(400).json({ error: "Invalid Payload.", details: parsedMatch.error.issues });
	}

	logIt("Parsed match", parsedMatch);
	const {
		data: { startTime, endTime, homeScore, awayScore },
	} = parsedMatch;
	try {
		const [event] = await db
			.insert(matches)
			.values({
				...parsedMatch.data,
				startTime: new Date(startTime),
				endTime: new Date(endTime),
				homeScore: homeScore ?? 0,
				awayScore: awayScore ?? 0,
				status: getMatchStatus(startTime, endTime),
			})
			.returning();

		// if match created successfully then broadcast it to all connected clients
		try {
			res.app.locals.broadcastMatchCreated?.(event);
		} catch (err) {
			logError("matchesRouter:", "broadcastMatchCreated failed", err);
		}

		return res.status(200).json({ message: "Match created", event });
	} catch (error) {
		logError("matchesRouter:", "error while creating the match", error);
		return res.status(500).json({ error: "Failed to create a match." });
	}
});
