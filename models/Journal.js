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
    }
}, {timestamp: true})


module.exports = mongoose.model('Journal', journalSchema);