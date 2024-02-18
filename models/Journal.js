const mongoose = require('mongoose');


const journalSchema = new mongoose.Schema({
    Transaction_Date: {
        type: String
    },
    Financial_Year : {
        type: String
    },
    Assessment_Year : {
        type: String
    },
    Debit_item_Account : {
        type: String
    },
    Debit_item_Balance : {
        type: Number
    },
    Discount_Allowed_Balance_Type : {
        type: String,
    },
    Discount_Received_Balance_Type : {
        type: String,
    },
    Discount_Allowed_Balance : {
        type: Number
    },
    Discount_Received_Balance : {
        type: Number
    },
    Profit_on_Sale_of_Asset_Balance: {
        type: Number
    },
    Loss_on_Sale_of_Asset_Balance: {
        type: Number
    },
    Profit_on_Sale_of_Asset_Balance_Type: {
        type: String
    },
    Loss_on_Sale_of_Asset_Balance_Type: {
        type: String
    },
    Credit_item_Account : {
        type: String
    },
    Credit_item_Balance : {
        type: Number
    },
    Narration : {
        type: String
    },
    company_name: {
        type: String
    },
    Debit_Currency_Type: {
        type: String
    },
    Credit_Currency_Type: {
        type: String
    }
}, {timestamp: true})


module.exports = mongoose.model('Journal', journalSchema);