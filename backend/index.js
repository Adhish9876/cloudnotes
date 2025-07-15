require('dotenv').config();
const express = require('express');
const connectToMongo = require('./db');
const cors = require("cors");



const app = express();
const port = process.env.PORT || 5000;
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://cloudnotes-19.web.app', // Firebase Hosting domain
    'https://cloudnotes-19.firebaseapp.com', // Firebase preview domain
    'https://cloudnotes-d60l.onrender.com' // Backend domain
  ],
  credentials: true
}));
app.options('*', cors()); // Handle preflight requests for all routes

// Connect to MongoDB
connectToMongo();

//available routes
app.use(express.json());

app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))



app.listen(port, () => {
    console.log(` app listening on port ${port}`);
});
 