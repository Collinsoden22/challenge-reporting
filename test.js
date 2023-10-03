const tape = require('tape')
const jsonist = require('jsonist')

const port = (process.env.PORT = process.env.PORT || require('get-port-sync')())
const endpoint = `http://localhost:${port}`

const server = require('./server')

tape('health', async function (t) {
  const url = `${endpoint}/health`
  try {
    const { data, response } = await jsonist.get(url)
    if (response.statusCode !== 200) {
      throw new Error('Error connecting to sqlite database; did you initialize it by running `npm run init-db`?')
    }
    t.ok(data.success, 'should have successful healthcheck')
    t.end()
  } catch (e) {
    t.error(e)
  }
})

tape('GET /student/:id should return a student by ID', async function (t) {
  const url = `${endpoint}/student/2`
  try {
    const { data, response } = await jsonist.get(url)
    if (response.statusCode !== 200) {
      throw new Error(`Error: ${data.body.error}`)
    }
    t.ok(data.success, 'Student information was retrieved.')
    t.ok(data.body, 'Response body exist')
    t.end()
  } catch (e) {
    t.error(e)
  }
})

tape('GET /student/:id/grades should return a student grades report by ID', async function (t) {
  const url = `${endpoint}/student/1/grades`
  try {
    const { data, response } = await jsonist.get(url)
    if (response.statusCode !== 200) {
      throw new Error(`Error: ${response.body.error}`)
    }
    t.ok(data.success, 'Student information was retrieved.')
    t.ok(data.body, 'Response body exist')
    t.ok(data.body.student, 'Response contains student property')
    t.ok(data.body.grades, 'Response contains grades property')
    t.end()
  } catch (e) {
    t.error(e)
  }
})

tape('GET /course/all/grades should return course grades report', async function (t) {
  const url = `${endpoint}/course/all/grades`
  try {
    const { data, response } = await jsonist.get(url)
    if (response.statusCode !== 200) {
      throw new Error(`Error: ${response.body.error}`)
    }
    t.ok(data.success, 'Course grades were retrieved.')
    t.ok(data.body, 'Response body exist.')
    t.ok(data.body.statistics, 'Response has statistics.')
    t.end()
  } catch (e) {
    t.error(e)
  }
})

tape('cleanup', function (t) {
  server.closeDB()
  server.close()
  t.end()
})
