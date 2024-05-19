const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = async () => {
    try {
        const newConnection = await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log(`Connection to DB is successful : ${newConnection.connection.host}`.cyan.underline);
    }
    catch (e) {
        console.log("connection to DB failed".red.bold);
        console.log(e);
        process.exit(0);
    }
}

module.exports = connectDB;