const mongoose = require('mongoose');
const crypto = require('crypto');


const companySchema = new mongoose.Schema({
    Company_Name: {
        type: String,
        unique: true,
        index: true,
    },
    TAN_No: {
        type: String
    },
    registered_company_email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
    },
    profile: {
        type: String,
        required: true
    },
    hashed_password: {
        type: String,
        required: true
    },
    salt: String,
    role: {
        type: Number,
        default: 0
    },
    resetPasswordLink: {
        data: String,
        default: ""
    },
    company_registered_address: {
        type: String
    },
    registered_company_mobile_no: {
        type: String
    },
    company_PAN: {
        type: String
    },
    no_of_directors: {
        type: Number
    },
    details_of_partners: {
        type: String
    }
}, {timestamp: true})

companySchema.virtual('password').set(function(password) {
    // create a temporarily variable called _password
    this._password = password;
    // generate salt
    this.salt = this.makeSalt();
    // encryptPassword
    this.hashed_password = this.encryptPassword(password);
}).get(function() {
    return this._password
});

companySchema.methods = {

    authenticate: function(plainText){
        return this.encryptPassword(plainText) === this.hashed_password;
    },
    encryptPassword: function(password) {
        if (!password) return '';
        try {
            return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
        }catch(err){
            return '';
        }
    },
    makeSalt: function() {
        return Math.round(new Date().valueOf()* Math.random()) + '';
    }
}

module.exports = mongoose.model('Company', companySchema);