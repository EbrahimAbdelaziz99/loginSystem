const mongoose = require("mongoose");
const Schema = mongoose.Schema ;

const CategorySchema = new Schema({
    category:String,
    subCategory:[{
        name: String,
        estimatedHours:Number,
        remarks: String
    }],
    project : {
        type:Schema.Types.ObjectId,
        ref: 'Project'
    }
})

module.exports = mongoose.model("Category", CategorySchema);
