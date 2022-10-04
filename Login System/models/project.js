const mongoose = require("mongoose");
const Schema = mongoose.Schema ;


const ProjectSchema = new Schema({
    project: {
        type:String,
    },
    projectAdmin: [String],
    updatedBy :String
},{timestamps:true});

module.exports = mongoose.model("Project", ProjectSchema);

// {  
// "_id": {    "$oid": "62af0d725f0ea65e23e16a49"  },  
// "project": "EP-CBO-004 - Improved Deaerator Design Tool",  
// "workCategories": 
// [    
// "Documents review & clarifications",     
// "categoryName": "Coding for Pressure vessel module",    
// "categoryName": "Coding for Piping module",     
// "categoryName": "Coding for Structural stand",    
// "categoryName": "Coding for  Platform, ladder Module",    
// "categoryName": "3D model development",    
// "categoryName": "2D drawing development"
// ]
// }

// {  
// "_id": {    "$oid": "62c54a2843e4a1b8182750a6"  },
// "project": "CleaverBrooks - ContentCenter", 
// "workCategories": 
// [    
// "U-Bolt", 
// "Pipe", 
// "Studbolt",
// "Studs" , 
// "Bolt, 
// "SPECIAL" , 
// "Nut, SPECIAL"  
// ]
// }



// ,"project": "CB Product line Automation Project", 
// "workCategories": 
//     [{
//         "name" :"Pipe",
//         "subCat":[
//             {
//                 "name": "Content Center for all the piping components",
//                 "estimatedHours": 100
//             },{
//                 "name": "library for Piping Special items",
//                 "estimatedHours": 17
//             },{
//                 "name": "piping specification using CB Content center",
//                 "estimatedHours": 80
//             },{
//                 "name": "develop 3D model for each type",
//                 "estimatedHours": 50
//             }
//         ]
//     }]


// ,"project": "CB Product line Automation Project", 
// "workCategories": 
//     [{
//         "name" :"Pipe",
//         "subCat":[
//             {
//                 "name": "Content Center for all the piping components",
//                 "estimatedHours": 100
//             },{
//                 "name": "library for Piping Special items",
//                 "estimatedHours": 17
//             },{
//                 "name": "piping specification using CB Content center",
//                 "estimatedHours": 80
//             },{
//                 "name": "develop 3D model for each type",
//                 "estimatedHours": 50
//             }
//         ]
//     },{
//         "name" :"Pipe - 2",
//         "subCat":[
//             {
//                 "name": "Content Center for all the piping components - 2",
//                 "estimatedHours": 100
//             },{
//                 "name": "library for Piping Special items - 2",
//                 "estimatedHours": 17
//             },{
//                 "name": "piping specification using CB Content center - 2",
//                 "estimatedHours": 80
//             },{
//                 "name": "develop 3D model for each type - 2",
//                 "estimatedHours": 50
//             }
//         ]
//     }]



