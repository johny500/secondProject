const mongoose=require("mongoose")

let employeeSchema=new mongoose.Schema({
    FirstName: String,
    LastName: String,
    StartWorkYear: String, 
    DepartmentID: {type: String },
    Shifts: [{type: mongoose.Schema.Types.ObjectId, ref: 'Shift'}]
})
module.exports=mongoose.model("employee",employeeSchema)