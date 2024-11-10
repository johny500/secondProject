const express = require("express");
const router = express.Router();
const ShiftService = require("../Service/ShiftService");
const jwt = require("jsonwebtoken");
const ShiftModel=require("../Models/ShiftModel")



router.get("/", async (req, res) => {
    try {
        const Shifts = await ShiftService.getAllShifts();
        return res.json(Shifts);
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const Shift = await ShiftService.getShiftById(id);

        if (!Shift) return res.status(404).json({ error: "Shift not found" });

        return res.json(Shift);
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
});



router.post("/name", async(req,res)=>{
    const Date=req.body.Date
    console.log("Date:",Date)
    try{
        const Shift =await ShiftService.getshiftByShiftByDate(Date)
        if(!Shift){
            console.log("Shift was not found")
            return res.status(404).json({msg: "Shift was not found"})
        }
        return res.json(Shift)
    } catch(error){
        console.log(error.message)
        return res.status(500).json({error:error.message})
    }
})

router.post("/", async (req, res) => {
    try {
        console.log("asd")
        const Shift = req.body;
        console.log("asd")
        if (!Shift) return res.status(400).json({ error: "Please send a request body" });
        const status = await ShiftService.createShift(Shift);
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
        const status = await ShiftService.updateShift(id, newData);
        return res.json({ msg: status });
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
});

router.put("/employee/:id", async (req, res) => { //employee
    try {
        const id = req.params.id;
        const newData = req.body;
        const status = await ShiftService.addEmployeesShift(id, newData);
        return res.json({ msg: status });
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const status = await ShiftService.deleteShift(id);
        return res.json({ msg: status });
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
});

module.exports = router;
