import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './db.js';
import reflectionRoutes from './routes/reflection.js';
import { checkJwt } from './middleware/auth0.js';

dotenv.config();

const app = express()
const port = 5000

connectDB()


app.use(express.json());
app.use(cors())

app.get('/', (req, res) => {
  res.send('Mornings with LeBron API is running');
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

//reflection route has to be autheticated first
app.use('/api/reflection', checkJwt, reflectionRoutes);
