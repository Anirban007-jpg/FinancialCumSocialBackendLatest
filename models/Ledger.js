const mongoose = require('mongoose');
const crypto = require('crypto');
var Float = require('mongoose-float').loadType(mongoose);


const ledgerSchema = new mongoose.Schema({
    Financial_Year: {
        type: String
    },
    AccountName :{
        type: String
    },
    AccountGroup: {
        type: String
    },
    IndividualAccountGroup: {
        type: String
    },
    SubAccountGroup: {
        type: String
    },
    Opening_Balance: {
        type: Number
    },
    Debtor_id: {
        type: String
    },
    Creditor_id: {
        type: String
    },
    Balance : {
        type: Number
    },
    Closing_Balance : {
        type: Number
    },
    Balance_Type: {
        type: String
    },
    company_name: {
        type: String
    },
    Currency_Type : {
        type: String
    }
}, {timestamp: true})


module.exports = mongoose.model('Ledger', ledgerSchema);