const mongoose = require("mongoose");
const Schema = mongoose.Schema ;


const ToDoSchema = new Schema({
    dueDate : Date,
    project : String,
    task: String,
    state: String,
    owner: {
        type:Schema.Types.ObjectId,
        ref: 'User'
    },
    remarks : String
},{timestamps:true});

module.exports = mongoose.model("ToDo", ToDoSchema);