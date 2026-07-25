const express = require('express');
const authControllers = require('../controllers/authControllers');
const {
  getSubcategoryValidator,

  deleteSubcategoryValidator,
  updateSubcategoryValidator,
} = require('../utils/validators/subcategoryValidator');

const {
  setCategoryIdToBody,
  getAllSubcategories,
  createSubcategory,
  updateSubcategory,
  getSubcategory,
  deleteSubcategory,
} = require('../controllers/subategoryControllers');

// merge params allow us to access the parameters form other routes
// ex: we need to access categoryId from category router
const router = express.Router({ mergeParams: true });

// GET categories/categoryId/subcategories
// to hit this route only use
// const router = express.Router({ mergeParams: true }); <== child router and
// router.use('/:categoryId/subcategories', subcategoryRouter); <== parent router

/////////////////////////////      MAIN CRUDS ROUTES      /////////////////////////////

// route api/v1/Subcategories
router
  .route('/')
  .get(getAllSubcategories)
  .post(
    authControllers.protect,
    authControllers.restrictTo('admin', 'manager'),
    setCategoryIdToBody,
    createSubcategory,
  );

router
  .route('/:id')
  .get(getSubcategoryValidator, getSubcategory)
  .patch(
    authControllers.protect,
    authControllers.restrictTo('admin', 'manager'),
    updateSubcategoryValidator,
    updateSubcategory,
  )
  .delete(
    authControllers.protect,
    authControllers.restrictTo('admin'),
    deleteSubcategoryValidator,
    deleteSubcategory,
  );

module.exports = router;
