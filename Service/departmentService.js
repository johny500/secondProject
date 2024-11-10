const departmentModel=require("../Models/departmentModel")
const employeeModel=require("../Models/employeeModel")


const getAlldepartments=async()=>{
    const allDepartments=await departmentModel.find({})
    let departments=[]
for(let i=0;i<allDepartments.length; i++){
    let department=allDepartments[i].toObject()

    let employees = department.Employees;

    let arrEmpNames = []

    for(let j=0; j<employees.length; j++){
        const employee=await employeeModel.findById(employees[j]) 
        if(employee){
            arrEmpNames.push(employee)
        }
        else{
            console.log(`Employee with ID ${employees[j]} not found.`)

            await deleteEmployeeDepartment(department._id,employees[j]._id)
        } 
        }
        department.Employees=arrEmpNames
        departments.push(department)
       
}
    return departments
}


const getDepartmentById =async(id)=>{
    //console.log( id.departmentID)
    const theDepartment=await departmentModel.findById(id)
    if(!theDepartment){
        return{ status: "error", msg:"Department not exist!"}
    }

    let department=theDepartment.toObject()
    let employees = department.Employees;

    let arrEmpNames = []

    for(let j=0; j<employees.length; j++){
        const employee=await employeeModel.findById(employees[j]) 
        if(employee){
            arrEmpNames.push(employee)
        }
        else{
            console.log(`Employee with ID ${employees[j]} not found.`)
            await deleteEmployeeDepartment(department._id,employees[j]._id)
        } 
        }
        department.Employees=arrEmpNames
        return department
    
}


const getDepartmentByDepartmentName =async(Name)=>{
    return await departmentModel.findOne({Name})
}



const createDepartment=async(department)=>{
    try{
        if (!department.Name) {
            return { status: "error", msg: "Department name is required" };
        }

        const ifDepartment=await departmentModel.findOne({Name:department.Name})

    if(ifDepartment){
     return{ status: "error", msg:"departmentname already in use!"}
     
    }

    const newDepartment=new departmentModel({
        Name:department.Name,
        Manager: department.Manager || null
    })

    await newDepartment.save()
    return "Created"
}catch(error){
    console.error("Error creating the department:", error);
    return { status: "error", msg:"failed to create department!"}
}
}

const updateDepartment=async(id,department)=>{
    await departmentModel.findByIdAndUpdate(id,{Name:department.Name, Manager: department.Manager})
    return "updated"
}

const addEmployeeTodepartment=async(id,employee)=>{
    try{
        let department= await departmentModel.findById(id)
        if(!department){
            return { status: "error", msg:"failed to find department!"}
        }

        let ifEmployee=await employeeModel.findById(employee)
        if(!ifEmployee)return { status: "error", msg:"failed to find employee!"}

        department.Employees.push(employee);
        await department.save();

        return "added employee to department";
    }catch(error){
        console.error("Error creating the department:", error);
        return { status: "error", msg:"failed to add employee to department!"}
    }
}


const updateManager=async(id,employeeID)=>{
    await departmentModel.findByIdAndUpdate(id,{ Manager: employeeID.employeeID})
    return "updated"
}


const deleteEmployeeDepartment=async(id,employeeId)=>{ //Do to when delete the employee also delete in mongoDB(NOW only deleted when getting the departments)

    let department= await departmentModel.findById(id)
    if (!department) return "Department not found";

    const index = department.Employees.findIndex(emp => emp.equals(employeeId));
 if (index === -1) return "Employee not found in this department";
console.log(employeeId)
 department.Employees.splice(index, 1);

 await department.save();

return "deleted"
}

const deleteEmployeeFromDepartment=async(departmentId,employeeID)=>{ // fix employeeID.employeeID
    const employee=employeeID.employeeID

    await employeeModel.findByIdAndUpdate(employee,{DepartmentID: " "})

    let department= await departmentModel.findById(departmentId)

    const index = department.Employees.findIndex(emp => emp.equals(employee));

    if (index === -1) return "Employee not found in this department";

    department.Employees.splice(index, 1);
    if(department.Manager==employee){
        console.log("true")
        department.Manager=null
    }
    await department.save();
s
    return "deleted"
}

const deleteDepartment=async(id)=>{
    
    await departmentModel.findByIdAndDelete(id)
    await employeeModel.updateMany(
        { DepartmentID: id }, // Find employees with this department ID
        { $set: { DepartmentID: "" } } // Set DepartmentID to an empty string
    );
    return "deleted"
}



module.exports={
    getAlldepartments,getDepartmentById,getDepartmentByDepartmentName,createDepartment,updateDepartment,deleteDepartment,updateManager, addEmployeeTodepartment,deleteEmployeeDepartment,deleteEmployeeFromDepartment
}