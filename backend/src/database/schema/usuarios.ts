import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const usuarios = pgTable('usuarios', {
	id: serial().primaryKey(),
	nome: text(),
	email: text().notNull().unique(),
	senhaHash: text().notNull(),
	createdAt: timestamp().notNull().defaultNow(),
})
