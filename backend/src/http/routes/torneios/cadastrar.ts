import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { db } from '@/database/connection.ts'
import { schema } from '@/database/schema/index.ts'

export const cadastrarTorneioRoute: FastifyPluginCallbackZod = (app) => {
	app.post(
		'/torneios',
		{
			preHandler: [app.authenticate],
			schema: {
				description: 'Cadastra um novo torneio',
				tags: ['torneios'],
				summary: 'Cadastra um novo torneio',
				body: z.object({
					nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
					descricao: z.string().optional(),
					esporte: z.enum(['FUTEBOL', 'BASQUETE', 'VOLEI']).default('FUTEBOL'),
					inicio: z.coerce.string().optional(),
					fim: z.coerce.string().optional(),
				}),
			},
		},
		async (request, reply) => {
			const { sub } = request.user

			const { nome, descricao, esporte, inicio, fim } = request.body

			const result = await db
				.insert(schema.torneios)
				.values({
					nome,
					descricao,
					esporte,
					inicio: inicio ? new Date(inicio) : undefined,
					fim: fim ? new Date(fim) : undefined,
					idAdministrador: sub,
				})
				.returning()

			const torneioCriado = result[0]

			return reply.status(201).send({ id: torneioCriado.id })
		},
	)
}
