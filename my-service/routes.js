import db from './db.js'

export default async function routes(fastify, options) {
  fastify.get('/items', async (req, reply) => {
    const client = await db.connect()
    const {rows} = await client.query('select * from items;')
    client.release()

    return rows
  })

  const postOpts = {
    schema: {
      body: {
        type: 'object',
        properties: {
          name: {type: 'string'},
          description: {type: 'string'}
        },
        required: ['name']
      }
    }
  }
  fastify.post('/items', postOpts, async (req, reply) => {
    const {name, description = null} = req.body;
    const values = [name, description];

    const {rows: [item]} = await db.query(
      'INSERT INTO items ("name", description) VALUES ($1, $2) RETURNING *;',
      values)

    return item
  })
}

