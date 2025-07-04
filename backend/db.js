const mongoose = require('mongoose');

const mongoURI = "mongodb://127.0.0.1:27017/cloudnotes";  

const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectToMongo;
