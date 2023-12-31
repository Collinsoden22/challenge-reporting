![Outlier.org](https://i.imgur.com/vJowpL1.png)

---

# Outlier Engineering Node.js Reporting Challenge

Our apps need to query and store lots of information. We want to make sure that you have a good understanding of JavaScript and Node.js fundamentals. Can you build a simple API that can read data from multiple sources, aggregate, and report with Node.js while following [Outlier's best practices](https://github.com/outlier-org/onboarding/blob/master/README.md#engineering-onboarding-guide)?

## The Challenge

- Implemented the `getStudent` method in `api.js`. This fetches a student record from the `students` table in the database as indicated by the `id` passed in, and returns the information as JSON.

- Implemented the `getStudentGradesReport` method in `api.js`. This report uses student grade data from the following remote source: https://outlier-coding-test-data.onrender.com/grades.json, where the id in the JSON data matches the id in the students database. The output includes student details as well as their grades information, in JSON format.

- Implemented the `getCourseGradesReport` method in `api.js`. This report contains the following statistics for *each course*: highest grade of all students, lowest grade of all students, average grade across all students. Returns the data in JSON format.

- Created tests relevant for the endpoints.

- Ensured main thread remains unblocked. Thread blockage is reported in the console by the server.

- Each endpoint performs and responds with complete data in fewer than 500ms.

- `server.js` was not modified in this challenge.

## System Overview
  - Student data is stored in the `students` table in a database (students.db).
  - The database can be downloaded to your environment by running `npm run init-db`. Running this will overwrite any existing file named `students.db`. This is a [SQLite 3](https://www.sqlite.org/index.html) database, which is accessed using the [knex](https://github.com/knex/knex) query builder library.
  - Remote grade data exists at https://outlier-coding-test-data.onrender.com/grades.json and does not change.
  - Running `npm start` will run the server so that you can test the existing endpoint and write your own. The server uses [express.js](https://expressjs.com/).
  - Running `npm test` will run the unit tests in `tests.js`. Tests are written in [tape](https://github.com/substack/tape).
