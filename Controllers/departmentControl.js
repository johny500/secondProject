const express = require("express");
const router = express.Router();
const DepartmentService = require("../Service/departmentService");
const jwt = require("jsonwebtoken");
const DepartmentModel=require("../Models/departmentModel")



router.get("/", async (req, res) => {
    try {
        const Departments = await DepartmentService.getAlldepartments();
        return res.json(Departments);
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const Department = await DepartmentService.getDepartmentById(id);

        if (!Department) return res.status(404).json({ error: "Department not found" });

        return res.json(Department);
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
});



router.post("/name", async(req,res)=>{
    const Name=req.body.Name
    console.log("Name:",Name)
    try{
        const Department =await DepartmentService.getDepartmentByDepartmentName(Name)
        if(!Department){
            console.log("Department was not found")
            return res.status(404).json({msg: "Department was not found"})
        }
        return res.json(Department)
    } catch(error){
        console.log(error.message)
        return res.status(500).json({error:error.message})
    }
})

router.post("/", async (req, res) => {
    try {
        const Department = req.body;
        if (!Department) return res.status(400).json({ error: "Please send a request body" });
        const status = await DepartmentService.createDepartment(Department);
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
        const status = await DepartmentService.updateDepartment(id, newData);
        return res.json({ msg: status });
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
});


router.put("/manager/:id", async (req, res) => { //update Manger
    try {
        const id = req.params.id;
        const manger = req.body;
        const status = await DepartmentService.updateManager(id, manger);
        return res.json({ msg: status });
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
});

router.put("/employee/:id", async (req, res) => { //remove employe from department and from his self
    try {
        const id = req.params.id; //employe id
        const employeeID = req.body;
        const status = await DepartmentService.deleteEmployeeFromDepartment(id, employeeID);
        return res.json({ msg: status });
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const status = await DepartmentService.deleteDepartment(id);
        return res.json({ msg: status });
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
});

module.exports = router;
