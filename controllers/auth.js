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
const bcrypt = require('bcrypt');
// const { OAuth2Client } = require('google-auth-library');

exports.signup = (req, res) => {
    Company.findOne({TAN_No: req.body.TAN_No}).exec((err,company) => {
        if (company){
            return res.status(400).json({
                error: "Company already exsists"
            })
        }
    
        const {Company_Name,TAN_No,registered_company_email,role,company_registered_address,registered_company_mobile_no,password,confirmedPassword} = req.body;
        let profile = `${process.env.CLIENT_URL}/profile/${Company_Name}`;
  
        if (confirmedPassword === null){
            return res.status(403).json({
                error: "Confirm your password"
            })
        }
    
        if (password !== confirmedPassword){
            return res.status(403).json({
                error: "Password do not match"
            })
        }

        var password1 = bcrypt.hashSync(password,10);
        let Acknowledgement_No = _.times(15, () => _.random(35).toString(36)).join('').toUpperCase()

        let newCompany = new Company({Company_Name,TAN_No,registered_company_email,role,company_registered_address,registered_company_mobile_no,password:password1,profile,Acknowledgement_No});
        
       
        newCompany.save((err, success) => {
            if (err){
                return res.status(400).json({
                    error: err
                })
            }
            else if(success){
                res.status(200).json({
                    message: `Your Company has been registered successfully! Your Acknowlegement No is ${Acknowledgement_No}`
                })
            }
        })
    })
}

exports.login = (req,res) => {
 const {TAN_No, password} = req.body;
 Company.findOne({TAN_No}).exec((err, company) => {
    if (err || !company){
        return res.status(400).json({
            error: "Company dosen't exsist!!! Please Check again"
        });
    }

    if (!company.authenticate(password)) {
        return res.status(400).json({
          error: "Password is wrong"
        });
    }

    const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn: '1d'});

    res.cookie('token', token, {expiresIn: '1d'});

    const {Company_Name,TAN_No,registered_company_email,role,company_registered_address,registered_company_mobile_no,Acknowledgement_No} = company;
    return res.status(200).json({
        token,
        company: {Company_Name,TAN_No,registered_company_email,role,company_registered_address,registered_company_mobile_no,Acknowledgement_No,profile}
    })
 })  
}


exports.requireSignin = ejwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"], // added later
    userProperty: "auth"
  });

  
exports.signout = (req,res) => {
    res.clearCookie("token")
    res.json({
      message: 'Signout Success'
    })
  }

  exports.authMiddleware = (req,res,next) => {
    const authUserId = req.auth._id;
    User.findById({_id: authUserId}).exec((err,company) => {
      if (err || !company){
       return res.status(400).json({
         error: "Company already exsists"
       })
      }
 
      req.profile = company;
      next();
    })
 }

 exports.companyMiddleware = (req,res,next) => {
    const authUserId = req.auth._id;
    User.findById({_id: authUserId}).exec((err,company) => {
      if (err || !company){
       return res.status(400).json({
         error: "User already exsists"
       })
      }
  
      if (company.role !== "Company" || company.role === "Admin"){
        return res.status(400).json({
          error: "Company Area ! Access Denied"
        })
      }
  
      req.profile = company;
      next();
    })
    
  }
  
  exports.adminMiddleware = (req,res,next) => {
    const adminUserId = req.auth._id;
    User.findById({_id: adminUserId}).exec((err,company) => {
      if (err || !company){
       return res.status(400).json({
         error: "Company already exsists"
       })
      }
      if (company.role !== "Admin" || company.role === "Compamy"){
        return res.status(400).json({
          error: "Admin Resource ! Access Denied"
        })
      }
  
      req.profile = company;
      next();
    })
  }
  