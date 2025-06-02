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

module.exports = router