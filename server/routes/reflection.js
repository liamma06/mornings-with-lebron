const express = require('express')
const router = express.Router()
const { LebronResponse, EmotionRate  } = require('../anthropic')

//reflection data storage (starts empty)
const reflections = [];

router.get("/", (req, res) => {
    // Sort by date newest
    const sortedReflections = [...reflections].sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    res.json(sortedReflections);
})

//submitting new entry
router.post("/new", async (req, res) => {
    try{
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ error: "Text is required" });
        }        const id = reflections.length > 0 ? 
            Math.max(...reflections.map(item => item.id)) + 1 : 1;

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
            console.log("Emotion analysis results:", emotions);
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

        const newReflection = {
            id, 
            text, 
            emotions,
            dominantEmotion, 
            date: new Date().toISOString() 
        };        reflections.push(newReflection);
        res.status(201).json(newReflection);
    }catch (error){
        console.error("Error adding reflection:", error);
        res.status(500).json({ error: "Failed to add reflection" });
    }
})

// get response from lebron
router.get("/lebron-response", async(req,res) => {
    try{
        if (reflections.length === 0 ){
            return res.json({ response: "Start adding messages to get responses from the KING" });
        }

        const latest = reflections.reduce((latest, current) => {
            if (current.id > latest.id) {
                return current;
            } else {
                return latest;
            }
        });

        const response = await LebronResponse(latest.text);

        res.json({response: response})
    } catch (error) {
        console.error("Error getting response from Anthropic API:", error);
        res.status(500).json({ error: "Failed to get response from Anthropic API" });
    }
})

module.exports = router