import { eq } from 'drizzle-orm'
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { db } from '@/database/connection.ts'
import { schema } from '@/database/schema/index.ts'

export const listarTorneiosUsuarioRoute: FastifyPluginCallbackZod = (app) => {
	app.get(
		'/usuarios/torneios',
		{
			onRequest: [app.authenticate],
			schema: {
				description: 'Lista todos os torneios criados pelo usuário autenticado',
				tags: ['torneios'],
				summary: 'Lista torneios do usuário',
				response: {
					200: z.object({
						torneios: z.array(
							z.object({
								id: z.string(),
								nome: z.string(),
								descricao: z.string().nullable(),
								esporte: z.string(),
								quantidadeEquipes: z.number(),
								inicio: z.string().nullable(),
								fim: z.string().nullable(),
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

			const torneios = await db
				.select({
					id: schema.torneios.id,
					nome: schema.torneios.nome,
					descricao: schema.torneios.descricao,
					esporte: schema.torneios.esporte,
					quantidadeEquipes: schema.torneios.quantidadeEquipes,
					inicio: schema.torneios.inicio,
					fim: schema.torneios.fim,
					createdAt: schema.torneios.createdAt,
				})
				.from(schema.torneios)
				.where(eq(schema.torneios.idAdministrador, userId))
				.orderBy(schema.torneios.createdAt)

			return reply.status(200).send({
				torneios: torneios.map((torneio) => ({
					...torneio,
					inicio: torneio.inicio?.toISOString() || null,
					fim: torneio.fim?.toISOString() || null,
					createdAt: torneio.createdAt.toISOString(),
				})),
			})
		},
	)
}
