const express = require('express');
const { signup, login, signout, googleLogin } = require('../controllers/auth');
const { companySignupValidator, companySigninValidator } = require('../validators/auth');
const { runValidation } = require('../validators');
const router = express.Router();

router.post('/register', companySignupValidator, runValidation,signup);
router.post('/login', companySigninValidator, runValidation, login);
router.post('/signout', signout);
router.post('/google-login',googleLogin)
module.exports = router;