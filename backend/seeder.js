import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';
import slugify from 'slugify';
import users from './data/user.js';
import products from './data/products.js';
import User from './model/userModel.js';
import Product from './model/productsModel.js';
import Order from './model/orderModel.js';
import Coupon from './model/couponModel.js';
import coupons from './data/coupon.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await Coupon.deleteMany();

    const createUser = await User.insertMany(users);
    await Coupon.insertMany(coupons);

    const adminUser = createUser[0]._id;

    const sampleProducts = products.map((product) => {
      const _id = new mongoose.Types.ObjectId();
      const slug = slugify(product.name, { lower: true }) + '-' + _id.toString().slice(-6);
      return { ...product, _id, user: adminUser, slug };
    });

    await Product.insertMany(sampleProducts);

    console.log('Data imported!'.green.inverse);
    process.exit();
  } catch (error) {
    console.log(`${error}`.red.inverse);
    process.exit();
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await Coupon.deleteMany();

    console.log('Data Destroyed!'.green.inverse);
    process.exit();
  } catch (error) {
    console.log(`${error}`.red.inverse);
    process.exit();
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
