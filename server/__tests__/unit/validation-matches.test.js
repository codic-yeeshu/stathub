import { describe, expect, it } from "@jest/globals";
import {
	createMatchSchema,
	listMatchesQuerySchema,
	matchIdParamSchema,
	updateScoreSchema,
} from "../../src/validation/matches.js";

describe("createMatchSchema", () => {
	const valid = {
		sport: "football",
		homeTeam: "A",
		awayTeam: "B",
		startTime: "2026-01-01T10:00:00Z",
		endTime: "2026-01-01T12:00:00Z",
	};

	it("accepts a valid match", async () => {
		const result = await createMatchSchema.safeParseAsync(valid);
		expect(result.success).toBe(true);
	});

	it("rejects when endTime <= startTime", async () => {
		const result = await createMatchSchema.safeParseAsync({
			...valid,
			endTime: "2026-01-01T10:00:00Z",
		});
		expect(result.success).toBe(false);
	});

	it("rejects empty sport", async () => {
		const result = await createMatchSchema.safeParseAsync({ ...valid, sport: "" });
		expect(result.success).toBe(false);
	});

	it("coerces numeric scores from strings", async () => {
		const result = await createMatchSchema.safeParseAsync({
			...valid,
			homeScore: "3",
			awayScore: "1",
		});
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.homeScore).toBe(3);
			expect(result.data.awayScore).toBe(1);
		}
	});

	it("rejects negative scores", async () => {
		const result = await createMatchSchema.safeParseAsync({ ...valid, homeScore: -1 });
		expect(result.success).toBe(false);
	});
});

describe("listMatchesQuerySchema", () => {
	it("accepts a positive integer limit", () => {
		const result = listMatchesQuerySchema.safeParse({ limit: "10" });
		expect(result.success).toBe(true);
	});

	it("rejects limit > 100", () => {
		const result = listMatchesQuerySchema.safeParse({ limit: 101 });
		expect(result.success).toBe(false);
	});

	it("allows missing limit", () => {
		const result = listMatchesQuerySchema.safeParse({});
		expect(result.success).toBe(true);
	});
});

describe("matchIdParamSchema", () => {
	it("coerces a string id to number", () => {
		const result = matchIdParamSchema.safeParse({ id: "42" });
		expect(result.success).toBe(true);
		if (result.success) expect(result.data.id).toBe(42);
	});

	it("rejects non-positive ids", () => {
		const result = matchIdParamSchema.safeParse({ id: "0" });
		expect(result.success).toBe(false);
	});
});

describe("updateScoreSchema", () => {
	it("accepts non-negative integer scores", () => {
		const result = updateScoreSchema.safeParse({ homeScore: 2, awayScore: 0 });
		expect(result.success).toBe(true);
	});

	it("rejects negative scores", () => {
		const result = updateScoreSchema.safeParse({ homeScore: -1, awayScore: 0 });
		expect(result.success).toBe(false);
	});
});
