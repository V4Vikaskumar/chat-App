import express from 'express';
const PORT = 4444;
import { createServer } from "http";
import AuthRouter from "./routers/auth.js";
import cors from 'cors'

const app = express();
const Server = createServer(app);

// url se data nikalne ke liye
app.use(express.urlencoded({extended : true}));

// data ko readable banane ke liye -> express.json();
app.use(express.json());

// send requests to routers
app.use('api/auth',AuthRouter);

Server.listen(PORT,()=>{
    console.log('http://localhost:'+ PORT);
})
