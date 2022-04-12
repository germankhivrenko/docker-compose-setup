import {Pool} from 'pg'
import {scheduler} from 'timers/promises'

const reconnectHandlerDecorator = (fn, options) => async function(...args) {
  const maxTryCount = options && options.maxTryCount || 10
  const tryPeriod = options && options.tryPeriod || 100 // ms

  let tryCount = 0
  let connectionErr = null

  while (tryCount < maxTryCount) {
    try {
      console.log('TRY RUNNING QUERY, TRY NUMBER: ' + tryCount)
      const res = await fn.apply(this, args)
      return res
    } catch (err) {
      if (err.code === 'EAI_AGAIN') {
        tryCount++
        connectionErr = err

        scheduler.wait(tryPeriod) 
      } else {
        throw err
      }
    }
  }

  throw connectionErr 
}

const pool = new Pool({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD
})

pool.query = reconnectHandlerDecorator(pool.query)
pool.on('connect', (client) => {
  client.query = reconnectHandlerDecorator(client.query)
})

export default pool

