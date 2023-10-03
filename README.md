![Outlier.org](https://i.imgur.com/vJowpL1.png)

---

# Outlier Engineering Node.js Reporting Challenge

Our apps need to query and store lots of information. We want to make sure that you have a good understanding of JavaScript and Node.js fundamentals. Can you build a simple API that can read data from multiple sources, aggregate, and report with Node.js while following [Outlier's best practices](https://github.com/outlier-org/onboarding/blob/master/README.md#engineering-onboarding-guide)?

## The Challenge

- Implement the `getStudent` method in `api.js`. This should fetch a student record from the `students` table in the database as indicated by the `id` passed in, and return the information as JSON.

- Implement the `getStudentGradesReport` method in `api.js`. This report should use student grade data from the following remote source: https://outlier-coding-test-data.onrender.com/grades.json, where the id in the JSON data matches the id in the students database. The output should include student details as well as their grades information, in JSON format.

- Implement the `getCourseGradesReport` method in `api.js`. This report should contain the following statistics for *each course*: highest grade of all students, lowest grade of all students, average grade across all students. Return the data in JSON format.

- Create tests relevant for the endpoints.

- You must not block the main thread. Thread blockage will be reported in the console by the server.

- Each endpoint should be performant and respond with complete data in fewer than 500ms.

- `server.js` should not be modified in this challenge.

- Part of this challenge is to evaluate your ability to deliver a creative solution that delivers on the requirements. There are no other rules besides the ones stated in this document.

## System Overview
  - Student data is stored in the `students` table in a database (students.db).
  - The database can be downloaded to your environment by running `npm run init-db`. Running this will overwrite any existing file named `students.db`. This is a [SQLite 3](https://www.sqlite.org/index.html) database, which is accessed using the [knex](https://github.com/knex/knex) query builder library.
  - Remote grade data exists at https://outlier-coding-test-data.onrender.com/grades.json and does not change.
  - Running `npm start` will run the server so that you can test the existing endpoint and write your own. The server uses [express.js](https://expressjs.com/). 
  - Running `npm test` will run the unit tests in `tests.js`. Tests are written in [tape](https://github.com/substack/tape).
  

## Instructions

How to attempt this challenge:

1) Create a new repo in your account and note the git url
2) Clone this repo
3) Run `npm run init-db` to initialize the local SQLite database
4) Solve the challenge
5) Set your new repo as the origin: `git remote set-url origin ${your repo url}`
6) Push your solution to your repo

You must follow these steps for your solution to be accepted -- forks or other methods will not be considered.
