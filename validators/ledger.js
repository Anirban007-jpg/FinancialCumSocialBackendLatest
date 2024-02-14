const {check} = require('express-validator');

exports.ledgercreatevalidation = [
    check('AccountName')
        .not()
        .isEmpty()
        .withMessage('Please Enter the Account Name!'),
    check('AccountGroup')
        .not()
        .isEmpty()
        .withMessage('Please Specify Account Group!'),
    check('IndividualAccountGroup')
        .not()
        .isEmpty()
        .withMessage('Please Specify Individual Account Group!'),
    check('SubAccountGroup')
        .not()
        .isEmpty()
        .withMessage('Please Specify Account Sub Group!'),
    check('Balance_Type')
        .not()
        .isEmpty()
        .withMessage('Please specify Dr or Cr balance'),
    check('Financial_Year')
        .not()
        .isEmpty()
        .withMessage('Please Enter the Financial Year!'),
];

exports.journalcreatevalidation = [
    check('Transaction_Date')
    .not()
    .isEmpty()
    .withMessage('Please Enter the Date of Transaction!'),
    check('Financial_Year')
    .not()
    .isEmpty()
    .withMessage('Please Enter the Financial Year!'),
    check('Assessment_Year')
    .not()
    .isEmpty()
    .withMessage('Please Enter the Assessment_Year!'),
    check('Debit_item_Account')
        .not()
        .isEmpty()
        .withMessage('Please Specify Account to be debited!'),
    check('Debit_item_Balance')
        .not()
        .isEmpty()
        .withMessage('Please Enter Balance'),
    check('Credit_item_Account')
        .not()
        .isEmpty()
        .withMessage('Please Specify Account to be credited!'),
    check('Credit_item_Balance')
        .not()
        .isEmpty()
        .withMessage('Please Enter Balance'),
    check('Debit_item_Account')
        .not()
        .isEmpty()
        .withMessage('Please Specify Account to be debited!'),
    check('Narration')
        .not()
        .isEmpty()
        .withMessage('Please Enter proper Narration'),
];

exports.ledgervalidation = [
    check('AccountName')
        .not()
        .isEmpty()
        .withMessage('Please Enter the Account Name!'),

];