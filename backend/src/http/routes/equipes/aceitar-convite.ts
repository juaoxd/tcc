import { and, eq } from 'drizzle-orm'
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { db } from '@/database/connection.ts'
import { schema } from '@/database/schema/index.ts'

export const aceitarConviteRoute: FastifyPluginCallbackZod = (app) => {
	app.post(
		'/convite/aceitar',
		{
			preHandler: [app.authenticate],
			schema: {
				description: 'Aceita um convite de uma equipe',
				tags: ['equipes'],
				summary: 'Aceita um convite de uma equipe',
				body: z.object({
					token: z.string().min(1, 'Token de convite é obrigatório'),
				}),
			},
		},
		async (request, reply) => {
			const { sub: idUsuarioLogado } = request.user
			const { token } = request.body

			try {
				const payload = (await app.jwt.verify(token)) as { idEquipe: string }
				const { idEquipe } = payload

				const [usuarioJaNaEquipe] = await db
					.select()
					.from(schema.equipesUsuarios)
					.where(
						and(eq(schema.equipesUsuarios.idEquipe, idEquipe), eq(schema.equipesUsuarios.idUsuario, idUsuarioLogado)),
					)

				if (usuarioJaNaEquipe) {
					return reply.status(200).send({
						message: 'Usuário já faz parte da equipe',
					})
				}

				await db.insert(schema.equipesUsuarios).values({
					idEquipe,
					idUsuario: idUsuarioLogado,
					funcao: 'PARTICIPANTE',
				})

				return reply.status(201).send({
					message: 'Convite aceito com sucesso! Você agora faz parte da equipe.',
				})
			} catch {
				return reply.status(400).send({
					message: 'Token de convite inválido ou expirado',
				})
			}
		},
	)
}
