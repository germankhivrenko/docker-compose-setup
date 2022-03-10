import Fastify from 'fastify'
import routes from './routes'

const fastify = Fastify({logger: true})

fastify.register(routes)

fastify.listen({host: process.env.HOST, port: process.env.PORT}, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }

//  fastify.log.info(`Fastify server is running on ${address}`)
})

