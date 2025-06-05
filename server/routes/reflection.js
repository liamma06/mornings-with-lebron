import express from 'express';
import Reflection from '../models/Reflection.js';
import User from '../models/User.js';
import { EmotionRate, LebronResponse } from '../anthropic.js';
import { getUserFromToken } from '../middleware/auth0.js';

const router = express.Router()

//function to actually get/add user into data after authentication
const getOrCreateuser = async (userInfo)=>{
    if(!userInfo || userInfo.auth0Id ){
        throw new Error("User information is missing or invalid");
    }

    let user = await User.findOne({ auth0Id: userInfo.auth0Id });

    // If user does not exist, create a new user
    if(!user){
        user = new User({
            auth0Id: userInfo.auth0Id,
            email: userInfo.email,
            name: userInfo.name,
            lastLogin: new Date()
        });
        await user.save();
    }else{
        user.lastLogin = new Date();
        if (userInfo.name && !user.name) {
            user.email = userInfo.email;
        }
        if (userInfo.email && !user.email) {
            user.email = userInfo.email;
        }
        await user.save();
    }
    return user;
}



router.get("/", async (req, res) => {
    try{
        //user info
        const userInfo = getUserFromToken(req);
        if (!userInfo) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const user = await getOrCreateuser(userInfo);

        //fetch all relfection from user newest to oldest
        const reflections = await Reflection.find({ userId: user._id }).sort({ createdAt: -1 });
        res.json(reflections);
    }catch (error){
        console.error("Error fetching reflections:", error);
        res.status(500).json({ error: "Failed to fetch reflections" });
    }
})

//submitting new entry
router.post("/new", async (req, res) => {
    try{
        //user info
        const userInfo = getUserFromToken(req);
        if (!userInfo) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const user = await getOrCreateuser(userInfo);

        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ error: "Text is required" });
        }

        // Analyze emotions
        let emotions = {
            "happy": 0,
            "sad": 0,
            "anxious": 0,
            "hopeful": 0,
            "tired": 0,
            "angry": 0,
            "calm": 0
        };

        //get emotions 
        try{
            emotions = await EmotionRate(text);
        }catch (error) {
            console.log("Error getting emotions:", error);
        }

        //dominant emotion
        let dominantEmotion = "neutral";
        let highestScore = 0;

        Object.entries(emotions).forEach(([emotion, score]) => {
            if (score > highestScore) {
                highestScore = score;
                dominantEmotion = emotion;
            }
        });

        const newReflection = new Relection( {
            text,
            emotions,
            dominantEmotion,
            userId: user._id
        });
        await newReflection.save();

        res.status(201).json(newReflection);
    }catch (error){
        console.error("Error adding reflection:", error);
        res.status(500).json({ error: "Failed to add reflection" });
    }
})

// get response from lebron
router.get("/lebron-response", async(req,res) => {
    try{
        //user info
        const userInfo = getUserFromToken(req);
        if (!userInfo) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const user = await getOrCreateuser(userInfo);

        //latest relfection -> ai api
        const latestReflection = await Reflection.findOne({ userId: user._id }).sort({ createdAt: -1 });

        if (!latestReflection) {
            return res.json({response : "Start adding relections to get responses from the KING"});
        }

        const response = await LebronResponse(latestReflection.text);

        res.json({response})
    } catch (error) {
        console.error("Error getting response from Anthropic API:", error);
        res.status(500).json({ error: "Failed to get response from Anthropic API" });
    }
})

export default router