import express from "express";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

import signup_post from "./controllers/signup_post.js";
import signin_post from "./controllers/signin_post.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(cookieParser());

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    next();
});

app.post("/signup", signup_post);
app.post("/signin", signin_post);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});