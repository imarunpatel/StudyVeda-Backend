const express = require('express');
const app = express();
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');


//load env vars
dotenv.config({path: './config/config.env'});

//body parser
app.use(express.json());
app.use(cors())

// Route files
const auth = require('./routes/auth');


// Connect to database
connectDB();

app.get('', (req, res, next) => {
    res.send('<h1>Hello Boy..</h1>')
})

app.use('/api/v1/auth', auth);

app.listen(3000, () => {
    console.log('Connected to server')
})