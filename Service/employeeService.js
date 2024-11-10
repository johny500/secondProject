const departmentModel = require("../Models/departmentModel");
const employeeModel=require("../Models/employeeModel")
const departmentService=require("./departmentService") //for cheking if the department is correct
const jwt = require("jsonwebtoken");

const getAllemployees=async()=>{
    return await employeeModel.find({})

}

const getEmployeeById =async(id)=>{
    return await employeeModel.findById(id)
    //console.log(theEmployee)

}


const getEmployeeByEmployeeName =async(FirstName,LastName)=>{
   return await employeeModel.findOne({FirstName,LastName})
}



const createEmployee=async(employee)=>{
    try{
    const newEmployee={
        FirstName: employee.FirstName,
        LastName: employee.LastName,
        StartWorkYear:  employee.StartWorkYear,
        DepartmentID: employee.DepartmentID,
        Shifts: []
        }

    const checkDeaprtment=newEmployee.DepartmentID

    const departmentID = await departmentService.getDepartmentById(checkDeaprtment)
    if(!departmentID){
        console.log("Please enter a valid  Department ID")
        return{ status: "error", msg:"department not found"}
    }

    const finalEmployee=new employeeModel(newEmployee)
    await finalEmployee.save()


    await departmentService.addEmployeeTodepartment(checkDeaprtment, finalEmployee._id)
    return "Created"
    
}catch(error){
    console.error("error creatining the employee", res.json({msg: "employeename already in use"}))
    return "error"
}
}

const updateEmployee=async(id,employee)=>{
    try{
        const { FirstName, LastName, DepartmentID } = employee;

        let employeBeforeUpdate=await employeeModel.findById(id)
        if(!employeBeforeUpdate){
       return { status: "error", msg:"employee not found"}
        }

        const departmentExists = await departmentService.getDepartmentById(DepartmentID);
        if(!departmentExists){
            return{ status: "error", msg:"department not found"}
        }

       
        if (employeBeforeUpdate.DepartmentID !== DepartmentID) {
            await departmentService.deleteEmployeeFromDepartment(employeBeforeUpdate.DepartmentID, id);
            await departmentService.addEmployeeTodepartment(DepartmentID, id);
        }

        await employeeModel.findByIdAndUpdate(id, { FirstName, LastName, DepartmentID })
        
    }catch(error){
         console.error("error updating the employee", {msg: "error updating the user",error})
    return {status:"error"}
    }
}



const updateEmployeeDepartment=async(id,DepartmentID)=>{
    try{
        let departmentID=DepartmentID.departmentID

        const newDepartment=await departmentModel.findById(departmentID)
        if(!newDepartment)return{ status: "error", msg:"department not found"}

        const employee=await employeeModel.findById(id)
        if(!employee){
            return { status: "error", msg:"employee not found"}
             }
             let oldDepartmentID=employee.DepartmentID

             if(!oldDepartmentID|| employee.DepartmentID===" "){
                newDepartment.Employees.push(id)
                await newDepartment.save()
        
                employee.DepartmentID=departmentID
                await employee.save()
        
                return "Updated"
            }

            const oldDepartment=await departmentModel.findById(oldDepartmentID)
            if(oldDepartment){
                const employeeIndex=oldDepartment.Employees.indexOf(id)
                if (employeeIndex === -1) {
                    return { status: "error", msg: "Employee not found in the old department" };
                }
                oldDepartment.Employees.splice(employeeIndex, 1);
                await oldDepartment.save();
            }
           
    

 
    employee.DepartmentID=departmentID
    await employee.save()

    newDepartment.Employees.push(id)
    await newDepartment.save()

    return "updated"
        }catch(error){
            console.error("error updating the employee", {msg: "error updating the user",error})
            return {status:"error"}
        }
}


const AddShift=async(id,newShift)=>{
    try{
        const theEmployee=await employeeModel.findById(id)

        if(!theEmployee){
        return { status: "error", msg: "Employee not found" };
    }

        theEmployee.Shifts.push(newShift)
        await theEmployee.save();

        return "added shift!"
    }
    catch(error){
        console.error("Error adding shift to employee", error);
        return { status: "error", msg: "Failed to add shift" };
    }
}


const deleteEmployee=async(id)=>{
    try{
        const employee = await employeeModel.findById(id);
        if (!employee) {
            return { status: "error", msg: "Employee not found" };
        }
    
        const departmentID = employee.DepartmentID;
        
        if (!departmentID || departmentID === " ") {
            return { status: "error", msg: "Department not found" };
        }

        const department = await departmentService.getDepartmentById(departmentID);
        if (!department) {
            return { status: "error", msg: "Department not found" };
        }

        await ShiftModel.deleteMany({ Employees: id });

        await departmentService.deleteEmployeeDepartment(departmentID, id);

        await employeeModel.findByIdAndDelete(id);

return "deleted"
    }catch(error){
        console.error("Error deleting employee", error);
        return { status: "error", msg: "Failed to delete employee" };
    }
    
    
}





module.exports={
    getAllemployees,getEmployeeById,getEmployeeByEmployeeName,createEmployee,updateEmployee,deleteEmployee,updateEmployeeDepartment,AddShift
}