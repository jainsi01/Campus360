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

const getSubjects = asyncHandler(async (req, res) => {
  const dept = await getScopedDepartment(req);
  if (!dept) throw new NotFoundError('No department found associated with your account.');

  const subjects = await HodModel.getSubjectsByDepartment(dept.id);
  res.status(200).json({ success: true, department: dept, data: subjects });
});

const addSubject = asyncHandler(async (req, res) => {
  const dept = await getScopedDepartment(req);
  if (!dept) throw new NotFoundError('No department found associated with your account.');

  const { name, code, courseId, semester, credits } = req.body;
  const subjectId = await HodModel.addDepartmentSubject({
    name,
    code,
    departmentId: dept.id,
    courseId,
    semester,
    credits
  });

  res.status(201).json({ success: true, message: 'Department subject added successfully', data: { id: subjectId } });
});

const editSubject = asyncHandler(async (req, res) => {
  const dept = await getScopedDepartment(req);
  if (!dept) throw new NotFoundError('No department found associated with your account.');

  const { name, code, courseId, semester, credits } = req.body;
  await HodModel.editDepartmentSubject({
    id: req.params.id,
    departmentId: dept.id,
    name,
    code,
    courseId,
    semester,
    credits
  });

  res.status(200).json({ success: true, message: 'Department subject updated successfully' });
});

const assignFacultyToSubject = asyncHandler(async (req, res) => {
  const dept = await getScopedDepartment(req);
  if (!dept) throw new NotFoundError('No department found associated with your account.');

  const { facultyId, subjectId, academicYear, semester } = req.body;
  await HodModel.assignFacultyToSubject({ facultyId, subjectId, academicYear, semester });

  res.status(200).json({ success: true, message: 'Faculty assigned to department subject successfully' });
});

const getAssignments = asyncHandler(async (req, res) => {
  const dept = await getScopedDepartment(req);
  if (!dept) throw new NotFoundError('No department found associated with your account.');

  const assignments = await HodModel.getDepartmentAssignments(dept.id);
  res.status(200).json({ success: true, department: dept, data: assignments });
});

const getNotices = asyncHandler(async (req, res) => {
  const dept = await getScopedDepartment(req);
  if (!dept) throw new NotFoundError('No department found associated with your account.');

  const notices = await HodModel.getDepartmentNotices(dept.id);
  res.status(200).json({ success: true, department: dept, data: notices });
});

const createNotice = asyncHandler(async (req, res) => {
  const dept = await getScopedDepartment(req);
  if (!dept) throw new NotFoundError('No department found associated with your account.');

  const { title, description, targetRole, publishDate, expiryDate } = req.body;
  const noticeId = await HodModel.createDepartmentNotice({
    title,
    description,
    createdBy: req.user.id,
    targetRole,
    departmentId: dept.id,
    publishDate,
    expiryDate
  });

  res.status(201).json({ success: true, message: 'Department notice published successfully', data: { id: noticeId } });
});

const editNotice = asyncHandler(async (req, res) => {
  const dept = await getScopedDepartment(req);
  if (!dept) throw new NotFoundError('No department found associated with your account.');

  const { title, description, targetRole, publishDate, expiryDate } = req.body;
  await HodModel.editDepartmentNotice({
    id: req.params.id,
    departmentId: dept.id,
    title,
    description,
    targetRole,
    publishDate,
    expiryDate
  });

  res.status(200).json({ success: true, message: 'Department notice updated successfully' });
});

const deleteNotice = asyncHandler(async (req, res) => {
  const dept = await getScopedDepartment(req);
  if (!dept) throw new NotFoundError('No department found associated with your account.');

  await HodModel.deleteDepartmentNotice(req.params.id, dept.id);
  res.status(200).json({ success: true, message: 'Department notice deleted successfully' });
});

const approveResults = asyncHandler(async (req, res) => {
  const dept = await getScopedDepartment(req);
  if (!dept) throw new NotFoundError('No department found associated with your account.');

  const { examId, subjectId } = req.body;
  const approval = await HodModel.approveResults({ departmentId: dept.id, examId, subjectId });
  res.status(200).json({ success: true, message: 'Department academic results approved successfully', data: approval });
});

module.exports = {
  getDashboard,
  getStudents,
  getFaculty,
  getAttendanceAnalytics,
  getAcademicAnalytics,
  getResults,
  getReports,
  getFilters,
  getSubjects,
  addSubject,
  editSubject,
  assignFacultyToSubject,
  getAssignments,
  getNotices,
  createNotice,
  editNotice,
  deleteNotice,
  approveResults
};
