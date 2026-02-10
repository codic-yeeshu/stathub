import { relations } from "drizzle-orm";
import { integer, jsonb, pgEnum, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

// Define enums
export const matchStatusEnum = pgEnum("match_status", ["scheduled", "live", "finished"]);

// Matches Table
export const matches = pgTable("matches", {
	id: serial("id").primaryKey(),
	sport: text("sport").notNull(),
	homeTeam: text("home_team").notNull(),
	awayTeam: text("away_team").notNull(),
	status: matchStatusEnum("status").default("scheduled").notNull(),
	startTime: timestamp("start_time").notNull(),
	endTime: timestamp("end_time"),
	homeScore: integer("home_score").default(0).notNull(),
	awayScore: integer("away_score").default(0).notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Commentary Table
export const commentaries = pgTable("commentary", {
	id: serial("id").primaryKey(),
	matchId: integer("match_id")
		.references(() => matches.id)
		.notNull(),
	minute: integer("minute"),
	sequence: integer("sequence").notNull(),
	period: text("period"), // e.g., "1st Half", "Overtime"
	eventType: text("event_type").notNull(), // e.g., "goal", "foul", "substitution"
	actor: text("actor"), // Player name involved
	team: text("team"), // "home" or "away" or null
	message: text("message").notNull(),
	metadata: jsonb("metadata"), // Flexible field for extra event data
	tags: text("tags").array(), // Array of strings for filtering
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const matchesRelations = relations(matches, ({ many }) => ({
	commentaries: many(commentaries),
}));

export const commentariesRelations = relations(commentaries, ({ one }) => ({
	match: one(matches, {
		fields: [commentaries.matchId],
		references: [matches.id],
	}),
}));
