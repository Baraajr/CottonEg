const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Product = require('../models/productModel');
const User = require('../models/userModel');
const Category = require('../models/categoryModel');
const Subcategory = require('../models/subcategoryModel');

dotenv.config();

let mongod;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
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
  await mongod.stop();
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

exports.createReqularUser = async (options) => {
  if (options) {
    const user = await User.create({
      name: options.name,
      email: options.email,
      password: options.password,
      passwordConfirm: options.passwordConfirm,
      verified: true,
    });
    return user;
  }
  const user = await User.create({
    name: 'Test User',
    email: 'test@example.com',
    password: 'test1234',
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

exports.deleteAllProducts = async () => {
  await Product.deleteMany({});
};

exports.deleteAllCategories = async () => {
  await Category.deleteMany({});
};

exports.deleteAllSubcategories = async () => {
  await Subcategory.deleteMany({});
};

exports.deleteAllUsers = async () => {
  await User.deleteMany({});
};
