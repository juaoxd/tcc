import { hash } from 'bcrypt'
import { eq } from 'drizzle-orm'
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { db } from '@/database/connection.ts'
import { schema } from '@/database/schema/index.ts'

export const registerRoute: FastifyPluginCallbackZod = (app) => {
	app.post(
		'/register',
		{
			schema: {
				description: 'Registra um novo usuário',
				tags: ['usuarios'],
				summary: 'Registra um novo usuário',
				body: z.object({
					nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
					email: z.email(),
					senha: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
				}),
				response: {
					201: z.object({
						id: z.string(),
					}),
					400: z.object({
						message: z.string(),
					}),
				},
			},
		},
		async (request, reply) => {
			const { nome, email, senha } = request.body

			const userAlreadyExists = await db.select().from(schema.usuarios).where(eq(schema.usuarios.email, email))

			if (userAlreadyExists.length > 0) {
				throw new Error('E-mail já cadastrado')
			}

			const senhaHash = await hash(senha, 10)

			const result = await db
				.insert(schema.usuarios)
				.values({
					nome,
					email,
					senhaHash,
				})
				.returning()

			const createdUser = result[0]

			return reply.status(201).send({ id: createdUser.id })
		},
	)
}
