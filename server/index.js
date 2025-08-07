import expresss from 'express'
import mongoose from 'mongoose';
import dotenv from "dotenv";
import cors from 'cors';
import userRoutes from './routes/user.route.js';
import productRoutes from './routes/product.route.js';
import orderRoutes from './routes/order.route.js';


const app = expresss();

//middleware
app.use(expresss.json());
app.use(cors());
dotenv.config();


app.use("/user", userRoutes);
app.use("/product", productRoutes);
app.use("/order", orderRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Mongo Error:', err));


//start server
app.listen(process.env.PORT, () => {
    console.log(`Server is listening on port: ${process.env.PORT}`);
})