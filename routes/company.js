const express = require('express');
const { signup } = require('../controllers/auth');
const { companySignupValidator } = require('../validators/auth');
const { runValidation } = require('../validators');
const router = express.Router();

router.post('/register', companySignupValidator, runValidation,signup);


module.exports = router;