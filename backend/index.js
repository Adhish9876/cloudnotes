const express = require('express');
const connectToMongo = require('./db');


const app = express();
const port = 3000;

// Connect to MongoDB
connectToMongo();

//available routes
app.use(express.json());

app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))

app.get('/', (req, res) => {
    res.send('Hello, World!');
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
 