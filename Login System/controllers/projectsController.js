const Project = require('../models/project');
const TimeSheet = require('../models/timeSheet');
const Category = require('../models/category');

const User = require('../models/user');

// show the new-project form

module.exports.newProjectForm = async(req,res,next) => {
    const users = await User.find({}).sort({username :1});
    res.render('projects/newProject', { users });
};

// show the pass the users onto every new admin

module.exports.postAdminData = async(req,res,next) => {
    const users = await User.find({}).sort({username :1});
    res.send(users);
};

// create new-project { name and admins for it }

module.exports.createProject = async(req,res,next) => {
    const project = new Project(req.body);
    await project.save();
    req.flash('success' , 'item has been added successfully');
    res.redirect('/projects/all');
};

// render the new-Category form to input data

module.exports.newCategoryForm = async(req,res,next) => {
    const projects = await Project.find({});
    res.render('projects/newCategory' , { projects });
};

// create new-Category from the form 

module.exports.createCategory = async(req,res,next) => {
    const newCategory = new Category({category : req.body.category, project : req.body.project});
    const subCategories = [];
    if([req.body.name][0][1].length < 2){
        const category = { name:'',estimatedHours:'',remarks:''}
        category.name = req.body.name;
        category.estimatedHours = req.body.estimatedHours;
        category.remarks = req.body.remarks;
        subCategories.push(category);
    }else {
        for(let i = 0; i < (req.body.name).length ; i++){
            const category = { name:'',estimatedHours:'',remarks:''}
            category.name = req.body.name[i];
            category.estimatedHours = req.body.estimatedHours[i];
            category.remarks = req.body.remarks[i];
            subCategories.push(category);
        }
    }
    newCategory.subCategory = subCategories;
    newCategory.save();
    res.redirect(`/projects/show/${newCategory.project}`);
};

// show project details 

module.exports.showProject = async (req,res,next) => {
    const { id } = req.params;
    const categories = await Category.find({project:id}).populate('project');
    const project = await Project.findById(id);
    if(!categories.length){
        return res.render('projects/show' ,{ project , categories });
    } else {
        const timesheets = await TimeSheet.find({},{project:1, category:1 , subCategory:1 ,hours:1});
        res.render('projects/show' ,{ categories , project , timesheets });
    }
};

// show the edit-project form

module.exports.editForm = async(req,res,next) => {
    const { id } = req.params; 
    const Category = await Category.findById(id);
    res.render('projects/editProject' ,{ Category });
};

// show the new-project form

module.exports.editProjectName = async(req,res,next) => {
    const { id } = req.params; 
    let updatedProject = (req.body) ;
    await Project.findByIdAndUpdate(id, updatedProject);
    req.flash('success' , 'item has been updated successfully');
    res.redirect('/projects/all');
};

// show the edit-project form

module.exports.editCategoryForm = async(req,res,next) => {
    const { id } = req.params; 
    const category = await Category.findById(id);
    const projects = await Project.find({});
    res.render('projects/editCategory' ,{ category , projects });
};

// show the new-project form

module.exports.editCategory = async(req,res,next) => {
    const { id } = req.params; 
    const updatedCategory = await Category.findById(id);
    const subCategories = [];
    if([req.body.name][0][1].length < 2){
        const category = { name:'',estimatedHours:'',remarks:''}
        category.name = req.body.name;
        category.estimatedHours = req.body.estimatedHours;
        category.remarks = req.body.remarks;
        subCategories.push(category);
    }else {
        for(let i = 0; i < (req.body.name).length ; i++){
            const category = { name:'',estimatedHours:'',remarks:''}
            category.name = req.body.name[i];
            category.estimatedHours = req.body.estimatedHours[i];
            category.remarks = req.body.remarks[i];
            subCategories.push(category);
        }
    };
    updatedCategory.category = req.body.category;
    updatedCategory.project = req.body.project;
    updatedCategory.subCategory = subCategories;
    await Category.findByIdAndUpdate(id,updatedCategory);
    req.flash('success' , 'item has been updated successfully')
    res.redirect(`/projects/show/${updatedCategory.project}`);
};

// show each sub category summary 

module.exports.subCategorySummary = async (req,res,next) => {
    const { subCategoryName } = req.body;
    const timesheets = await TimeSheet.find({subCategory:subCategoryName}).populate('owner');
    const category = await Category.aggregate([
        {$match :{"subCategory.name":subCategoryName}}
    ]);
    res.render('projects/subCatSummary' ,{ timesheets , category });
};

//  show all projects

module.exports.allProjects = async(req,res,next) => {
    const projects = await Project.find({});
    res.render('projects/all' ,{ projects });
};

// Delete project and all its related categories 

module.exports.deleteProject = async (req,res,next) => {
    const { id } = req.params;
    await Category.deleteMany({project:id});
    await Project.findByIdAndDelete(id);
    req.flash('success' , 'item has been deleted successfully');
    res.redirect('/projects/all');
}; 