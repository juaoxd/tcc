import '@fastify/jwt'
import type { FastifyReply, FastifyRequest } from 'fastify'

declare module '@fastify/jwt' {
	export interface FastifyJWT {
		user: {
			sub: string
		}
	}
}

declare module 'fastify' {
	interface FastifyInstance {
		authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>
	}
}
