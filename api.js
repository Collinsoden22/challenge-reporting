const knex = require('./db')
const axios = require('axios');
const cache = require('memory-cache');

module.exports = {
  getHealth,
  getStudent,
  getStudentGradesReport,
  getCourseGradesReport
}

const cacheKey = 'students';
const duration = 3600 * 24000; // Set Cachine for 24 hours

// Get student information with Id
function getStudentWithId(id) {
  return knex('students')
  .where({ id })
  .select('*');
};

// Get student courses and grade from remote source
async function getStudentGradeFromRemoteSource() {
  try{
  // Check cache students grades
  const cachedValue = cache.get(cacheKey);
  if (cachedValue) { return cachedValue };

  const url = 'https://outlier-coding-test-data.onrender.com/grades.json';
  // Fetch data from remote source
  const response = await axios.get(url);
  if (response.status === 200){
    cache.put(cacheKey, response.data, duration);
    return response.data;
  }
  return false;
} catch (error) {
  return false;
}
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
async function getStudent (req, res, next)  {
    const { id } = req.params;
    await getStudentWithId(id)
    .then((student) => {
      if (student) {
        return res.json({
          success: true,
          body: student[0],
        });
      } else {
        return res.status(404).json({
          error: 'Student not found.',
          success: false,
        });
      }
    })
    .catch((error) => {
      return res.status(501).json({
        success: false,
        error: 'Internal Server error.',
      });
    });
}
// Get student grade report for all courses
async function getStudentGradesReport (req, res, next) {
  try {
  // Get student Id && convert to int
  const id = parseInt(req.params.id);
  // Fetch student details
  const student = await getStudentWithId(id);
    // Fetch grades from remote source
    const grades = await getStudentGradeFromRemoteSource();

  // Filter grades matching id
  const studentGrades = grades.filter((grade) => grade.id === id);
  // Filter only course and grade, without id
  const filteredGrades = studentGrades.map(({grade, course}) => ({grade, course}));

  if (grades && student) {
    return res.json({
      success: true,
      body: {
        student: student[0],
        grades: filteredGrades,
      },
    });
  }
  return res.status(404).json({
    success: false,
    error: 'Student not found.',
  });
} catch (error) {
    console.log(error);
    return res.status(501).json({
      success: false,
      error: 'The server encountered an error while processing your request.',
    });
  };
}
// Get all courses' grade report
async function getCourseGradesReport (req, res, next) {
  try {
  // Fetch grades from remote source
  const studentsGrades = await getStudentGradeFromRemoteSource();
  if (!studentsGrades) {
    return res.status(302).json({
      success: false,
      error: 'Could not process request',
    });
  };
    // Calculate course statistics
    const statistics = {};

    studentsGrades.forEach((entry) => {
      const courseId = entry.course;
      const grade = entry.grade;

      if (!statistics[courseId]) {
        statistics[courseId] = {
          highestGrade: grade,
          lowestGrade: grade,
          totalGrades: 0,
          gradeCount: 0,
        };
      }

      const courseStats = statistics[courseId];
      courseStats.highestGrade = Math.max(courseStats.highestGrade, grade);
      courseStats.lowestGrade = Math.min(courseStats.lowestGrade, grade);
      courseStats.totalGrades += grade;
      courseStats.gradeCount++;
    });

    // Calculate average grades for each course
    for (const courseId in statistics) {
      const courseStats = statistics[courseId];
      courseStats.averageGrade = courseStats.totalGrades / courseStats.gradeCount;
    }
  return res.json({
    success: true,
    body: {
      statistics,
    },
  });
} catch(error) {
     return res.status(501).json({
      success: false,
      error: 'The server encountered an error while processing your request.',
    });
  }
}
