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
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (
    !origin ||
    allowedOrigins.includes(origin) ||
    origin.endsWith('.web.app') ||
    origin.endsWith('.firebaseapp.com')
  ) {
    res.header('Access-Control-Allow-Origin', origin || '*');
    res.header('Vary', 'Origin');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, auth-token');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  } else {
    res.status(403).send('CORS: This origin is not allowed.');
  }
});

// Connect to MongoDB
connectToMongo();

//available routes
app.use(express.json());

app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))

app.listen(port, () => {
    console.log(` app listening on port ${port}`);
});
 