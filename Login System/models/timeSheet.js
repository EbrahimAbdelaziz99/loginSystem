const mongoose = require("mongoose");
const Schema = mongoose.Schema ;


const TimeSheetSchema = new Schema({
    date : Date,
    project : String,
    category: String,
    subCategory: String,
    archive: Boolean,
    hours : Number,
    owner: {
        type:Schema.Types.ObjectId,
        ref: 'User'
    },
    remarks : String
    },{timestamps:true});

module.exports = mongoose.model("TimeSheet", TimeSheetSchema);