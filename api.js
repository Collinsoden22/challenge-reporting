const axios = require('axios')
const cache = require('memory-cache')
const knex = require('./db')

module.exports = {
  getHealth,
  getStudent,
  getStudentGradesReport,
  getCourseGradesReport
}

// Get health
async function getHealth (req, res, next) {
  try {
    await knex('students').first()
    res.json({ success: true })
  } catch (e) {
    res.status(500).end()
  }
}

// Get student information
async function getStudent (req, res, next) {
  const { id } = req.params
  await getStudentWithId(id)
    .then((student) => {
      if (student) {
        return res.json({
          success: true,
          body: student[0]
        })
      } else {
        return res.status(404).json({
          error: 'Student not found.',
          success: false
        })
      }
    })
    .catch((error) => {
      console.log(error)
      return res.status(501).json({
        success: false,
        error: 'Internal Server error.'
      })
    })
}
// Get student grade report for all courses
async function getStudentGradesReport (req, res, next) {
  try {
    const id = parseInt(req.params.id)
    const currentStudentData = await getStudentWithId(id)
    const allStudentsGrades = await getStudentGradeFromRemoteSource()
    const currentStudentGrades = allStudentsGrades.filter((grade) => grade.id === id)
    const filteredGrades = currentStudentGrades.map(({ grade, course }) => ({ grade, course }))

    if (currentStudentGrades && currentStudentData) {
      return res.json({
        success: true,
        body: {
          student: currentStudentData[0],
          grades: filteredGrades
        }
      })
    }
    return res.status(404).json({
      success: false,
      error: 'Student not found.'
    })
  } catch (error) {
    console.log(error)
    return res.status(501).json({
      success: false,
      error: 'The server encountered an error while processing your request.'
    })
  };
};

// Get all courses' grade report
async function getCourseGradesReport (req, res, next) {
  try {
    // Fetch grades from remote source
    const allStudentsGrades = await getStudentGradeFromRemoteSource()
    if (!allStudentsGrades) {
      return res.status(302).json({
        success: false,
        error: 'Could not process request'
      })
    }
    const statistics = {}
    allStudentsGrades.forEach((entry) => {
      const courseId = entry.course
      const grade = entry.grade

      if (!statistics[courseId]) {
        statistics[courseId] = {
          highestGrade: grade,
          lowestGrade: grade,
          totalGrades: 0,
          gradeCount: 0
        }
      }

      const courseStatistics = statistics[courseId]
      courseStatistics.highestGrade = Math.max(courseStatistics.highestGrade, grade)
      courseStatistics.lowestGrade = Math.min(courseStatistics.lowestGrade, grade)
      courseStatistics.totalGrades += grade
      courseStatistics.gradeCount++
    })

    // Calculate average grades for each course
    for (const courseId in statistics) {
      const courseStatistics = statistics[courseId]
      courseStatistics.averageGrade = courseStatistics.totalGrades / courseStatistics.gradeCount
    }
    return res.json({
      success: true,
      body: {
        statistics
      }
    })
  } catch (error) {
    console.log(error)
    return res.status(501).json({
      success: false,
      error: 'The server encountered an error while processing your request.'
    })
  }
};

// Get student information with Id
function getStudentWithId (id) {
  return knex('students')
    .where({ id })
    .select('*')
};

// Get student courses and grade from remote source
async function getStudentGradeFromRemoteSource () {
  try {
    const studentCacheKey = 'students'
    const cacheDuration = 3600 * 24000 // Set Cachine for 24 hours
    const cachedStudentGrade = cache.get(studentCacheKey)
    if (cachedStudentGrade) { return cachedStudentGrade };

    const url = 'https://outlier-coding-test-data.onrender.com/grades.json'
    const allStudentsRemoteData = await axios.get(url)
    if (allStudentsRemoteData.status === 200) {
      cache.put(studentCacheKey, allStudentsRemoteData.data, cacheDuration)
      return allStudentsRemoteData.data
    }
    return false
  } catch (error) {
    return false
  }
}
