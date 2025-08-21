import { reset, seed } from 'drizzle-seed'
import { db, sql } from './connection.ts'
import { schema } from './schema/index.ts'

await reset(db, schema)

await seed(db, schema).refine((f) => {
	return {
		usuarios: {
			count: 5,
			columns: {
				nome: f.fullName(),
				email: f.email(),
				senhaHash: f.string(),
			},
		},
	}
})

await sql.end()

// biome-ignore lint/suspicious/noConsole: only used in dev
console.log('Database seeded')
