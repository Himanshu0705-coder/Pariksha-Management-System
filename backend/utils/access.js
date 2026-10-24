const pool = require('../config/db');

// Student ka department id (student.course == departments.name)
exports.studentDepartmentId = async function (studentId) {
  const { rows } = await pool.query(
    'SELECT d.id FROM students s JOIN departments d ON d.name = s.course WHERE s.id = $1',
    [studentId]
  );
  return rows[0] ? rows[0].id : null;
};
