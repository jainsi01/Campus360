const StudyMaterialModel = require('../models/StudyMaterialModel');
const FacultyModel = require('../models/FacultyModel');
const asyncHandler = require('../utils/asyncHandler');
const { BadRequestError, NotFoundError } = require('../utils/ApiError');

const getMyStudyMaterials = asyncHandler(async (req, res) => {
  const faculty = await FacultyModel.findByUserId(req.user.id);
  if (!faculty) {
    return res.status(200).json({ success: true, data: [] });
  }

  const items = await StudyMaterialModel.getByFaculty(faculty.id);
  res.status(200).json({ success: true, data: items });
});

const getStudyMaterialsForSubject = asyncHandler(async (req, res) => {
  const items = await StudyMaterialModel.getBySubject(req.params.subjectId);
  res.status(200).json({ success: true, data: items });
});

const createStudyMaterial = asyncHandler(async (req, res) => {
  const { subjectId, title, description, fileUrl } = req.body;
  if (!subjectId || !title || !fileUrl) {
    throw new BadRequestError('subjectId, title and fileUrl are required');
  }

  const faculty = await FacultyModel.findByUserId(req.user.id);
  if (!faculty) {
    throw new BadRequestError('Faculty profile not found for this user');
  }

  const materialId = await StudyMaterialModel.create({
    subjectId,
    facultyId: faculty.id,
    title,
    description,
    fileUrl
  });

  res.status(201).json({ success: true, message: 'Study material uploaded successfully', data: { id: materialId } });
});

module.exports = {
  getMyStudyMaterials,
  getStudyMaterialsForSubject,
  createStudyMaterial
};
