import { fastifyCookie } from '@fastify/cookie'
import fastifyCors from '@fastify/cors'
import { fastifyJwt } from '@fastify/jwt'
import { fastifySwagger } from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import { fastify } from 'fastify'
import {
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
	type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { env } from './env.ts'
import { authMiddleware } from './http/middlewares/auth.ts'
import { aceitarConviteRoute } from './http/routes/equipes/aceitar-convite.ts'
import { cadastrarEquipeRoute } from './http/routes/equipes/cadastrar.ts'
import { convidarParticipanteRoute } from './http/routes/equipes/convidar-participante.ts'
import { listarEquipesUsuarioRoute } from './http/routes/equipes/listar-equipes-usuario.ts'
import { retornaEquipeRoute } from './http/routes/equipes/retorna-equipe.ts'
import { cadastrarTorneioRoute } from './http/routes/torneios/cadastrar.ts'
import { listarTorneiosUsuarioRoute } from './http/routes/torneios/listar-torneios-usuario.ts'
import { loginRoute } from './http/routes/usuarios/login.ts'
import { logoutRoute } from './http/routes/usuarios/logout.ts'
import { registerRoute } from './http/routes/usuarios/register.ts'

const server = fastify().withTypeProvider<ZodTypeProvider>()

server.register(fastifySwagger, {
	openapi: {
		info: {
			title: 'API',
			version: '1.0.0',
		},
	},
	transform: jsonSchemaTransform,
})

server.register(fastifySwaggerUi, {
	routePrefix: '/docs',
	uiConfig: {
		docExpansion: 'full',
		deepLinking: false,
	},
})

server.register(fastifyCors, {
	origin: 'http://localhost:5173',
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	credentials: true,
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
server.register(logoutRoute)
server.register(cadastrarTorneioRoute)
server.register(listarTorneiosUsuarioRoute)
server.register(cadastrarEquipeRoute)
server.register(convidarParticipanteRoute)
server.register(aceitarConviteRoute)
server.register(retornaEquipeRoute)
server.register(listarEquipesUsuarioRoute)

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
