const AnalyticsModel = require('../models/AnalyticsModel');
const asyncHandler = require('../utils/asyncHandler');

const getFullAnalytics = asyncHandler(async (req, res) => {
  const analyticsData = await AnalyticsModel.getFullAnalytics();
  res.status(200).json({
    success: true,
    data: analyticsData
  });
});

const getStudentsByDepartment = asyncHandler(async (req, res) => {
  const data = await AnalyticsModel.getStudentsByDepartment();
  res.status(200).json({
    success: true,
    data
  });
});

const getAttendanceTrends = asyncHandler(async (req, res) => {
  const data = await AnalyticsModel.getAttendanceTrends();
  res.status(200).json({
    success: true,
    data
  });
});

const getAverageMarks = asyncHandler(async (req, res) => {
  const data = await AnalyticsModel.getAverageMarksBySubject();
  res.status(200).json({
    success: true,
    data
  });
});

const getCgpaDistribution = asyncHandler(async (req, res) => {
  const data = await AnalyticsModel.getCgpaDistribution();
  res.status(200).json({
    success: true,
    data
  });
});

const getFeeCollection = asyncHandler(async (req, res) => {
  const data = await AnalyticsModel.getFeeCollection();
  res.status(200).json({
    success: true,
    data
  });
});

const getAssignmentCompletion = asyncHandler(async (req, res) => {
  const data = await AnalyticsModel.getAssignmentCompletion();
  res.status(200).json({
    success: true,
    data
  });
});

module.exports = {
  getFullAnalytics,
  getStudentsByDepartment,
  getAttendanceTrends,
  getAverageMarks,
  getCgpaDistribution,
  getFeeCollection,
  getAssignmentCompletion
};
