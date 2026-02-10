import { desc, eq } from "drizzle-orm";
import { Router } from "express";
import { db } from "../db/db.js";
import { commentaries } from "../db/schema.js";
import { logError, logIt } from "../utils/utils.js";
import { createCommentarySchema, listCommentaryQuerySchema } from "../validation/commentary.js";
import { matchIdParamSchema } from "../validation/matches.js";

export const commentaryRouter = Router({ mergeParams: true });

const MAX_LIMIT = 100;

commentaryRouter.get("/", async (req, res) => {
	const paramsResult = await matchIdParamSchema.safeParseAsync(req.params);

	if (!paramsResult.success) {
		return res.status(400).json({ error: "Invalid match ID.", details: paramsResult.error.issues });
	}

	const queryResult = await listCommentaryQuerySchema.safeParseAsync(req.query);
	if (!queryResult.success) {
		return res
			.status(400)
			.json({ error: "Invalid query parameters.", details: queryResult.error.issues });
	}

	try {
		const { id: matchId } = paramsResult.data;
		const { limit = MAX_LIMIT } = queryResult.data;

		const safeLimit = Math.min(limit, MAX_LIMIT);

		const results = await db
			.select()
			.from(commentaries)
			.where(eq(commentaries.matchId, matchId))
			.orderBy(desc(commentaries.createdAt))
			.limit(safeLimit);

		res.status(200).json({ data: results });
	} catch (error) {
		logError("Failed to fetch commentary:", error);
		res.status(500).json({ error: "Failed to fetch commentary." });
	}
});

commentaryRouter.post("/", async (req, res) => {
	logIt(req.url, req.params, req.body);
	const paramsResult = await matchIdParamSchema.safeParseAsync(req.params);

	if (!paramsResult.success) {
		return res.status(400).json({ error: "Invalid match ID.", details: paramsResult.error.issues });
	}

	const bodyResult = await createCommentarySchema.safeParseAsync(req.body);

	if (!bodyResult.success) {
		return res
			.status(400)
			.json({ error: "Invalid commentary payload.", details: bodyResult.error.issues });
	}

	try {
		const { minute, ...rest } = bodyResult.data;
		const [result] = await db
			.insert(commentaries)
			.values({
				matchId: paramsResult.data.id,
				minute,
				...rest,
			})
			.returning();

		try {
			res.app.locals.broadcastCommentary?.(result.matchId, result);
		} catch (err) {
			logError("commentaryRouter:", "broadcastCommentary failed", err);
		}

		res.status(201).json({ data: result });
	} catch (error) {
		console.error("Failed to create commentary:", error);
		res.status(500).json({ error: "Failed to create commentary." });
	}
});
