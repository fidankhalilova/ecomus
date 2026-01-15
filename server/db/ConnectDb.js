const mongoose = require('mongoose');

const connectDb = async () => {
    mongoose.connect(process.env.MONGO_DB_URL).then((res) => {
        console.log("Database connected");
    }).catch((error) => {
        if (error) {
            mongoose.connection.close();
            console.log("Database connection failed", error);
            process.exit(1);
        }
    })

    return mongoose.connection;
}

module.exports = connectDb;