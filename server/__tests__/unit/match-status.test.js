import { describe, expect, it, jest } from "@jest/globals";
import { getMatchStatus, syncMatchStatus } from "../../src/utils/match-status.js";
import { MATCH_STATUS } from "../../src/validation/matches.js";

describe("getMatchStatus", () => {
	const start = "2026-01-01T10:00:00Z";
	const end = "2026-01-01T12:00:00Z";

	it("returns SCHEDULED when now is before start", () => {
		expect(getMatchStatus(start, end, new Date("2026-01-01T09:00:00Z"))).toBe(
			MATCH_STATUS.SCHEDULED,
		);
	});

	it("returns LIVE when now is between start and end", () => {
		expect(getMatchStatus(start, end, new Date("2026-01-01T11:00:00Z"))).toBe(MATCH_STATUS.LIVE);
	});

	it("returns FINISHED when now is at or after end", () => {
		expect(getMatchStatus(start, end, new Date("2026-01-01T12:00:00Z"))).toBe(
			MATCH_STATUS.FINISHED,
		);
	});

	it("returns LIVE exactly at start time (boundary)", () => {
		expect(getMatchStatus(start, end, new Date(start))).toBe(MATCH_STATUS.LIVE);
	});

	it("returns null when startTime is invalid", () => {
		expect(getMatchStatus("not-a-date", end, new Date(start))).toBeNull();
	});

	it("returns null when endTime is invalid", () => {
		expect(getMatchStatus(start, "garbage", new Date(start))).toBeNull();
	});
});

describe("syncMatchStatus", () => {
	it("calls updateStatus and updates match when status changes", async () => {
		// match has scheduled status but its window is in the past, so it should become FINISHED
		const match = {
			startTime: "2020-01-01T10:00:00Z",
			endTime: "2020-01-01T12:00:00Z",
			status: MATCH_STATUS.SCHEDULED,
		};
		const updateStatus = jest.fn().mockResolvedValue(undefined);
		const result = await syncMatchStatus(match, updateStatus);

		expect(updateStatus).toHaveBeenCalledWith(MATCH_STATUS.FINISHED);
		expect(result).toBe(MATCH_STATUS.FINISHED);
		expect(match.status).toBe(MATCH_STATUS.FINISHED);
	});

	it("does not call updateStatus when status is unchanged", async () => {
		// match window far in the future and already SCHEDULED - no change
		const match = {
			startTime: "2099-01-01T10:00:00Z",
			endTime: "2099-01-01T12:00:00Z",
			status: MATCH_STATUS.SCHEDULED,
		};
		const updateStatus = jest.fn();
		const result = await syncMatchStatus(match, updateStatus);

		expect(updateStatus).not.toHaveBeenCalled();
		expect(result).toBe(MATCH_STATUS.SCHEDULED);
	});

	it("returns existing status when timestamps are invalid", async () => {
		const match = { startTime: "bad", endTime: "bad", status: MATCH_STATUS.LIVE };
		const updateStatus = jest.fn();
		const result = await syncMatchStatus(match, updateStatus);

		expect(updateStatus).not.toHaveBeenCalled();
		expect(result).toBe(MATCH_STATUS.LIVE);
	});
});
