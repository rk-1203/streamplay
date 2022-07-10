// Connect to MongoDB
import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const dbConnection = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
        });
        console.log(
            `MongoDB Connected successfully: ${dbConnection.connection.host}`
                .yellow
        );
    } catch (error) {
        console.log(`DB Connected Error: ${error.message}`.red.bold);
        process.exit();
    }
};

export default connectDB;
