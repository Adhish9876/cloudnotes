require('dotenv').config();
const express = require('express');
const connectToMongo = require('./db');
const cors = require("cors");



const app = express();
const port = process.env.PORT || 5000;
const allowedOrigins = [
  'http://localhost:3000',
  'https://cloudnotes-19.web.app',
  'https://cloudnotes-19.firebaseapp.com',
  'https://cloudnotes-d60l.onrender.com'
];
app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.web.app') || origin.endsWith('.firebaseapp.com')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
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
 