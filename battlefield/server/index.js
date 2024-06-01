const express = require('express');
const cors = require('cors');
require('dotenv').config();
const data = require('./data.json');

const app = express();
app.use(cors());
app.use(express.json());
app.get('/',(req,res) => {
    res.status(200).json({msg: "Server is running"})
})
app.get('/data',(req,res) => {
    res.status(200).json(data);
})

app.listen(process.env.PORT, () => {
    console.log("Listening to port " + process.env.PORT);
})
