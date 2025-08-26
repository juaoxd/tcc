import { pgTable, primaryKey, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { usuarios } from './usuarios.ts'

export const equipes = pgTable('equipes', {
	id: uuid().primaryKey().defaultRandom(),
	nome: text().notNull(),
	createdAt: timestamp().notNull().defaultNow(),
})

export const equipesUsuarios = pgTable(
	'equipes_usuarios',
	{
		idEquipe: uuid().references(() => equipes.id),
		idUsuario: uuid().references(() => usuarios.id),
		funcao: text().notNull().default('PARTICIPANTE'),
		createdAt: timestamp().notNull().defaultNow(),
	},
	(table) => [primaryKey({ columns: [table.idEquipe, table.idUsuario] })],
)
