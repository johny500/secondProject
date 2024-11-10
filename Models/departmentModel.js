const mongoose=require("mongoose")

let departmentSchema=new mongoose.Schema({
    Name: String,
    Manager : { type: mongoose.Schema.Types.ObjectId, ref: 'employee' },
    Employees: [{type: mongoose.Schema.Types.ObjectId, ref: 'employee'}]
})
module.exports=mongoose.model("department",departmentSchema)