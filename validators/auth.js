const {check} = require('express-validator');

exports.companySignupValidator = [
    check('Company_Name').not().isEmpty().withMessage('Company Name is required'),
    check('TAN_No').not().isEmpty().withMessage('TAN No is required'),
    check('registered_company_email').not().isEmpty().withMessage("Email is mandatory").isEmail().withMessage('Must be a valid email address'),
    check('role').not().isEmpty().withMessage("Please select ur role"),
    check('company_registered_address').not().isEmpty().withMessage('Please provide the registered office address of the company'),
    check('registered_company_mobile_no').not().isEmpty().withMessage('Mobile Number is mandatory').isLength({min:10 , max:11}).withMessage('Mobile No must be 11 charecters long'),
    check('password').isLength({min: 6}).withMessage('Password must contain atleast 6 charecters long').matches(/\d/).withMessage("Password must contain a number"),
]