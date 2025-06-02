const express = require('express')
const router = express.Router()


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

module.exports = router