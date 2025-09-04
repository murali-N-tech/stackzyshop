
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import users from './data/users.js';
import products from './data/products.js';
import User from './src/models/user.model.js';
import Product from './src/models/product.model.js';
import connectDB from './src/config/db.js';

dotenv.config();

const importData = async () => {
  try {
    await connectDB();
    
    await User.deleteMany();
    await Product.deleteMany();

    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0]._id;

    const sampleProducts = products.map(product => {
      return { ...product, user: adminUser };
    });

    await Product.insertMany(sampleProducts);

    console.log('✅ Data imported successfully');
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();
    
    await User.deleteMany();
    await Product.deleteMany();

    console.log('✅ Data destroyed successfully');
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}