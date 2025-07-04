const express = require('express');
const connectToMongo = require('./db');
const cors = require("cors");





const app = express();
const port = 5000;
app.use(cors()); 

// Connect to MongoDB
connectToMongo();

//available routes
app.use(express.json());

app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))



app.listen(port, () => {
    console.log(` app listening on port ${port}`);
});
 