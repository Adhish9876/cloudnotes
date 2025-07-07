const mongoose = require('mongoose');

const mongoURI = process.env.MONGO_URI;
console.log('MONGO_URI:', mongoURI);

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
