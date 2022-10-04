const mongoose = require("mongoose");
const passportLocalMongosse = require("passport-local-mongoose")
const Schema = mongoose.Schema ;

const UserSchema = new Schema ({
    email :{
        type : String,
        required : true , 
        unique:true
    },
    admin:{
        type: Boolean,
        required : true
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

UserSchema.plugin(passportLocalMongosse)

module.exports = mongoose.model('User' , UserSchema);