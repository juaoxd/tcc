import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const usuarios = pgTable('usuarios', {
	id: uuid().primaryKey().defaultRandom(),
	nome: text(),
	email: text().notNull().unique(),
	senhaHash: text().notNull(),
	createdAt: timestamp().notNull().defaultNow(),
})
