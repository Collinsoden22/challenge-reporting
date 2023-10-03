const blocked = require('blocked-at')
const express = require('express')
const db = require('./db')

blocked((time, stack) => {
  console.error(`Blocked for ${time}ms, operation started here:`, stack)
})

const api = require('./api')
const middleware = require('./middleware')

const PORT = process.env.PORT || 1337

const app = express()

app.use(express.json())

app.get('/health', api.getHealth)
app.get('/student/:id', api.getStudent)
app.get('/student/:id/grades', api.getStudentGradesReport)
app.get('/course/all/grades', api.getCourseGradesReport)

app.use(middleware.handleError)
app.use(middleware.notFound)

const server = app.listen(PORT, () =>
  console.log(`Server listening on port ${PORT}`)
)

server.closeDB = () => db.destroy()

if (require.main !== module) {
  module.exports = server
}
