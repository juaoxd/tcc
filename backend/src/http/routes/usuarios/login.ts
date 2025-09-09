import { compare } from 'bcrypt'
import { eq } from 'drizzle-orm'
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { db } from '@/database/connection.ts'
import { schema } from '@/database/schema/index.ts'

export const loginRoute: FastifyPluginCallbackZod = (app) => {
	app.post(
		'/login',
		{
			schema: {
				description: 'Realiza o login de um usuário',
				tags: ['usuarios'],
				summary: 'Realiza o login de um usuário',
				body: z.object({
					email: z.email(),
					senha: z.string(),
				}),
			},
		},
		async (request, reply) => {
			const { email, senha } = request.body

			const [user] = await db.select().from(schema.usuarios).where(eq(schema.usuarios.email, email))

			if (!user) {
				return reply.status(401).send({ message: 'Credenciais inválidas' })
			}

			const isPasswordValid = await compare(senha, user.senhaHash)

			if (!isPasswordValid) {
				return reply.status(401).send({ message: 'Credenciais inválidas' })
			}

			const token = await reply.jwtSign({
				sub: user.id,
			})

			const refreshToken = await reply.jwtSign({
				sub: user.id,
				expiresIn: '7d',
			})

			return reply
				.setCookie('refreshToken', refreshToken, {
					path: '/',
					secure: true,
					sameSite: true,
					httpOnly: true,
				})
				.status(200)
				.send({ token })
		},
	)
}
