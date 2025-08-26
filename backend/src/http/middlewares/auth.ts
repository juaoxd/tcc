import type { FastifyReply, FastifyRequest } from 'fastify'

export const authMiddleware = async (request: FastifyRequest, reply: FastifyReply) => {
	try {
		await request.jwtVerify()
	} catch {
		reply.status(401).send({ message: 'Token de autenticação inválido ou ausente' })
	}
}
