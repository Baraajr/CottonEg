const express = require('express');
const authControllers = require('../controllers/authControllers');
const {
  addAddress,
  removeAddress,
  getLoggedUserAddresses,
} = require('../controllers/addressControllers');
const { addAddressValidator } = require('../utils/validators/addressValidator');

const router = express.Router();

router.use(authControllers.protect, authControllers.restrictTo('user'));

router
  .route('/')
  .get(getLoggedUserAddresses)
  .post(addAddressValidator, addAddress);

router.delete('/:addressId', removeAddress);

module.exports = router;
