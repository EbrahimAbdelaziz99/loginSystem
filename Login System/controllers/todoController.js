const Project = require('../models/project');
const ToDo = require('../models/todo');
const User = require('../models/user');


const sgMail = require('@sendgrid/mail');
////////////////////////////////////////
// show todos to admin

module.exports.adminAll = async(req,res,next) => {
    const todos = await ToDo.find({}).sort({dueDate:1}).populate('owner');
    const users = await User.find({}).sort({username :1});
    res.render('todos/all' ,{ todos , users });
};

// apply filters 

module.exports.applyFilter = async(req,res,next) => {
    const { userFilter } = req.body;
    if(userFilter === "all" || userFilter === ".."){
        const todos = await ToDo.find({}).sort({dueDate:1}).populate('owner');
        res.send(todos);
    }else {
        const user = await User.findByUsername(userFilter);
        let choice = user._id ; 
        const todos = await ToDo.find({owner :`${choice}`}).sort({dueDate:1}).populate('owner');
        res.send(todos);
    }
};


// function to show the Single ToDo  
module.exports.show = async (req,res,next) => {
    const todo = await ToDo.findById(req.params.id).populate('owner')
    res.render('todos/show' , { todo })
};

// function to show the new ToDo form 

module.exports.newForm = async(req,res,next) => {
    const projects = await Project.find({});
    res.render('todos/new', { projects });
};

// function to create the new ToDo and save it to the database 

module.exports.createNew = async (req,res,next) => {
    const todo = new ToDo(req.body);
    todo.owner = req.user._id;
    await todo.save();
    req.flash('success' , 'item has been added successfully');
    res.redirect(`/todo/all/${req.user._id}`);
};

// function To Show Single User All His Personal Records "ToDos" 

module.exports.userAll = async (req,res,next) => {
    const {id}  = req.params;
    const todos = await ToDo.find({owner:`${id}`}).sort({dueDate:1}).populate('owner');
    const users = await User.find({}).sort({username :1});
    if (!todos) {
        req.flash('error' , 'Cannot find Timesheet record')
        return res.redirect('/timesheets/showall')
    }
    res.render('todos/all', { todos , users });
};

// Showing The Edit-ToDo Form 

module.exports.editForm = async (req,res,next) => {
    const projects = await Project.find({},{Project:1})
    const todo = await ToDo.findById(req.params.id)
    if (!todo) {
        req.flash('error' , 'Cannot find Timesheet record')
        return res.redirect(`/todos/all/${req.user._id}`) 
    }
    res.render('todos/edit', { todo , projects });
};

// function To Edit An Existing ToDo  

module.exports.edit = async (req,res,next) => {
    const { id } = req.params;
    await ToDo.findByIdAndUpdate(id, { ...req.body });
    req.flash('success' , 'item has been updated successfully')
    res.redirect(`/todo/all/${req.user._id}`) 
};

// function To Delete ToDo  

module.exports.delete = async (req,res,next) => {
    const { id , userId } = req.params;
    await ToDo.findByIdAndDelete(id);
    req.flash('success' , 'item has been deleted successfully')
    res.redirect(`/todo/all/${userId}`)
};  

// show from to admin to Assign task to a specific user

module.exports.assignNewForm = async(req,res,next) => {
    const users = await User.find({}).sort({username :1});
    const projects = await Project.find({});
    res.render('todos/adminNew', { projects , users });
};

// function to create the new ToDo and save it from  admin to Assign task in a specific user ToDos

module.exports.assignCreateNew = async (req,res,next) => {
    const todo = new ToDo(req.body);
    await todo.save();
    let user = await User.find({_id :`${req.body.owner}`})
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    const msg = {
    to: user[0].email,  // Change to  recipient
    from: 'info@enerfacprojects.com', // Change to your verified sender
    subject: 'Enerfacprojects Task was assigned',
    text: 'You are receiving this because '+ req.user.username + ' assigned a new task for you' + '\n\n' +
    'here is the link ' + `http://chinookdt.com/todo/all/${user[0]._id}`
    }
    sgMail.send(msg).then(() => {
        req.flash('success', 'An e-mail has been sent to ' + user[0].email + ' with the task assigned ');
        res.redirect('/todo/all');
    }).catch ((err)=>{
        req.flash('error', `${err}`);
        res.redirect(`/todo/all/${req.user._id}`);
    })
};