import Fastify from 'fastify'
import routes from './routes'
import db from './db'

const fastify = Fastify({logger: true})

fastify.register(routes)

fastify.listen({host: process.env.HOST, port: process.env.PORT}, async function (err) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  
  const {rows} = await db.query('select now();')
  console.log(rows[0])
})

