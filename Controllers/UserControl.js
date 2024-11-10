const express = require("express");
const router = express.Router();
const userService = require("../Service/userService");
const jwt = require("jsonwebtoken");
const userModel=require("../Models/userModel")


router.get("/", async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        return res.json(users);
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const user = await userService.getUserById(id);

        if (!user) return res.status(404).json({ error: "User not found" });

        return res.json(user);
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
});


router.post("/name", async(req,res)=>{
    const FullName=req.body.FullName
    console.log("FullName:",FullName)
    try{
        const user =await userService.getUserByUserName(FullName)
        if(!user){
            console.log("user was not found")
            return res.status(404).json({msg: "user was not found"})
        }
        return res.json(user)
    } catch(error){
        console.log(error.message)
        return res.status(500).json({error:error.message})
    }
})

router.post("/", async (req, res) => {
    try {
        const user = req.body;
        if (!user) return res.status(400).json({ error: "Please send a request body" });
        const status = await userService.createUser(user);
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
        const status = await userService.updateUser(id, newData);
        return res.json({ msg: status });
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
});

router.put("/:actions", async (req, res) => {
    try {
        const id = req.params.id;
        const newData = req.body;
        const status = await userService.updateUserAction(id, newData);
        return res.json({ msg: status });
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const status = await userService.deleteUser(id);
        return res.json({ msg: status });
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
});

module.exports = router;
