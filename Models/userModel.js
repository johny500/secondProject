const mongoose=require("mongoose")

let userSchema=new mongoose.Schema({
    userId: String,
    FullName: String,
    MaxOfAction :Number,
    actionTakenToday :Number ,
    UserlastAction: Date
})
module.exports=mongoose.model("user",userSchema)