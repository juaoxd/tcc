import { fastifyCookie } from '@fastify/cookie'
import fastifyCors from '@fastify/cors'
import { fastifyJwt } from '@fastify/jwt'
import { fastify } from 'fastify'
import { serializerCompiler, validatorCompiler, type ZodTypeProvider } from 'fastify-type-provider-zod'
import { env } from './env.ts'
import { authMiddleware } from './http/middlewares/auth.ts'
import { cadastrarEquipeRoute } from './http/routes/equipes/cadastrar.ts'
import { retornaEquipeRoute } from './http/routes/equipes/retorna-equipe.ts'
import { cadastrarTorneioRoute } from './http/routes/torneios/cadastrar.ts'
import { loginRoute } from './http/routes/usuarios/login.ts'
import { registerRoute } from './http/routes/usuarios/register.ts'

const server = fastify().withTypeProvider<ZodTypeProvider>()

server.register(fastifyCors, {
	origin: 'http://localhost:5173',
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization'],
})

server.register(fastifyCookie)

server.register(fastifyJwt, {
	secret: env.JWT_SECRET,
	sign: {
		expiresIn: '15m',
	},
	cookie: {
		cookieName: 'refreshToken',
		signed: false,
	},
})

server.setSerializerCompiler(serializerCompiler)
server.setValidatorCompiler(validatorCompiler)

server.decorate('authenticate', authMiddleware)

server.register(registerRoute)
server.register(loginRoute)
server.register(cadastrarTorneioRoute)
server.register(cadastrarEquipeRoute)
server.register(retornaEquipeRoute)

server.get('/', (_, res) => {
	res.send('Hello World')
})

server.listen({ port: 3333, host: '0.0.0.0' }, (err, address) => {
	console.log(`Server is running on ${address}`)
	if (err) {
		console.error(err)
		process.exit(1)
	}
})
