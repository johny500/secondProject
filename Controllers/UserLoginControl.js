const express = require("express");
const router = express.Router();
const userService = require("../Service/userService");
const jwt = require("jsonwebtoken");

router.post("/login", async (req, res) => {
    const username = req.body.username
    const email = req.body.email
    console.log(username);

    if (!username || !email) {
        return res.status(400).json({msg: "Username and email are mandatory!"})
    }

    
    try {
        const user=await userService.login(username,email)
        console.log(user); 

        if (!user) {
            console.log("User not found!");
            return res.status(404).json({ msg: "User not found!" });
        }
            const token = jwt.sign({ name: username}, "secretcode");
            return res.json({ msg: "Connected successfully", token: token ,user});
        
    } catch (error) {
        console.log(error.message); 
        return res.status(500).json({ error: error.message });
    }
});

module.exports=router