import { pgTable, uuid, varchar, text, timestamp, foreignKey, primaryKey, unique } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const urls = pgTable("urls", {
	id: uuid().defaultRandom().primaryKey(),
	code: varchar({ length: 155 }).notNull(),
	targetUrl: text("target_url").notNull(),
	userId: uuid("user_id").notNull().references(() => users.id),
	createdAt: timestamp("created_at").default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at"),
}, (table) => [
	unique("urls_code_key").on(table.code),]);

export const users = pgTable("users", {
	id: uuid().defaultRandom().primaryKey(),
	firstName: varchar("first_name", { length: 55 }).notNull(),
	lastName: varchar("last_name", { length: 55 }),
	email: varchar({ length: 55 }).notNull(),
	password: text().notNull(),
	salt: text().notNull(),
	createdAt: timestamp("created_at").default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at"),
});
