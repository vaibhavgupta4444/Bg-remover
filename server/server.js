import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import connectDb from './configs/mongodb.js';
import userRouter from './routes/userRoute.js';

//App config
const port=process.env.PORT || 4000;
const app=express();
await connectDb();

//Initialize middlewares
app.use(express.json());
app.use(cors());

app.get('/',(req,res)=>res.send('API WORKING'));
app.use('/api/user',userRouter);
app.listen(port,()=>console.log(`Server is running on port ${port}`));