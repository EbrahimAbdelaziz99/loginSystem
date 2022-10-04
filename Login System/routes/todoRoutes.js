const express = require("express");
const router = express.Router();
const { isAdmin , isLoggedIn , validateTodo } = require('../middleware');
const todoController = require('../controllers/todoController');

// Error handler 

const catchAsync = require('../utils/catchAsync');

// Route to show all the ToDo list for Admin 

router.get('/all' , isLoggedIn , isAdmin ,catchAsync(todoController.adminAll))

// Route to show all the ToDo list for Admin 

router.post('/all' , isLoggedIn , isAdmin ,catchAsync(todoController.applyFilter))

// Route to show Single ToDo 

router.get('/show/:id' ,isLoggedIn ,catchAsync(todoController.show))

// Route to show the new ToDo form 

router.get('/new' , isLoggedIn ,catchAsync(todoController.newForm));

// Route to crete the new ToDo and save it to the database 

router.post('/create' , isLoggedIn , validateTodo ,catchAsync(todoController.createNew));

// Route to shaw all your personal records "ToDos" 

router.get('/all/:id' , isLoggedIn ,catchAsync(todoController.userAll))

// Route to Show The Edit-ToDo Form 

router.get('/:id/edit',isLoggedIn,catchAsync(todoController.editForm));

// Route To Edit An Existing ToDo  

router.put('/:id',isLoggedIn ,catchAsync(todoController.edit));

// Route To Delete Timesheet  

router.delete('/:id/:userId',isLoggedIn ,catchAsync(todoController.delete));

// Route to show from to admin to Assign task to a specific user

router.get('/assign',isLoggedIn,isAdmin ,catchAsync(todoController.assignNewForm))

// Route to create the new ToDo and save it from admin to Assign task in a specific user ToDos

router.post('/assignnew',isLoggedIn,isAdmin ,catchAsync(todoController.assignCreateNew))


module.exports = router;