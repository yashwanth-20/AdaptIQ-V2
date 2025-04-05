import { pgTable, serial, varchar, integer, text, json, boolean } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const chapterNotes = pgTable("chapterNotes", {
	id: serial().primaryKey().notNull(),
	courseId: varchar().notNull(),
	chapterId: integer().notNull(),
	notes: text(),
});

export const paymentRecord = pgTable("paymentRecord", {
	id: serial().primaryKey().notNull(),
	customerId: varchar(),
	sessionId: varchar(),
});

export const studyMaterial = pgTable("studyMaterial", {
	id: serial().primaryKey().notNull(),
	courseId: varchar().notNull(),
	courseType: varchar().notNull(),
	topic: varchar().notNull(),
	difficultyLevel: varchar().default('Easy'),
	courseLayout: json(),
	createdBy: varchar().notNull(),
	status: varchar().default('Generating'),
});

export const studyTypeContent = pgTable("studyTypeContent", {
	id: serial().primaryKey().notNull(),
	courseId: varchar().notNull(),
	content: json(),
	type: varchar().notNull(),
	status: varchar().default('Generating'),
});

export const users = pgTable("users", {
	id: serial().primaryKey().notNull(),
	name: varchar().notNull(),
	email: varchar().notNull(),
	isMember: boolean().default(false),
	customerId: varchar(),
});

export const uploads = pgTable("uploads", {
	id: serial().primaryKey().notNull(),
	userId: varchar("user_id").notNull(),
	url: varchar().notNull(),
	originalName: varchar("original_name").notNull(),
	fileName: varchar("file_name").notNull(),
});
