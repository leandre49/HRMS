import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hrms');
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Drop stale unique index on employee field to fix duplicate key error on signup
    const usersCollection = conn.connection.db.collection('users');
    try {
      await usersCollection.dropIndex('employee_1');
      console.log('Dropped stale unique index "employee_1" from users collection');
    } catch (indexErr) {
      // Index may not exist, that's fine
    }

    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
