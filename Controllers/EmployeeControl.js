const express = require("express");
const router = express.Router();
const employeeService = require("../Service/employeeService");
const jwt = require("jsonwebtoken");
const employeeModel=require("../Models/employeeModel")



router.get("/", async (req, res) => {
    try {
        const employees = await employeeService.getAllemployees();
        return res.json(employees);
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const employee = await employeeService.getEmployeeById(id);
        if (!employee) return res.status(404).json({ error: "employee not found" });

        return res.json(employee);
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
});



router.post("/name", async(req,res)=>{
    const FirstName=req.body.FirstName
    const LastName=req.body.LastName
    console.log("FullName:",FirstName+ " ",LastName)
    try{
        const employee =await employeeService.getEmployeeByEmployeeName(FirstName,LastName)
        if(!employee){
            console.log("employee was not found")
            return res.status(404).json({msg: "employee was not found"})
        }
        return res.json(employee)
    } catch(error){
        console.log(error.message)
        return res.status(500).json({error:error.message})
    }
})

router.post("/", async (req, res) => {
    try {
        const employee = req.body;
        if (!employee) return res.status(400).json({ error: "Please send a request body" });
        const status = await employeeService.createEmployee(employee);
        if(status.status=="error"){
            return res.status(400).json({msg:status.msg})
        }
        return res.json({ msg: status });
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const newData = req.body;
        const status = await employeeService.updateEmployee(id, newData);
        return res.json({ msg: status });
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const newData = req.body;
        const status = await employeeService.updateEmployee(id, newData);
        return res.json({ msg: status });
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
});
router.put("/:shift", async (req, res) => {
    try {
        const id = req.params.id;
        const newData = req.body;
        const status = await employeeService.AddShift(id, newData);
        return res.json({ msg: status });
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
});

router.put("/department/:id", async (req, res) => { //update department
    try {
        const id = req.params.id;
        const DepartmentID = req.body;
        
        const status = await employeeService.updateEmployeeDepartment(id,  DepartmentID);
        return res.json({ msg: status });
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const status = await employeeService.deleteEmployee(id);
        return res.json({ msg: status });
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
});

module.exports = router;
