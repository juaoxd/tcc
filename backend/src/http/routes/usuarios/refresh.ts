import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const refreshRoute: FastifyPluginCallbackZod = (app) => {
	app.post(
		'/refresh',
		{
			schema: {
				description: 'Renova o token de acesso usando o refresh token',
				tags: ['usuarios'],
				summary: 'Renova o token de acesso',
				response: {
					200: z.object({
						token: z.string(),
					}),
					401: z.object({
						message: z.string(),
					}),
				},
			},
		},
		async (request, reply) => {
			try {
				const refreshToken = request.cookies.refreshToken

				if (!refreshToken) {
					return reply.status(401).send({ message: 'Refresh token não encontrado' })
				}

				const decoded = app.jwt.verify(refreshToken) as { sub: string }

				if (!decoded || !decoded.sub) {
					return reply.status(401).send({ message: 'Refresh token inválido' })
				}

				const newToken = await reply.jwtSign({
					sub: decoded.sub,
				})

				const newRefreshToken = await reply.jwtSign({
					sub: decoded.sub,
					expiresIn: '7d',
				})

				return reply
					.setCookie('refreshToken', newRefreshToken, {
						path: '/',
						secure: true,
						sameSite: true,
						httpOnly: true,
					})
					.status(200)
					.send({ token: newToken })
			} catch {
				return reply.status(401).send({ message: 'Refresh token inválido ou expirado' })
			}
		},
	)
}
