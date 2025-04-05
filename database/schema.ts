import { relations } from "drizzle-orm";
import {
	boolean,
	date,
	integer,
	pgTable,
	text,
	timestamp,
} from "drizzle-orm/pg-core";

export const animeTable = pgTable("animes", {
	id: integer("id").primaryKey().notNull(),
	listName: text("list_name").notNull(),
	name: text("name").notNull(),
	nameCN: text("name_cn"),
	image: text("image").notNull(),
	airDate: date("air_date", { mode: "date" }),
	finished: boolean("finished").default(false).notNull(),
	info_updated_at: timestamp("info_updated_at", {
		mode: "date",
		withTimezone: true,
	}),
});

export const episodeTable = pgTable("episodes", {
	id: integer("id").primaryKey().notNull(),
	episodeName: text("episode_name").notNull(),
	episodeNameCN: text("episode_name_cn"),
	ep: integer("ep"),
	sort: integer("sort").notNull(),
	watched: boolean("watched").default(false).notNull(),
	releaseDate: date("release_date", { mode: "date" }),
	animeId: integer("anime_id").notNull(),
});

export const animesRelations = relations(animeTable, ({ many }) => ({
	episodes: many(episodeTable),
}));

export const episodesRelations = relations(episodeTable, ({ one }) => ({
	anime: one(animeTable, {
		fields: [episodeTable.animeId],
		references: [animeTable.id],
	}),
}));
