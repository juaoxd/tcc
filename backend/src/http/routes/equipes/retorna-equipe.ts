import { eq } from 'drizzle-orm'
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { db } from '@/database/connection.ts'
import { schema } from '@/database/schema/index.ts'

export const retornaEquipeRoute: FastifyPluginCallbackZod = (app) => {
	app.get(
		'/equipes/:idEquipe',
		{
			schema: {
				description: 'Retorna uma equipe',
				tags: ['equipes'],
				summary: 'Retorna uma equipe',
				params: z.object({
					idEquipe: z.string(),
				}),
			},
		},
		async (request, reply) => {
			const { idEquipe } = request.params

			const rows = await db
				.select({
					id: schema.equipes.id,
					nome: schema.equipes.nome,
					idUsuario: schema.equipesUsuarios.idUsuario,
					nomeUsuario: schema.usuarios.nome,
				})
				.from(schema.equipes)
				.innerJoin(schema.equipesUsuarios, eq(schema.equipes.id, schema.equipesUsuarios.idEquipe))
				.innerJoin(schema.usuarios, eq(schema.usuarios.id, schema.equipesUsuarios.idUsuario))
				.where(eq(schema.equipes.id, idEquipe))

			const integrantes = rows.map((row) => ({
				id: row.idUsuario,
				nome: row.nomeUsuario,
			}))

			if (rows.length === 0) {
				return reply.status(404).send({ message: 'Equipe não encontrada' })
			}

			return reply.status(200).send({
				id: rows[0].id,
				nome: rows[0].nome,
				integrantes,
			})
		},
	)
}
