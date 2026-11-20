import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
	urls: {
		user: r.one.users({
			from: r.urls.userId,
			to: r.users.id
		}),
	},
	users: {
		urls: r.many.urls(),
	},
}))