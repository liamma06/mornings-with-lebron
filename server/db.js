import mongoose from 'mongoose';

let cached = global.mongoose;

if(!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB(){
  //if connection already exists, return it
  if(cached.conn){
    return cached.conn;
  }

  //if no connection, create a new one
  if(!cached.promise){
    const opts ={
      bufferCommands:false,
    };

    cached.promise = mongoose.connect(process.env.MONGO_URI, opts)
      .then((mongoose) => {
        console.log("MongoDB connected");
        return mongoose;
      })
      .catch((error) => {
        console.error("MongoDB connection error:", error);
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;

}

export default connectDB;