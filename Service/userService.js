const userModel=require("../Models/userModel")
const jwt = require("jsonwebtoken");

const axios = require("axios")
const url = 'https://jsonplaceholder.typicode.com/users';

const getAllUsers=async()=>{
    const users=await userModel.find({})
    return users.map((user)=>({
        _id:user._id.toString(),
        FullName: user.FullName,
        NumOfActions: user.NumOfActions
   }))
}

const getUserById =async(user)=>{
    const theUser=await userModel.findById(user.id)
    return theUser
}


const getUserByUserName =async(FullName)=>{
    const user=await userModel.findOne({FullName})
    return user
}



const createUser=async(user)=>{
    try{
        let check={FullName:user.FullName}
        const ifUser=await userModel.findOne(check)

    if(ifUser){
     return{ status: "error", msg:"username already in use!"}
     
    }
    const newUser={FullName:user.FullName, MaxOfAction: user.MaxOfAction, actionTakenToday:user.actionTakenToday,Shifts:user. Shifts}
    const finalUser=new userModel(newUser)
    await finalUser.save()
    return "Created"
}catch(error){
    console.error("error creatining the user", res.json({msg: "username already in use"}))
    return "error"
}
}

const updateUser=async(id,user)=>{
    await userModel.findByIdAndUpdate(id,{FullName:user.FullName, MaxOfAction: user.MaxOfAction, actionTakenToday:user.actionTakenToday, Shifts:user. Shifts})
    return "updated"
}

const updateUserAction=async(id,user)=>{
    const maxAllow=user.MaxOfAction;
    const actionTakenToday=user.actionTakenToday
    if(maxAllow<actionTakenToday){
        return "Error u hit your daily limit"
    }
    await userModel.findByIdAndUpdate(id,{MaxOfAction: user.MaxOfAction, actionTakenToday:user.actionTakenToday})
    return "updated user action"
}

const deleteUser=async(id)=>{
    await userModel.findByIdAndDelete(id)
    return "deleted"
}

const login=async(username,email)=>{
    const { data } = await axios.get(url)
    console.log(email)
  const user=data.find((use)=> use.username==username)
    if( !user || user.email!==email){
        throw new Error("Invalid credentials")
    }
    const token =jwt.sign({username: user.username,id:user.id},"secretcode")
    return { token, msg: "Login successful" };
}


module.exports={
    getAllUsers,getUserById,getUserByUserName,createUser,updateUser,deleteUser,updateUserAction,login
}