const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const userRouter = require("./routers/userRouter");
const connectDb = require('./db/ConnectDb');
const cors = require('cors');

const PORT = 3001;

// CORS configuration - ADD THESE LINES
app.use(cors({
    origin: 'http://localhost:3000', // Your React app's URL
    credentials: true
}));

// Add body parser middleware BEFORE routes
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

connectDb();

app.use("/api/v1/auth", userRouter);

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});