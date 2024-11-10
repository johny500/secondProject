const jFile= require("jsonfile")
const path= require("path")
const fileLocation=path.join(__dirname,"../data/userAction.json")
const userService=require("../Service/newUserService")

const maxActionsPerDay = 10; // Define max actions per user per day


const getAllUsers=()=>{
    return jFile.readFile(fileLocation)
}

const getUserActions = async (name) => {
    const id=await userService.getUserByUserName(name)
    if(!id){
        throw new error("user npt found")
    }
    const data = await jFile.readFile(fileLocation);
    return data[id]
};


const ApplyUserAction=async(name) =>{
   const id=await userService.getUserByUserName(name)
    let userAction=await getUserActions(name)
    if(!userAction){
        userAction= { actions: 0, lastActionDate: new Date().toISOString().split("T")[0] };
    }
    let today=new Date()
    if(today !== userAction.lastActionDate){
        userAction.actions=0
        userAction.lastActionDate=today
    }
   if(userAction.actions <maxActionsPerDay){
    userAction.actions +=1
   }
   else{
    return{msg:"Action limit reached", HitThelimit:true}
   }
    
    let data=await jFile.readFile(fileLocation);

    data[id]=userAction
    await jFile.writeFile(fileLocation,data)

    return userAction



}



module.exports={
    getAllUsers ,ApplyUserAction
}