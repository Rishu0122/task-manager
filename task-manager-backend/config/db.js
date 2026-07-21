const mongoose = require("mongoose");

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("✅ Database Connected"); 
    } catch (error) {
        console.log("❌ Database Connection Failed");
        console.log(error.message);
        process.exit(1);
    } 
}  

module.exports = connectDB;