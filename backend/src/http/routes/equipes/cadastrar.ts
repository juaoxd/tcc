import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { db } from '@/database/connection.ts'
import { schema } from '@/database/schema/index.ts'

export const cadastrarEquipeRoute: FastifyPluginCallbackZod = (app) => {
	app.post(
		'/equipes',
		{
			preHandler: [app.authenticate],
			schema: {
				description: 'Cadastra uma nova equipe',
				tags: ['equipes'],
				summary: 'Cadastra uma nova equipe',
				body: z.object({
					nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
				}),
			},
		},
		async (request, reply) => {
			const { sub } = request.user

			const { nome } = request.body

			const result = await db.transaction(async (tx) => {
				const [equipeCriada] = await tx
					.insert(schema.equipes)
					.values({
						nome,
					})
					.returning()

				await tx.insert(schema.equipesUsuarios).values({
					idEquipe: equipeCriada.id,
					idUsuario: sub,
					funcao: 'ADMINISTRADOR',
				})

				return equipeCriada
			})

			return reply.status(201).send({ id: result.id })
		},
	)
}
