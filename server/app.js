const express = require('express')
const app = express()
const port = 5000

const cors = require('cors');
app.use(cors({ origin: 'http://localhost:3000' }));



app.get('/', (req, res) => {
  console.log("hellow world")
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

const userRouter = require('./routes/reflection')
app.use('/reflection', userRouter)