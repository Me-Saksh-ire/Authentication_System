import mongoose  from "mongoose";

const connectDB = async () => {

    mongoose.connection.on('connected' , () => console.log("Database Is Connected!"));
    //mongoose.connection → gives access to the current database connection.
    //.on('connected', callback) → listens for the connected event.

    await mongoose.connect(`${process.env.MONGODB_URI}/mern-auth`); //await used to wait until the action is performed to move to perform another action 

}

export default connectDB;