import express from 'express';
import { createServer } from "http";
import AuthRouter from "./http/routers/auth.js";
import cors from 'cors';
import { Server } from "socket.io";
// import dotenv from 'dotenv';
import env from './env.js';
import {socketAuth} from './socket/middleware/socket.auth.js';
import chatHandler from './socket/handlers/chat.handler.js';
import requireAuth from './http/middlewares/Auth.requireAuth.js';
import userRouter from './http/routers/users.routers.js';
import friendsrouter from './http/routers/user.friends.js';
import conversationRoute from './http/routers/conversation.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const PORT = env.PORT || 4444;
const app = express();
// yaha http ka server create hua
const httpServer = createServer(app);

// url se data nikalne ke liye
app.use(express.urlencoded({extended : true}));

// axios ki request ko chalane ke liye;
app.use(express.json());
app.use(cors({
    origin : env.CROSS_ORIGIN || '*',
    credentials : true
}));
const io = new Server(httpServer, {
    cors : {
        origin : env.CROSS_ORIGIN || ''
    }
});

// ye socket ka middleware hai
io.use(socketAuth);

io.on("connection", async(socket) => {
//   console.log("Socked Id --> ",socket.id);

  socket.join(`user:${socket.user.id}`);
  chatHandler(socket,io);
  const userId = socket.user.id;

  await prisma.user.update({
    where: { id: userId },
    data: { online : true } 
  });
    io.emit("user:online",userId);
});  

// send requests to routers
app.use('/api/auth',AuthRouter);
app.use('/api/users',requireAuth,userRouter);
app.use('/api/friend',friendsrouter);
app.use('/api/start',conversationRoute);

httpServer.listen(PORT,()=>{
    console.log('http://localhost:'+ PORT);
})
