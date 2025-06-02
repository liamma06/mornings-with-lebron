const express = require('express')
const connectDB = require('./db')
const app = express()
const port = 5000

app.use(express.json());

//connectDB()

const cors = require('cors');
app.use(cors({ origin: 'http://localhost:3000' }));



app.get('/', (req, res) => {
  console.log("hellow world")
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

//reflection route
const userRouter = require('./routes/reflection')
app.use('/reflection', userRouter)