import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'

export const logoutRoute: FastifyPluginCallbackZod = (app) => {
	app.post(
		'/logout',
		{
			schema: {
				description: 'Realiza o logout de um usuário',
				tags: ['usuarios'],
				summary: 'Realiza o logout de um usuário',
			},
			preHandler: [app.authenticate],
		},
		async (_, reply) => {
			return reply
				.clearCookie('refreshToken', {
					path: '/',
				})
				.status(200)
				.send({ message: 'Logout realizado com sucesso' })
		},
	)
}
