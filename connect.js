const { Pool, Client } = require('pg')
const connectionString = 'postgresql://dbuser:secretpassword@database.server.com:3211/mydb'
const pool = new Pool({
  connectionString,
})
pool.query('SELECT NOW()', (err, res) => {
  console.log(err, res)
  pool.end()
})
const client = new Client({
  connectionString,
})
client.connect()
client.query('SELECT NOW()', (err, res) => {
  console.log(err, res)
  client.end()
})

// callback
client.query('SELECT NOW() as now', (err, res) => {
  if (err) {
    console.log(err.stack)
  } else {
    console.log(res.rows[0])
  }
})
// promise
client
  .query('SELECT NOW() as now')
  .then(res => console.log(res.rows[0]))
  .catch(e => console.error(e.stack))

// parameterized query

const text = 'INSERT INTO users(name, email) VALUES($1, $2) RETURNING *'
const values = ['brianc', 'brian.m.carlson@gmail.com']
// callback
client.query(text, values, (err, res) => {
  if (err) {
    console.log(err.stack)
  } else {
    console.log(res.rows[0])
    // { name: 'brianc', email: 'brian.m.carlson@gmail.com' }
  }
})
// promise
client
  .query(text, values)
  .then(res => {
    console.log(res.rows[0])
    // { name: 'brianc', email: 'brian.m.carlson@gmail.com' }
  })
  .catch(e => console.error(e.stack))
// async/await
try {
  const res = await client.query(text, values)
  console.log(res.rows[0])
  // { name: 'brianc', email: 'brian.m.carlson@gmail.com' }
} catch (err) {
  console.log(err.stack)
}


// query config object
const query = {
  text: 'INSERT INTO users(name, email) VALUES($1, $2)',
  values: ['brianc', 'brian.m.carlson@gmail.com'],
}
// callback
client.query(query, (err, res) => {
  if (err) {
    console.log(err.stack)
  } else {
    console.log(res.rows[0])
  }
})
// promise
client
  .query(query)
  .then(res => console.log(res.rows[0]))
  .catch(e => console.error(e.stack))


// prepared statements
const query = {
  // give the query a unique name
  name: 'fetch-user',
  text: 'SELECT * FROM user WHERE id = $1',
  values: [1],
}
// callback
client.query(query, (err, res) => {
  if (err) {
    console.log(err.stack)
  } else {
    console.log(res.rows[0])
  }
})
// promise
client
  .query(query)
  .then(res => console.log(res.rows[0]))
  .catch(e => console.error(e.stack))


// row mode

const query = {
  text: 'SELECT $1::text as first_name, $2::text as last_name',
  values: ['Brian', 'Carlson'],
  rowMode: 'array',
}
// callback
client.query(query, (err, res) => {
  if (err) {
    console.log(err.stack)
  } else {
    console.log(res.fields.map(field => field.name)) // ['first_name', 'last_name']
    console.log(res.rows[0]) // ['Brian', 'Carlson']
  }
})
// promise
client
  .query(query)
  .then(res => {
    console.log(res.fields.map(field => field.name)) // ['first_name', 'last_name']
    console.log(res.rows[0]) // ['Brian', 'Carlson']
  })
  .catch(e => console.error(e.stack))


// type parsers
const query = {
  text: 'SELECT * from some_table',
  types: {
    getTypeParser: () => val => val,
  },
}


// connection pool module
const { Pool } = require('pg')
const pool = new Pool()
// the pool will emit an error on behalf of any idle clients
// it contains if a backend error or network partition happens
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})
// callback - checkout a client
pool.connect((err, client, done) => {
  if (err) throw err
  client.query('SELECT * FROM users WHERE id = $1', [1], (err, res) => {
    done()
    if (err) {
      console.log(err.stack)
    } else {
      console.log(res.rows[0])
    }
  })
})
// promise - checkout a client
pool
  .connect()
  .then(client => {
    return client
      .query('SELECT * FROM users WHERE id = $1', [1])
      .then(res => {
        client.release()
        console.log(res.rows[0])
      })
      .catch(err => {
        client.release()
        console.log(err.stack)
      })
  })
// async/await - check out a client
;(async () => {
  const client = await pool.connect()
  try {
    const res = await client.query('SELECT * FROM users WHERE id = $1', [1])
    console.log(res.rows[0])
  } finally {
    // Make sure to release the client before any error handling,
    // just in case the error handling itself throws an error.
    client.release()
  }
})().catch(err => console.log(err.stack))


// single query using the pool

const { Pool } = require('pg')
const pool = new Pool()
pool.query('SELECT * FROM users WHERE id = $1', [1], (err, res) => {
  if (err) {
    throw err
  }
  console.log('user:', res.rows[0])
})

// built in promises
const { Pool } = require('pg')
const pool = new Pool()
pool
  .query('SELECT * FROM users WHERE id = $1', [1])
  .then(res => console.log('user:', res.rows[0]))
  .catch(err =>
    setImmediate(() => {
      throw err
    })
  )

// async/await with node v8.0 and above
const { Pool } = require('pg')
const pool = new Pool()
;(async () => {
  const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [1])
  console.log('user:', rows[0])
})().catch(err =>
  setImmediate(() => {
    throw err
  })
)

// shutdown a pool
const { Pool } = require('pg')
const pool = new Pool()
;(async () => {
  console.log('starting async query')
  const result = await pool.query('SELECT NOW()')
  console.log('async query finished')
  console.log('starting callback query')
  pool.query('SELECT NOW()', (err, res) => {
    console.log('callback query finished')
  })
  console.log('calling end')
  await pool.end()
  console.log('pool has drained')
})()

// Transactions
const { Pool } = require('pg')
const pool = new Pool()
pool.connect((err, client, done) => {
  const shouldAbort = err => {
    if (err) {
      console.error('Error in transaction', err.stack)
      client.query('ROLLBACK', err => {
        if (err) {
          console.error('Error rolling back client', err.stack)
        }
        // release the client back to the pool
        done()
      })
    }
    return !!err
  }
  client.query('BEGIN', err => {
    if (shouldAbort(err)) return
    const queryText = 'INSERT INTO users(name) VALUES($1) RETURNING id'
    client.query(queryText, ['brianc'], (err, res) => {
      if (shouldAbort(err)) return
      const insertPhotoText = 'INSERT INTO photos(user_id, photo_url) VALUES ($1, $2)'
      const insertPhotoValues = [res.rows[0].id, 's3.bucket.foo']
      client.query(insertPhotoText, insertPhotoValues, (err, res) => {
        if (shouldAbort(err)) return
        client.query('COMMIT', err => {
          if (err) {
            console.error('Error committing transaction', err.stack)
          }
          done()
        })
      })
    })
  })
})


// pooled client with async/await
const { Pool } = require('pg')
const pool = new Pool()
;(async () => {
  // note: we don't try/catch this because if connecting throws an exception
  // we don't need to dispose of the client (it will be undefined)
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const queryText = 'INSERT INTO users(name) VALUES($1) RETURNING id'
    const res = await client.query(queryText, ['brianc'])
    const insertPhotoText = 'INSERT INTO photos(user_id, photo_url) VALUES ($1, $2)'
    const insertPhotoValues = [res.rows[0].id, 's3.bucket.foo']
    await client.query(insertPhotoText, insertPhotoValues)
    await client.query('COMMIT')
  } catch (e) {
    await client.query('ROLLBACK')
    throw e
  } finally {
    client.release()
  }
})().catch(e => console.error(e.stack))

