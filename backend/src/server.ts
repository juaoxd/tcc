import { fastify } from 'fastify'
import { serializerCompiler, validatorCompiler, type ZodTypeProvider } from 'fastify-type-provider-zod'
import { registerRoute } from './http/routes/usuarios/register.ts'

const server = fastify().withTypeProvider<ZodTypeProvider>()

server.setSerializerCompiler(serializerCompiler)
server.setValidatorCompiler(validatorCompiler)

server.register(registerRoute)

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
