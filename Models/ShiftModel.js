const mongoose=require("mongoose")

let shiftSchema=new mongoose.Schema({
    Date: String,
    StartingHour: String, 
    EndingHour: String,
    Employees: [{type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }]
})
module.exports=mongoose.model("shift",shiftSchema)