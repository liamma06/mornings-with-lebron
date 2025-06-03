const express = require('express')
const router = express.Router()
const { LebronResponse } = require('../anthropic')


const test = [
  {id: 1, text: "this is a test reflection1"},
  {id: 2, text: "this is a test reflection2"},
  {id: 3, text: "this is a test reflection3"}
];

router.get("/", (req, res) => {
    res.json(test)
})

router.post("/new", (req, res) => {
    try{
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ error: "Text is required" });
        }

        const id = test.length > 0 ? 
            Math.max(...test.map(item => item.id)) + 1 : 1;

        const newReflection = { id, text };
        console.log("newReflection", newReflection);
        test.push(newReflection);
        res.status(201).json(newReflection);
    }catch (error){
        console.error("Error adding reflection:", error);
    }
})

router. get("/lebron-response", async(req,res) => {
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
        console.log("Response from Anthropic API:", response);

        res.json({response: response})
    } catch (error) {
        console.error("Error getting response from Anthropic API:", error);
        res.status(500).json({ error: "Failed to get response from Anthropic API" });
    }
})

module.exports = router