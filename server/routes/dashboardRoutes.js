const express = require('express');

const dashboardController = require('../controllers/dashboardController');
const { protect, restrictTo } = require('../controllers/authControllers');

const router = express.Router();

router.use(protect);
router.use(restrictTo('admin', 'manager'));

router.get('/', dashboardController.getDashboard);

module.exports = router;
