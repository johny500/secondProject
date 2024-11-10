const express=require("express")

const userControll=require("./Controllers/UserControl")
const userLoginControll=require("./Controllers/UserLoginControl")
const employeeControll=require("./Controllers/EmployeeControl")
const departmentControll=require("./Controllers/departmentControl")
const ShiftControll=require("./Controllers/ShiftControl")
const userService=require("./Service/newUserService")


const jwt=require("jsonwebtoken")

async function checkToken(req,res,next){
    
    const token=req.headers["authorization"];
    if(!token)return res.status(401).json({msg:"token required"})
     
jwt.verify(token,"secretcode",async (err,user)=>{
if(err)return res.status(403).json({msg:"invalid token"})
                req.user=user
   try{
    const userAction =await userService.ApplyUserAction(user)
    if(userAction.HitThelimit){
        return res.status(429).json({ msg: "Daily action limit reached" });
    }
    next()
   } catch(error){
    console.error("error while applying user action",error)
    return res.status(500).json({ msg: "Internal server error" });
   }

        })
}


const cors= require("cors")

const app= express()
app.use(cors())
app.use(express.json())

const mongoose=require("mongoose")
mongoose.connect("mongodb://127.0.0.1:27017/FS20PROJECT").then(()=>console.log("connected toDB"))

app.use("/users",checkToken, userControll)
app.use("/user", userLoginControll)
app.use("/employee",checkToken,employeeControll)
app.use("/shift",checkToken,ShiftControll)
app.use("/department",checkToken,departmentControll)

app.listen(8000,()=>{
    console.log("Connected to the server!")
})