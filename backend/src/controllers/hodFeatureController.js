const HodModel = require('../models/HodModel');
const asyncHandler = require('../utils/asyncHandler');
const { NotFoundError } = require('../utils/ApiError');

const getScopedDepartment = async (req) => {
  if (req.user.role === 'ADMIN') {
    if (!req.query.departmentId) throw new NotFoundError('departmentId is required for an administrator department view');
    return HodModel.getDepartmentById(req.query.departmentId);
  }
  return HodModel.getDepartmentByHodUser(req.user.id);
};

const getDashboard = asyncHandler(async (req, res) => {
  const dept = await getScopedDepartment(req);
  if (!dept) {
    throw new NotFoundError('No department found associated with your account.');
  }

  const overview = await HodModel.getDashboardOverview(dept.id);

  res.status(200).json({
    success: true,
    data: overview
  });
});

const getStudents = asyncHandler(async (req, res) => {
  const dept = await getScopedDepartment(req);
  if (!dept) {
    throw new NotFoundError('No department found associated with your account.');
  }

  const { courseId, semester, search } = req.query;
  const students = await HodModel.getDepartmentStudents(dept.id, { courseId, semester, search });

  res.status(200).json({
    success: true,
    department: dept,
    count: students.length,
    data: students
  });
});

const getFaculty = asyncHandler(async (req, res) => {
  const dept = await getScopedDepartment(req);
  if (!dept) {
    throw new NotFoundError('No department found associated with your account.');
  }

  const { search } = req.query;
  const faculty = await HodModel.getDepartmentFaculty(dept.id, { search });

  res.status(200).json({
    success: true,
    department: dept,
    count: faculty.length,
    data: faculty
  });
});

const getAttendanceAnalytics = asyncHandler(async (req, res) => {
  const dept = await getScopedDepartment(req);
  if (!dept) {
    throw new NotFoundError('No department found associated with your account.');
  }

  const { subjectId, courseId, semester } = req.query;
  const analytics = await HodModel.getAttendanceAnalytics(dept.id, { subjectId, courseId, semester });

  res.status(200).json({
    success: true,
    department: dept,
    data: analytics
  });
});

const getAcademicAnalytics = asyncHandler(async (req, res) => {
  const dept = await getScopedDepartment(req);
  if (!dept) {
    throw new NotFoundError('No department found associated with your account.');
  }

  const { subjectId, courseId, semester, examId } = req.query;
  const analytics = await HodModel.getAcademicAnalytics(dept.id, { subjectId, courseId, semester, examId });

  res.status(200).json({
    success: true,
    department: dept,
    data: analytics
  });
});

const getResults = asyncHandler(async (req, res) => {
  const dept = await getScopedDepartment(req);
  if (!dept) {
    throw new NotFoundError('No department found associated with your account.');
  }

  const { examId, subjectId, courseId, semester, search } = req.query;
  const resultsData = await HodModel.getResults(dept.id, { examId, subjectId, courseId, semester, search });

  res.status(200).json({
    success: true,
    department: dept,
    data: resultsData
  });
});

const getReports = asyncHandler(async (req, res) => {
  const dept = await getScopedDepartment(req);
  if (!dept) {
    throw new NotFoundError('No department found associated with your account.');
  }

  const reportsData = await HodModel.getReportsData(dept.id);

  res.status(200).json({
    success: true,
    data: reportsData
  });
});

const getFilters = asyncHandler(async (req, res) => {
  const dept = await getScopedDepartment(req);
  if (!dept) {
    throw new NotFoundError('No department found associated with your account.');
  }

  const courses = await HodModel.getCoursesByDepartment(dept.id);
  const subjects = await HodModel.getSubjectsByDepartment(dept.id);
  const exams = await HodModel.getExams();

  res.status(200).json({
    success: true,
    data: {
      department: dept,
      courses,
      subjects,
      exams
    }
  });
});

module.exports = {
  getDashboard,
  getStudents,
  getFaculty,
  getAttendanceAnalytics,
  getAcademicAnalytics,
  getResults,
  getReports,
  getFilters
};
