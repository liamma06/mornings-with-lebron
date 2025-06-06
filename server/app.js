const express = require('express')
const connectDB = require('./db')
const app = express()
const PORT = process.env.PORT || 5000;

app.use(express.json());

//connectDB()

const cors = require('cors');
app.use(cors({ origin: 'http://localhost:3000' }));



app.get('/', (req, res) => {
  console.log("hellow world")
  res.send("Hello world")
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Example app listening on port ${PORT}`)
});

//reflection route
const userRouter = require('./routes/reflection')
app.use('/reflection', userRouter)