const jFile=require("jsonfile")
const axios = require("axios");
let path=require("path")
const userModel = require("../Models/userModel");
const fileLocation=path.join(__dirname,"../data/userAction.json")
const maxActionsPerDay = 10; // Define max actions per user per day



const getAllUsers = async () => {
    return axios.get("https://jsonplaceholder.typicode.com/users");
};


const getUserByUserName = async (userName) => {
    const { data } = await axios.get("https://jsonplaceholder.typicode.com/users");
    const user = data.find((user) => user.username === userName);
    return user;
};

const getUserActions = async (userId) => {
    try {
        const userAction = await userModel.findOne({ userId });
        console.log("User ", userAction);
        if (!userAction) {
            return;
        }
        return userAction;
    } catch (error) {
        console.error("Error fetching user actions:", error);
        throw new Error("Failed to retrieve user actions");
    }
};


const ApplyUserAction = async (userAc) => {
    try {
        const user = await getUserByUserName(userAc.name);
        if (!user) throw new Error("User not found");

        const userId = user.id.toString();
        let userAction = await getUserActions(userId);


        if (!userAction) {
            userAction = new userModel({
                userId: userId,
                FullName: user.name,
                MaxOfAction: maxActionsPerDay,
                actionTakenToday: 0,
                UserlastAction: new Date(),
            });
        }

        const today = new Date();


        if (today.toDateString() !== new Date(userAction.UserlastAction).toDateString()) {
            userAction.actionTakenToday = 0;
            userAction.UserlastAction = today;
            console.log("Resetting action count");
        }


        if (userAction.actionTakenToday >= userAction.MaxOfAction) {
            return { msg: "Action limit reached", HitThelimit: true };
        }


        userAction.actionTakenToday += 1;
        await userAction.save();

        let userJson={
            userId:userAction.userId,
            FullName:userAction.FullName,
            actionTakenToday :userAction.actionTakenToday,
            MaxOfAction:userAction.MaxOfAction,
            UserlastAction:userAction.UserlastAction
        }

        console.log("User action successfully updated and saved:", userAction);

        let data=await jFile.readFile(fileLocation);

        data[userAction.userId]=userJson
        await jFile.writeFile(fileLocation,data)


        return userAction;
    } catch (error) {
        console.error("Error applying user action:", error);
        throw new Error("Failed to apply user action");
    }
};



module.exports = {getAllUsers,getUserByUserName, ApplyUserAction}