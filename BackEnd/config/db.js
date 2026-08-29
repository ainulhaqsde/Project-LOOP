import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    const isconnect =  await mongoose.connect(process.env.MONGO_URI)
    if (isconnect) {
    console.log('MongoDB connected successfully')
    }
  } catch (err) {
    console.error('MongoDB connection failed:', err)
    process.exit(1)
  }
}

export { connectDB }