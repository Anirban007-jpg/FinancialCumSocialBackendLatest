const express = require('express');
const { signup, login, signout, googleLogin, forgotPasword, ResetPassword, getALlCompmanies } = require('../controllers/auth');
const { companySignupValidator, companySigninValidator, companyForgotPasswordValidator, resetPasswordValidator } = require('../validators/auth');
const { runValidation } = require('../validators');
const router = express.Router();

router.post('/register', companySignupValidator, runValidation,signup);
router.post('/login', companySigninValidator, runValidation, login);
router.post('/signout', signout);
router.post('/google-login',googleLogin)
router.put('/forgot-password', companyForgotPasswordValidator, runValidation, forgotPasword);
router.put('/reset-password',resetPasswordValidator, runValidation, ResetPassword);
router.get('/get-all-companies',getALlCompmanies);
module.exports = router;