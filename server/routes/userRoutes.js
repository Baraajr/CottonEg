const express = require('express');
const userControllers = require('../controllers/userControllers');
const authControllers = require('../controllers/authControllers');

const {
  getUserValidator,
  updateLoggedUserValidator,
} = require('../utils/validators/userValidator');

const router = express.Router();

//protecting all the routes
router.use(authControllers.protect);

/////////////////////////////      logged user ROUTES      /////////////////////////////

router.get('/getMe', userControllers.getLoggedUserData);

router.patch(
  '/updateMe',
  userControllers.uploadUserPhoto,
  userControllers.resizeUserPhoto,
  updateLoggedUserValidator,
  userControllers.updateLoggedUserData,
);

router.patch('/changeMyPassword', userControllers.updateLoggedUserPassword);

router.delete('/deleteMe', userControllers.deleteLoggedUserData);

/////////////////////////////      only  admins ROUTES      /////////////////////////////

router.use(authControllers.restrictTo('admin', 'manager'));

// update the role of the user by the admin
router.patch('/:id/updateRole', userControllers.updateUserRole);
router.patch('/:id/activate', userControllers.activateAccount);

/////////////////////////////      MAIN CRUDS ROUTES      /////////////////////////////

router.route('/').get(userControllers.getAllUsers);

router.route('/:id').get(getUserValidator, userControllers.getUser);

module.exports = router;
