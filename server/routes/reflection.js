const express = require('express')
const router = express.Router()
const { LebronResponse,  } = require('../anthropic')

//test data
const test = [
  {
    id: 1, 
    text: "this is a test reflection1",
    emotions: {
      "happy": 0.2,
      "sad": 0.1,
      "anxious": 0.0,
      "hopeful": 0.7,
      "tired": 0.2,
      "angry": 0.0,
      "calm": 0.6
    },
    dominantEmotion: "hopeful",
    date: "2023-05-30T14:48:00.000Z"
  },
  {
    id: 2, 
    text: "this is a test reflection2",
    emotions: {
      "happy": 0.3,
      "sad": 0.0,
      "anxious": 0.1,
      "hopeful": 0.6,
      "tired": 0.0,
      "angry": 0.0,
      "calm": 0.8
    },
    dominantEmotion: "calm",
    date: "2023-05-31T09:22:00.000Z"
  },
  {
    id: 3, 
    text: "this is a test reflection3",
    emotions: {
      "happy": 0.5,
      "sad": 0.0,
      "anxious": 0.0,
      "hopeful": 0.8,
      "tired": 0.1,
      "angry": 0.0,
      "calm": 0.7
    },
    dominantEmotion: "hopeful",
    date: "2023-06-01T18:15:00.000Z"
  }
];

router.get("/", (req, res) => {
    res.json(test)
})

//submitting new entry
router.post("/new", async (req, res) => {
    try{
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ error: "Text is required" });
        }

        const id = test.length > 0 ? 
            Math.max(...test.map(item => item.id)) + 1 : 1;

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


        const newReflection = {
            id, 
            text, 
            emotions,
            dominantEmotion, 
            date: new Date().toISOString() 
        };

        console.log("newReflection", newReflection);

        test.push(newReflection);
        res.status(201).json(newReflection);
    }catch (error){
        console.error("Error adding reflection:", error);
        res.status(500).json({ error: "Failed to add reflection" });
    }
})

// get response from lebron
router.get("/lebron-response", async(req,res) => {
    try{
        if (test.length === 0 ){
            return res.json({ response: "Start adding messages to get responses from the KING" });
        }

        const latest = test.reduce((latest, current) => {
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