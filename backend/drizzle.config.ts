import { defineConfig } from 'drizzle-kit'
import { env } from './src/env.ts'

export default defineConfig({
	dialect: 'postgresql',
	schema: './src/database/schema',
	casing: 'snake_case',
	out: './src/database/migrations',
	dbCredentials: {
		url: env.DATABASE_URL,
	},
})
