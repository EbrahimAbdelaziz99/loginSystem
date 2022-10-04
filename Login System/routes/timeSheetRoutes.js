const express = require("express");
const router = express.Router();
const { isAdmin, isLoggedIn , validateTimesheet , isOwner } = require('../middleware');
const timesheetsController = require('../controllers/timesheetsController');

// Error handler 

const catchAsync = require('../utils/catchAsync');

/////////////////////////////////////////////////////////////////

// Route To Show Filters To The Admin

router.get('/all',isLoggedIn,isAdmin,catchAsync(timesheetsController.adminFilter));

// Route To Apply Filters

router.post('/all',isLoggedIn,isAdmin,catchAsync(timesheetsController.applyAdminFilter));

// Route To Show Reports 

router.get('/reports',isLoggedIn,isAdmin,catchAsync(timesheetsController.Reports));

// Route To Apply Reports 

router.post('/reports',isLoggedIn,isAdmin,catchAsync(timesheetsController.applyReports));

// Showing The New-Timesheet Form 

router.get('/show/:id',isLoggedIn,isOwner,catchAsync(timesheetsController.show));

// Showing The New-Timesheet Form 

router.get('/new',isLoggedIn,catchAsync(timesheetsController.newForm));

// filtering the projects to get the right category for each one

router.post('/new',isLoggedIn,catchAsync(timesheetsController.filterCategory));

// Route To Create New-Timesheet  

router.post('/create',isLoggedIn,validateTimesheet,catchAsync(timesheetsController.createNew));

// Route To Show Single User All His Personal Records "Timesheets" 

router.get('/all/:id',isLoggedIn,catchAsync(timesheetsController.userAll));

// Showing The Edit-Timesheet Form 

router.get('/:id/edit',isLoggedIn,catchAsync(timesheetsController.editForm));

// Route To Edit An Existing Timesheet  

router.put('/:id',isLoggedIn,isOwner,catchAsync(timesheetsController.edit));

// Route To archive Timesheet  

router.post('/:id/:userId',isLoggedIn,isOwner,catchAsync(timesheetsController.archive));

// route for employees manhours summary

router.get('/employees',isLoggedIn,isAdmin,catchAsync(timesheetsController.employeesSheet));

// route for employees timesheet summary 

router.post('/summary' ,isLoggedIn ,catchAsync(timesheetsController.employeeSummary))

// route for deleting timesheet 

router.delete('/:id/:userId',isLoggedIn,isOwner,catchAsync(timesheetsController.deleteTimesheet));

module.exports = router;