const mongoose = require('mongoose');
const { MongoMemoryReplSet } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Product = require('../models/productModel');
const User = require('../models/userModel');
const Category = require('../models/categoryModel');
const Subcategory = require('../models/subcategoryModel');
const Order = require('../models/orderModel');
const Review = require('../models/reviewModel');

dotenv.config();

let replSet;

let mongod;

beforeAll(async () => {
  // replicaset for createcashorder transaction
  replSet = await MongoMemoryReplSet.create({
    replSet: {
      count: 1,
    },
  });

  const uri = replSet.getUri();

  await mongoose.connect(uri);
});

afterEach(async () => {
  const collections = await mongoose.connection.db.collections();
  await Promise.all(collections.map((collection) => collection.deleteMany({})));
});

afterAll(async () => {
  const collections = await mongoose.connection.db.collections();
  await Promise.all(collections.map((collection) => collection.deleteMany({})));

  await mongoose.connection.close();
  await replSet.stop();
});

const VALID_SHIPPING_ADDRESS = {
  details: 'Egypt',
  city: 'Menouf',
  postalCode: '31734',
  phone: '01032650872',
};

exports.VALID_SHIPPING_ADDRESS = VALID_SHIPPING_ADDRESS; // resued in same file

exports.buildOrder = (userId, overrides = {}) =>
  Order.create({
    user: userId,
    cartItems: [
      {
        product: new mongoose.Types.ObjectId(),
        variant: new mongoose.Types.ObjectId(),
        quantity: 2,
        price: 100,
      },
    ],
    shippingAddress: VALID_SHIPPING_ADDRESS,
    totalOrderPrice: 200,
    ...overrides,
  });

exports.createAdminUser = async () => {
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'test1234',
    role: 'admin',
    verified: true,
  });

  return admin;
};

exports.createRegularUser = async (options = {}) => {
  const user = await User.create({
    name: options.name || 'Test User',
    email: options.email || 'test@example.com',
    password: options.password || 'test1234',
    passwordConfirm: options.passwordConfirm || 'test1234',
    verified: true,
  });

  return user;
};
exports.createJWTToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return token;
};

exports.createCategory = async () => {
  const category = await Category.create({
    name: 'tops',
    genders: ['men'],
  });
  return category;
};

exports.createSubcategory = async (category) => {
  const subcategory = await Subcategory.create({
    name: 'test subcategory',
    category,
    genders: ['men'],
  });
  return subcategory;
};

// eslint-disable-next-line no-shadow
exports.createProduct = async (categoryId, subcategoryId, options = {}) => {
  const product = await Product.create({
    name: options.name || 'Test Product',
    price: options.price || 100,
    description:
      options.description ||
      'This is a test product description long enough to pass validation.',

    gender: options.gender || 'men',
    category: categoryId,
    subcategory: subcategoryId,

    imageCover: options.imageCover || 'test-cover.jpg',

    variants: options.variants || [
      {
        size: 'M',
        color: {
          name: 'Black',
          hex: '#000000',
        },
        quantity: 10,
        sku: 'TEST-BLK-M',
      },
    ],

    season: options.season || ['all-season'],
    material: options.material || 'Cotton',
    fit: options.fit || 'regular',

    images: options.images || [],
  });

  return product;
};
