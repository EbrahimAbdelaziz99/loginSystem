const express = require("express");
const router = express.Router();
const projectsController = require('../controllers/projectsController');

const { isProjectAdmin , isAdmin , isLoggedIn } = require('../middleware');

// error-handler for async functions 

const catchAsync = require('../utils/catchAsync');

// route to show the new-project form 

router.get('/new', isAdmin , catchAsync(projectsController.newProjectForm));

// route to send users data for the form

router.post('/new', isAdmin , catchAsync(projectsController.postAdminData));

// route to create the new-project

router.post('/create', isAdmin , catchAsync(projectsController.createProject));

// route to show the new-project form 

router.get('/new/category', isAdmin , catchAsync(projectsController.newCategoryForm));

// route to send users data for the form

router.post('/create/category', isAdmin , catchAsync(projectsController.createCategory));

// route to show project details 

router.get('/show/:id', isAdmin , catchAsync(projectsController.showProject))

// route to show the edit-project form 

router.get('/edit/:id', isProjectAdmin , catchAsync(projectsController.editForm));

// route to apply the edit 

router.put('/edit/:id', isProjectAdmin  , catchAsync(projectsController.editProjectName));

// route to show the edit-project form 

router.get('/edit/category/:id', isAdmin , catchAsync(projectsController.editCategoryForm));

// route to apply the edit 

router.put('/edit/category/:id' , isAdmin , catchAsync(projectsController.editCategory));

// route to show subCategory summary 

router.post('/category/summary' , isAdmin , catchAsync(projectsController.subCategorySummary))

// route to show all projects 

router.get('/all', isLoggedIn , catchAsync(projectsController.allProjects));

// route to delete category

router.delete('/category/:id', isAdmin , catchAsync(projectsController.deleteCategory));

// route to delete project

router.delete('/:id', isAdmin , catchAsync(projectsController.deleteProject));

module.exports = router ;