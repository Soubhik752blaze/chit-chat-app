const express = require('express');
const chats = require('./Data/data');
const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('./Config/database');
const colors = require('colors');


const app = express();

app.get("/", (req, res) => {
    res.send("App is running");
})

app.get("/api/chats", (req, res) => {
    res.send(chats);
})

app.get("/api/chats/:id", (req, res) => {
    const singleChatId = req.params.id;
    const chatDetails = chats.filter((chat) => chat._id == singleChatId);
    res.send(chatDetails);
})


const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server started on ${port}`.yellow.bold);
})

connectDB();


