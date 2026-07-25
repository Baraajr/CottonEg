const express = require('express');
const authControllers = require('../controllers/authControllers');
const {
  getReviewValidator,
  createReviewValidator,
  deleteReviewValidator,
  updateReviewValidator,
} = require('../utils/validators/reviewValidator');

const {
  createFilterObject,
  setProductAndUserIdToBody,
  getAllReviews,
  createReview,
  updateReview,
  getReview,
  deleteReview,
} = require('../controllers/reviewControllers');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(createFilterObject, getAllReviews)
  .post(
    authControllers.protect,
    authControllers.restrictTo('user'),
    setProductAndUserIdToBody,
    createReviewValidator,
    createReview,
  );

router
  .route('/:id')
  .get(getReviewValidator, getReview)
  .patch(
    authControllers.protect,
    authControllers.restrictTo('user'),
    updateReviewValidator,
    updateReview,
  )
  .delete(
    authControllers.protect,
    authControllers.restrictTo('admin', 'manager', 'user'),
    deleteReviewValidator,
    deleteReview,
  );

module.exports = router;
