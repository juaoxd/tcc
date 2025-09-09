import { and, eq } from 'drizzle-orm'
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { db } from '@/database/connection.ts'
import { schema } from '@/database/schema/index.ts'

export const convidarParticipanteRoute: FastifyPluginCallbackZod = (app) => {
	app.post(
		'/equipes/:idEquipe/convite',
		{
			preHandler: [app.authenticate],
			schema: {
				description: 'Convidar um participante para uma equipe',
				tags: ['equipes'],
				summary: 'Convidar um participante para uma equipe',
				params: z.object({
					idEquipe: z.string(),
				}),
			},
		},
		async (request, reply) => {
			const { sub: idUsuarioLogado } = request.user
			const { idEquipe } = request.params

			const [usuarioEquipe] = await db
				.select()
				.from(schema.equipesUsuarios)
				.where(
					and(
						eq(schema.equipesUsuarios.idEquipe, idEquipe),
						eq(schema.equipesUsuarios.idUsuario, idUsuarioLogado),
						eq(schema.equipesUsuarios.funcao, 'ADMINISTRADOR'),
					),
				)

			if (!usuarioEquipe) {
				return reply.status(403).send({
					message: 'Apenas administradores da equipe podem convidar participantes',
				})
			}

			const tokenConvite = await app.jwt.sign(
				{
					idEquipe,
				},
				{
					expiresIn: '15m',
				},
			)

			const linkConvite = `http://localhost:5173/convite/aceitar?token=${tokenConvite}`

			return reply.status(200).send({
				linkConvite,
				expiresIn: '15 minutos',
			})
		},
	)
}
