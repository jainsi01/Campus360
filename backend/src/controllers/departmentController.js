const DepartmentModel = require('../models/DepartmentModel');
const AuditLogModel = require('../models/AuditLogModel');
const asyncHandler = require('../utils/asyncHandler');
const { NotFoundError, BadRequestError } = require('../utils/ApiError');

const getAllDepartments = asyncHandler(async (req, res) => {
  const departments = await DepartmentModel.getAll();
  res.status(200).json({
    success: true,
    data: departments
  });
});

const getDepartmentById = asyncHandler(async (req, res) => {
  const department = await DepartmentModel.findById(req.params.id);
  if (!department) {
    throw new NotFoundError(`Department with ID ${req.params.id} not found`);
  }
  res.status(200).json({
    success: true,
    data: department
  });
});

const createDepartment = asyncHandler(async (req, res) => {
  const { name, code, hodId } = req.body;

  const existing = await DepartmentModel.findByCode(code);
  if (existing) {
    throw new BadRequestError(`Department code '${code}' already exists`);
  }

  const deptId = await DepartmentModel.create({ name, code, hodId });
  const department = await DepartmentModel.findById(deptId);

  await AuditLogModel.logAction({
    userId: req.user.id,
    action: 'CREATE_DEPARTMENT',
    entityType: 'departments',
    entityId: deptId,
    description: `Created department ${name} (${code})`
  });

  res.status(201).json({
    success: true,
    message: 'Department created successfully',
    data: department
  });
});

const updateDepartment = asyncHandler(async (req, res) => {
  const { name, code, hodId } = req.body;
  const deptId = req.params.id;

  const existing = await DepartmentModel.findById(deptId);
  if (!existing) {
    throw new NotFoundError(`Department with ID ${deptId} not found`);
  }

  if (code && code !== existing.code) {
    const codeCheck = await DepartmentModel.findByCode(code);
    if (codeCheck) {
      throw new BadRequestError(`Department code '${code}' already exists`);
    }
  }

  await DepartmentModel.update(deptId, {
    name: name || existing.name,
    code: code || existing.code,
    hodId: hodId !== undefined ? hodId : existing.hod_id
  });

  const updatedDept = await DepartmentModel.findById(deptId);

  await AuditLogModel.logAction({
    userId: req.user.id,
    action: 'UPDATE_DEPARTMENT',
    entityType: 'departments',
    entityId: deptId,
    description: `Updated department ${updatedDept.name}`
  });

  res.status(200).json({
    success: true,
    message: 'Department updated successfully',
    data: updatedDept
  });
});

const deleteDepartment = asyncHandler(async (req, res) => {
  const deptId = req.params.id;
  const existing = await DepartmentModel.findById(deptId);
  if (!existing) {
    throw new NotFoundError(`Department with ID ${deptId} not found`);
  }

  await DepartmentModel.delete(deptId);

  await AuditLogModel.logAction({
    userId: req.user.id,
    action: 'DELETE_DEPARTMENT',
    entityType: 'departments',
    entityId: deptId,
    description: `Deleted department ${existing.name}`
  });

  res.status(200).json({
    success: true,
    message: 'Department deleted successfully'
  });
});

module.exports = {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment
};
