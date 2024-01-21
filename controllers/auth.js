const fo = require('formidable');
const fs = require('fs');
// const sid = require('shortid');
const jwt = require('jsonwebtoken');
const ejwt = require('express-jwt');
const sgMail = require('@sendgrid/mail'); // SENDGRID_API_KEY
const nm = require('nodemailer');
require('dotenv').config()
const _ = require('lodash');
const Company = require('../models/company');
// const { OAuth2Client } = require('google-auth-library');

exports.signup = (req, res) => {
    Company.findOne({TAN_No: req.body.TAN_No}).exec((err,company) => {
        if (err){
            return res.status(400).json({
                error: "User already exsists"
            })
        }
    
        const {Company_Name,TAN_No,registered_company_email,role,company_registered_address,registered_company_mobile_no,password} = req.body;
        let profile = `${process.env.CLIENT_URL}/profile/${Company_Name}`;
  
        let newCompany = new Company({Company_Name,TAN_No,registered_company_email,role,company_registered_address,registered_company_mobile_no,password,profile});
        newCompany.save((err, success) => {
            if (err){
                return res.status(400).json({
                    error: err
                })
            }
            else if(success){
                res.status(200).json({
                    message: "Signup Success! Please Signin"
                })
            }
        })
    })
}