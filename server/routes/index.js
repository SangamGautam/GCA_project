import express from 'express';
import db from '../db/database.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Welcome to the API Server');
});

router.get('/students', (req, res) => {
  console.log("Received query parameters:", req.query);

  let query = `
    SELECT
      students.*,
      uni.Name as UniversityName,
      uniGroup.Desc as UniGroupDescription,
      state.Desc as StateDescription,
      studyLevel.Desc as StudyLevelDescription,
      studyAreaQILT.Desc as StudyAreaQILTDescription,
      studyAreaFaculty.Desc as StudyAreaFacultyDescription,
      studyAreaDiscipline.Desc as StudyAreaDisciplineDescription,
      yearOfProgram.Desc as YearOfProgramDescription,
      studyMode.Desc as StudyModeDescription,
      campusType.Desc as CampusTypeDescription,
      studentType.Desc as StudentTypeDescription,
      gender.Desc as GenderDescription,
      q1Responses.ResponseDate as Q1ResponseDate,
      q1Ques.Desc as Q1QuestionDescription,
      q1Stage.Desc as Q1StageDescription,
      q1Response.Desc as Q1ResponseDescription,
      q2Responses.ResponseDate as Q2ResponseDate,
      q2Ques.Desc as Q2QuestionDescription,
      q2Stage.Desc as Q2StageDescription,
      q2Response.Desc as Q2ResponseDescription
    FROM CR_Student students
    LEFT JOIN Uni uni ON students.UniId = uni.UniId
    LEFT JOIN Ref_UniGroup uniGroup ON uni.UniGroup = uniGroup.Id
    LEFT JOIN Ref_State state ON uni.State = state.Id
    LEFT JOIN Ref_StudyLevel studyLevel ON students.StudyLevel = studyLevel.Id
    LEFT JOIN Ref_StudyAreaQILT studyAreaQILT ON students.StudyAreaQILT = studyAreaQILT.Id
    LEFT JOIN Ref_StudyAreaFaculty studyAreaFaculty ON students.StudyAreaFaculty = studyAreaFaculty.Id
    LEFT JOIN Ref_StudyAreaDiscipline studyAreaDiscipline ON students.StudyAreaDiscipline = studyAreaDiscipline.Id
    LEFT JOIN Ref_YearOfProgram yearOfProgram ON students.YearOfProgram = yearOfProgram.Id
    LEFT JOIN Ref_StudyMode studyMode ON students.StudyMode = studyMode.Id
    LEFT JOIN Ref_CampusType campusType ON students.CampusType = campusType.Id
    LEFT JOIN Ref_StudentType studentType ON students.StudentType = studentType.Id
    LEFT JOIN Ref_Gender gender ON students.Gender = gender.Id
    LEFT JOIN CR_Responses q1Responses ON students.Student = q1Responses.Student AND students.UniId = q1Responses.UniId AND q1Responses.Ques = 1
    LEFT JOIN Ques q1Ques ON q1Responses.Ques = q1Ques.Id
    LEFT JOIN Stage q1Stage ON q1Responses.Ques = q1Stage.Ques AND q1Responses.Stage = q1Stage.Stage
    LEFT JOIN Response q1Response ON q1Responses.Ques = q1Response.Ques AND q1Responses.Response = q1Response.Response
    LEFT JOIN CR_Responses q2Responses ON students.Student = q2Responses.Student AND students.UniId = q2Responses.UniId AND q2Responses.Ques = 2
    LEFT JOIN Ques q2Ques ON q2Responses.Ques = q2Ques.Id
    LEFT JOIN Stage q2Stage ON q2Responses.Ques = q2Stage.Ques AND q2Responses.Stage = q2Stage.Stage
    LEFT JOIN Response q2Response ON q2Responses.Ques = q2Response.Ques AND q2Responses.Response = q2Response.Response
  `;

  const queryParams = [];
  const conditions = [];

  // Explicit mapping from query parameters to database fields
  const fieldMapping = {
    studyLevel: 'studyLevel.Id',
    studentTypes: 'studentType.Id',
    studyAreas: 'studyAreaQILT.Id',
    yearOfProgram: 'yearOfProgram.Id',
    studyMode: 'studyMode.Id',
    campusType: 'campusType.Id'
  };

    // Add conditions for each filter type from query parameters
    Object.entries(req.query).forEach(([key, value]) => {
        if (fieldMapping[key]) {
        if (value !== 'All') {
            conditions.push(`${fieldMapping[key]} = ?`);
            queryParams.push(value);
        }
        }
    });

  if (conditions.length) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' ORDER BY students.Student, q1Responses.ResponseDate, q2Responses.ResponseDate;';

  console.log("Final SQL Query:", query);
  console.log("SQL Parameters:", queryParams);

  db.all(query, queryParams, (err, rows) => {
    if (err) {
      console.error("Database error:", err.message);
      res.status(500).json({ error: err.message });
      return;
    }

    if (rows.length === 0) {
      console.log("No data found matching the criteria.");
      res.json({ message: "No data found matching the criteria.", students: [] });
    } else {
      const studentData = {};

      rows.forEach((row) => {
        const studentId = row.Student;

        if (!studentData[studentId]) {
          studentData[studentId] = {
            UniId: row.UniId,
            Student: row.Student,
            StudyLevel: row.StudyLevel,
            StudyAreaQILT: row.StudyAreaQILT,
            StudyAreaFaculty: row.StudyAreaFaculty,
            StudyAreaDiscipline: row.StudyAreaDiscipline,
            CohortYear: row.CohortYear,
            YearOfProgram: row.YearOfProgram,
            StudyMode: row.StudyMode,
            CreditsTotal: row.CreditsTotal,
            CreditsThisYear: row.CreditsThisYear,
            CreditsPriorYears: row.CreditsPriorYears,
            CampusType: row.CampusType,
            StudentType: row.StudentType,
            Gender: row.Gender,
            UniversityName: row.UniversityName,
            UniGroupDescription: row.UniGroupDescription,
            StateDescription: row.StateDescription,
            StudyLevelDescription: row.StudyLevelDescription,
            StudyAreaQILTDescription: row.StudyAreaQILTDescription,
            StudyAreaFacultyDescription: row.StudyAreaFacultyDescription,
            StudyAreaDisciplineDescription: row.StudyAreaDisciplineDescription,
            YearOfProgramDescription: row.YearOfProgramDescription,
            StudyModeDescription: row.StudyModeDescription,
            CampusTypeDescription: row.CampusTypeDescription,
            StudentTypeDescription: row.StudentTypeDescription,
            GenderDescription: row.GenderDescription,
            Q1Responses: [],
            Q2Responses: [],
          };
        }

        const q1Response = {
          ResponseDate: row.Q1ResponseDate,
          QuestionDescription: row.Q1QuestionDescription,
          StageDescription: row.Q1StageDescription,
          ResponseDescription: row.Q1ResponseDescription,
        };

        const q2Response = {
          ResponseDate: row.Q2ResponseDate,
          QuestionDescription: row.Q2QuestionDescription,
          StageDescription: row.Q2StageDescription,
          ResponseDescription: row.Q2ResponseDescription,
        };

        if (q1Response.ResponseDate && !studentData[studentId].Q1Responses.some(r => r.ResponseDate === q1Response.ResponseDate)) {
          studentData[studentId].Q1Responses.push(q1Response);
        }

        if (q2Response.ResponseDate && !studentData[studentId].Q2Responses.some(r => r.ResponseDate === q2Response.ResponseDate && r.ResponseDescription === q2Response.ResponseDescription)) {
          studentData[studentId].Q2Responses.push(q2Response);
        }
      });

      const transformedData = Object.values(studentData);

      console.log("Data retrieved:", transformedData.length);
      res.json({ students: transformedData });
    }
  });
});

router.get('/students/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM CR_Student WHERE Student = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (row) {
      res.json({ student: row });
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  });
});


export default router;
