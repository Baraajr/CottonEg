const express = require('express');
const authControllers = require('../controllers/authControllers');
const {
  getCategoryValidator,
  createCategoryValidator,
  deleteCategoryValidator,
  updateCategoryValidator,
} = require('../utils/validators/categoryValidator');
const {
  getAllCategories,
  createCategory,
  updateCategory,
  getCategory,
  deleteCategory,
  getCategoriesByGender,
} = require('../controllers/categoryControllers');

const router = express.Router();

/////////////////////////////      MAIN CRUDS ROUTES      /////////////////////////////

router.get('/by-gender/:gender', getCategoriesByGender);

// route api/v1/categories
router
  .route('/')
  .get(getAllCategories)
  .post(
    authControllers.protect,
    authControllers.restrictTo('admin', 'manager'),
    createCategoryValidator,
    createCategory,
  );

router
  .route('/:id')
  .get(getCategoryValidator, getCategory)
  .patch(
    authControllers.protect,
    authControllers.restrictTo('admin', 'manager'),
    updateCategoryValidator,
    updateCategory,
  )
  .delete(
    authControllers.protect,
    authControllers.restrictTo('admin'),
    deleteCategoryValidator,
    deleteCategory,
  );

module.exports = router;
