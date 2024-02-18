const mongoose = require('mongoose');


const ProfitLossSchema = new mongoose.Schema({
    Transaction_Date: {
        type: String
    },
    Financial_Year : {
        type: String
    },
    Assessment_Year : {
        type: String
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
    }
}, {timestamp: true})


module.exports = mongoose.model('ProfitLoss', ProfitLossSchema);