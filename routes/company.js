const express = require('express');
const { signup, login, signout } = require('../controllers/auth');
const { companySignupValidator, companySigninValidator } = require('../validators/auth');
const { runValidation } = require('../validators');
const router = express.Router();

router.post('/register', companySignupValidator, runValidation,signup);
router.post('/login', companySigninValidator, runValidation, login);
router.post('/signout', signout);

module.exports = router;