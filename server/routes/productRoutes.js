const express = require('express');
const authControllers = require('../controllers/authControllers');
const reviewRouter = require('./reviewRoutes');

const {
  getProductValidator,
  createProductValidator,
  deleteProductValidator,
  updateProductValidator,
  validateProductId,
} = require('../utils/validators/productValidator');
const {
  getAllProducts,
  setBodySlug,
  uploadProductImages,
  processProductImages,
  parseVariants,
  deleteImage,
  addImage,
  deleteVariant,
  editVariant,
  addVariant,
  createProduct,
  updateProduct,
  getProduct,
  search,
  deleteProduct,
} = require('../controllers/productControllers');

const router = express.Router();

router.post('/search', search);

// POST  /products/productId/reviews  ==> to create a review on specific product
router.use('/:productId/reviews', validateProductId, reviewRouter);

/////////////////////////////      MAIN CRUDS ROUTES      /////////////////////////////

router.route('/').get(getAllProducts).post(
  authControllers.protect,
  authControllers.restrictTo('admin', 'manager'),

  uploadProductImages, // 1. multer only (memory)
  parseVariants, // 2. normalize input early (optional)

  createProductValidator, // 3. VALIDATION FIRST (NO CLOUDINARY YET)

  processProductImages, // 4. ONLY UPLOAD AFTER VALIDATION PASSES

  setBodySlug,
  createProduct,
);

router.get('/:id', getProductValidator, getProduct);

router.use(authControllers.protect);
router.use(authControllers.restrictTo('admin'));

router.post('/:id/addVariant', addVariant);
router.patch('/:id/editVariant/:variantId', editVariant);
router.delete('/:id/deleteVariant/:variantId', deleteVariant);

router.post(
  '/:id/addImage',
  uploadProductImages,
  processProductImages,
  addImage,
);
router.delete('/:id/deleteImage/:imageId', deleteImage);

router
  .route('/:id')
  .patch(
    uploadProductImages,
    parseVariants,
    updateProductValidator,
    processProductImages,
    updateProduct,
  )
  .delete(deleteProductValidator, deleteProduct);

module.exports = router;
