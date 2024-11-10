const ShiftModel = require("../Models/ShiftModel");
const shiftModel=require("../Models/ShiftModel")
const employeeModel=require("../Models/employeeModel")
const employeeService=require("./employeeService")
const jwt = require("jsonwebtoken");

const getAllShifts=async()=>{
    const shiftsAll=await shiftModel.find({})
    let shifts=[]
    for(let i=0;i<shiftsAll.length; i++){
        let shift=shiftsAll[i].toObject()
        let employees = shift.Employees;
        let arrEmpNames = []
        for(let j=0; j<employees.length; j++){
            const employee=await employeeModel.findById(employees[j]) 
            if(employee){
                arrEmpNames.push(employee)
            }
            else{
                console.log(`Employee with ID ${employees[j]} not found.`)
               // await deleteEmployeeDepartment(shift._id,employees[j]._id)
            } 
            }
            shift.Employees=arrEmpNames
           
            shifts.push(shift)
    }
    return shifts
}

const getShiftById =async(id)=>{
    const theShift=await shiftModel.findById(id)
    return theShift
}


const getshiftByShiftByDate =async(Date)=>{
    const shift=await shiftModel.findOne({Date:Date})
    return shift
}



const createShift=async(shift)=>{ //check whos better
    try{
 const {Date, StartingHour,EndingHour,Employees }=shift
 const date=Date.toString()
  const StartingHourDate=StartingHour.toString()
  const EndingHourDateDate=EndingHour.toString()


  const newShift=new ShiftModel({
    Date:date,
    StartingHour:StartingHourDate,
    EndingHour:EndingHourDateDate,
    Employees
  })
console.log(newShift)
  await newShift.save()
  return "Created"
}catch(error){
    console.error("error creating the shift", error)
    return "error"
}
}


const updateShift=async(id,shift)=>{
    console.log(shift)
const {Date , StartingHour, EndingHour}=shift
const date=Date.toString()
const StartingHourDate=StartingHour.toString()
const EndingHourDateDate=EndingHour.toString()

const updatedShift={
    Date:date,
    StartingHour:StartingHourDate,
    EndingHour:EndingHourDateDate,
}
await shiftModel.findByIdAndUpdate(id,updatedShift)
    return "updated"
}

const addEmployeesShift=async(id,employee)=>{
    try{
     const empID=employee.id

    const TheShift=await shiftModel.findById(id)
    if(!TheShift){return{status:"error",msg:"shift was not found"}}

   let ifEmployeeInShift=TheShift.Employees.includes(empID)
   if(ifEmployeeInShift){
    return{ status: "error", msg:"the employee already in there "}
   }
   TheShift.Employees.push(empID);
   await TheShift.save();

   const theEmployee = await employeeModel.findById(empID);
   if (!theEmployee) return { status: "error", msg: "Employee not found" };

   theEmployee.Shifts.push(TheShift._id);
   await theEmployee.save();
 
    return "Added employee"
}catch(error){
    console.error("error",error)
    return{status:"error",msg:"failed to add the emplyee"}
}
}


const deleteEmployeeShift=async(employeeId,shiftID)=>{  //check
    try{
    let shift= await shiftModel.findById(shiftID)
    if (!shift) return {status:"error",msg:"failed to find the shift"}
let employee=await employeeService.findById(employeeId)
if (!employee) return {status:"error",msg:"failed to find the employee"}

const index = employee.Shifts.indexOf(shiftID);
if (index === -1) return { status: "error", msg: "Employee is not assigned to this shift" };

employee.Shifts.splice(index, 1);
await employee.save();



 const shiftIndex = shift.Employees.indexOf(employeeId);
 if (shiftIndex !== -1) {
     shift.Employees.splice(shiftIndex, 1);
     await shift.save();
 }


return "deleted"

}catch(error){
    console.error("error",error)
    return{status:"error",msg:"failed to delete the emplyee"}
}
}


const deleteShift=async(id)=>{
    try{
    const TheShift=await shiftModel.findById(id)
if(!TheShift){
    return { status: "error", msg: "Shift not found" };
}
    const employees=TheShift.Employees
    for(let i=0; i<employees.length; i++){
        let employeeID=employees[i]
        const theEmployee= await employeeModel.findById(employeeID)
        if (!theEmployee) {
            return { status: "error", msg: "Employee not found" };
        }
        let EmployeeShifts=theEmployee.Shifts
        const index = EmployeeShifts.indexOf(id);
        if (index !== -1) {
            EmployeeShifts.splice(index, 1);
            await employeeModel.findByIdAndUpdate(employeeID, { Shifts: EmployeeShifts });
        }
    };
    await shiftModel.findByIdAndDelete(id)
    return "deleted"
}catch{
    console.error("error",error)
    return{status:"error",msg:"failed to delete the shift"}
}
}



module.exports={
    getAllShifts,getShiftById,getshiftByShiftByDate,createShift,updateShift,deleteShift,addEmployeesShift
}