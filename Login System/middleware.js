const { timesheetSchema ,todoSchema } = require('./schemas')
const ExpressError = require('./utils/expressError')

// requireing models

const TimeSheet = require("./models/timeSheet");
const Project = require("./models/project");


// login check middleware

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash('error', 'You must be signed in !');
        return res.redirect('/login');
    }
    next();
}

// clients login middleware
module.exports.clientLoggedIn = (req,res,next) => {
    if(!req.session.client){
        req.flash('error', "You must be signed in !");
        return res.redirect('/clients/login');
    }
}

// check if project admins 

module.exports.isProjectAdmin = async (req,res,next) => {
    const { id } = req.params;
    let project = await Project.findById(id);
    if( (!project.projectAdmin.includes(req.user.username)) && (!req.user.admin)){
        req.flash('error', "You cann't access this data !");
        return res.redirect('/home');
    }
    next();
}

// check if admin or not 

module.exports.isAdmin = (req,res,next) => {
    if(!req.user.admin){
        req.flash('error', 'You are not allowed to veiw this data !');
        return res.redirect('/home');
    }
    next();
}

// server-side timesheet validation middleware

module.exports.validateTimesheet = (req,res,next) => {
    const { error }  = timesheetSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg , 400);
    } else {
        next();
    }
}


// server-side todo validation middleware

module.exports.validateTodo = (req,res,next) => {
    const { error }  = todoSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg , 400);
    } else {
        next();
    }
}

// check if a user is the timesheet owner or not before deletetion

module.exports.isOwner = async(req,res,next) => {
    const { id } = req.params
    const timesheet = await TimeSheet.findById(id);
    if(!timesheet.owner.equals(req.user._id)){
        req.flash('error', 'You are not allowed to change this data !');
        return res.redirect(`/timesheets/all/${req.user._id}`);
    } else {
        next();
    }
}

