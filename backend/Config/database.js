const mongoose = require('mongoose');
mongoose.set('strictQuery', true); // Address the deprecation warning

const connectDB = async () => {
    const { MONGODB_URL } = process.env;

    try {
        await mongoose.connect(MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`Database connected successfully! 😊`);
    } catch (error) {
        console.error(`Database connection failed: ${error.message}`);
        process.exit(1);
    }
};

module.exports= connectDB;