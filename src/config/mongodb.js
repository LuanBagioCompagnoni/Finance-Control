import mongoose from 'mongoose';

async function connectDatabase(){
    await mongoose.connect(`${process.env.DB_CONNECTION_STRING}auth`);
    return mongoose.connection;
}

export default connectDatabase;
