import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { config } from 'dotenv'
import fileUpload from 'express-fileupload'
import {connectDB} from "./database/db.js"
import userRouter from './routes/user.routes.js'
import messegeRouter from './routes/messege.routes.js'
import dns from 'dns'

dns.setServers(["0.0.0.0","8.8.8.8"]);

const app = express();

config({path:"./config/config.env"})

app.use(cors(({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
})));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    createParentPath: true,
}));

app.use("/api/v1/user",userRouter);
app.use("/api/v1/messege",messegeRouter);


connectDB();

export default app;