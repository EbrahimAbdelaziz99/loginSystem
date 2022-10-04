const TimeSheet = require('../models/timeSheet');
const Project = require('../models/project');
const User = require('../models/user');
const Category = require('../models/category');

// Function To Show The Timesheet 

module.exports.show = async(req,res,next) => {
    const timesheet = await TimeSheet.findById(req.params.id).populate('owner')
    res.render('timesheets/show',{ timesheet });
};

// Function To Show The New-Timesheet Form 

module.exports.newForm = async(req,res,next) => {
    const projects = await Project.find({},{project:1});
    res.render('timesheets/new' ,{projects});
};

// filtering the projects to get the right category for each one

module.exports.filterCategory = async(req,res,next) => {
    let choice = req.body.choice;
    let project = await Project.find({project : choice})
    const categories = await Category.find({project:`${project[0]._id}`})
    res.send(categories);
};

// function To Create New-Timesheet  

module.exports.createNew = async (req,res,next) => {
    const timesheet = new TimeSheet(req.body);
    timesheet.owner = req.user._id;
    timesheet.archive = false;
    await timesheet.save();
    req.flash('success' , 'item has been added successfully');
    res.redirect(`/timesheets/all/${req.user._id}`);
};

// function To Show Single User All His Personal Records "Timesheets" 

module.exports.userAll = async (req,res,next) => {
    const {id}  = req.params;
    const timesheets = await TimeSheet.find({owner:`${id}` ,archive :false}).sort({date:-1}).populate('owner');
    const projects = await Project.find({});
    const users = await User.find({}).sort({username :1});
    if (!timesheets) {
        req.flash('error' , 'Cannot find Timesheet record')
        return res.redirect('/timesheets/showall')
    }
    res.render('timesheets/all', { timesheets , projects , users });
};

// Showing The Edit-Timesheet Form 

module.exports.editForm = async (req,res,next) => {
    const projects = await Project.find({})
    const timesheet = await TimeSheet.findById(req.params.id)
    if (!timesheet) {
        req.flash('error' , 'Cannot find Timesheet record')
        return res.redirect(`/timesheets/all/${req.user._id}`) 
    }
    res.render('timesheets/edit', { timesheet , projects });
};

// function To Edit An Existing Timesheet  

module.exports.edit = async (req,res,next) => {
    const { id } = req.params;
    const timesheet = await TimeSheet.findByIdAndUpdate(id, { ...req.body });
    req.flash('success' , 'item has been updated successfully')
    res.redirect(`/timesheets/all/${req.user._id}`) 
};

// function To archive Timesheet  

module.exports.archive = async (req,res,next) => {
    const { id , userId } = req.params;
    let archive = {archive : true}
    let timesheet = await TimeSheet.findByIdAndUpdate(id,archive);
    req.flash('success' , 'item has been archived successfully')
    res.redirect(`/timesheets/all/${userId}`) 
}; 

// function To show Employees-Sheet.
// Emplyees-Sheet count the manhours worked by each employee.

module.exports.employeesSheet = async (req,res,next) => {
    let users = await User.find({},{_id :1 ,username :1});
    let data = await TimeSheet.aggregate([
        {$group: { _id : {owner:"$owner",project:"$project"},totalHours: {$sum :"$hours"}}},
        {$sort :{"_id.owner":1}}
    ])
    res.render("timesheets/employees",{ users, data  })
};

// function To show Employees sheet  
// show all the timesheet for a specific employee

module.exports.employeeSummary = async (req,res,next) => {
    const { employee } = req.body;
    let timesheets = await TimeSheet.find({owner:employee})
    res.render("timesheets/employeeSummary",{ timesheets })
};

// function to delete timesheet 

module.exports.deleteTimesheet = async (req,res,next) => {
    const { id , userId } = req.params;
    await TimeSheet.findByIdAndDelete(id);
    req.flash('success' , 'item has been deleted successfully')
    res.redirect(`/timesheets/all/${userId}`) 
}