require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

const cors = require('cors');
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001', 
    'https://mornings-with-lebron.vercel.app/'
  ],
  credentials: true
}));

app.get('/', (req, res) => {
  res.send("Mornings with LeBron API is running!");
});

// Reflection route
const userRouter = require('./routes/reflection');
app.use('/reflection', userRouter);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`);
});