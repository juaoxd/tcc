import { eq } from 'drizzle-orm'
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { db } from '@/database/connection.ts'
import { schema } from '@/database/schema/index.ts'

export const listarEquipesUsuarioRoute: FastifyPluginCallbackZod = (app) => {
	app.get(
		'/usuarios/equipes',
		{
			onRequest: [app.authenticate],
			schema: {
				description: 'Lista todas as equipes que o usuário autenticado participa',
				tags: ['equipes'],
				summary: 'Lista equipes do usuário',
				response: {
					200: z.object({
						equipes: z.array(
							z.object({
								id: z.string(),
								nome: z.string(),
								funcao: z.string(),
								createdAt: z.string(),
							}),
						),
					}),
					401: z.object({
						message: z.string(),
					}),
				},
			},
		},
		async (request, reply) => {
			const userId = request.user.sub

			const equipes = await db
				.select({
					id: schema.equipes.id,
					nome: schema.equipes.nome,
					funcao: schema.equipesUsuarios.funcao,
					createdAt: schema.equipes.createdAt,
				})
				.from(schema.equipes)
				.innerJoin(schema.equipesUsuarios, eq(schema.equipes.id, schema.equipesUsuarios.idEquipe))
				.where(eq(schema.equipesUsuarios.idUsuario, userId))
				.orderBy(schema.equipes.createdAt)

			return reply.status(200).send({
				equipes: equipes.map((equipe) => ({
					...equipe,
					createdAt: equipe.createdAt.toISOString(),
				})),
			})
		},
	)
}
