import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { usuarios } from './usuarios.ts'

export const torneios = pgTable('torneios', {
	id: uuid().primaryKey().defaultRandom(),
	nome: text().notNull(),
	descricao: text(),
	esporte: text().notNull().default('FUTEBOL'),
	idAdministrador: uuid().references(() => usuarios.id),
	inicio: timestamp(),
	fim: timestamp(),
	createdAt: timestamp().notNull().defaultNow(),
})
