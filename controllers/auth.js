const fo = require('formidable');
const fs = require('fs');
// const sid = require('shortid');
const jwt = require('jsonwebtoken');
const { expressjwt: ejwt } = require('express-jwt');
const sgMail = require('@sendgrid/mail'); // SENDGRID_API_KEY
const nm = require('nodemailer');
require('dotenv').config()
const _ = require('lodash');
const Company = require('../models/company');
const bcrypt = require('bcrypt');
const { OAuth2Client } = require('google-auth-library');

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
 Company.findOne({TAN_No: req.body.TAN_No }).exec((err, company) => {
    if (err || !company){
        return res.status(400).json({
            error: "Company dosen't exsist!!! Please Check again"
        });
    }

    var checked = bcrypt.compareSync(password, company.password);

    if (!checked) {
        return res.status(400).json({
          error: "Password is wrong"
        });
    }

    const token = jwt.sign({_id: company._id}, process.env.JWT_SECRET, {expiresIn: '1d'});

    res.cookie('token', token, {expiresIn: '1d'});

    const {Company_Name,TAN_No,registered_company_email,role,Initials,company_registered_address,registered_company_mobile_no,profile,Acknowledgement_No} = company;
    return res.status(200).json({
        token,
        company: {Company_Name,TAN_No,registered_company_email,role,Initials,company_registered_address,registered_company_mobile_no,Acknowledgement_No,profile}
    })
 })  
}

exports.getALlCompmanies  = (req,res) => {
  Company.find((err, companies) => {
    if (err){
      return res.status(400).json({
          error: "Oops! Soimethimg went Wrong"
      })
    }

    return res.status(200).json({
     companies
    })

  })
}

const client = new OAuth2Client('539870753617-cjb7cdvolethiaj7hl2phmlr7nq322ub.apps.googleusercontent.com');
exports.googleLogin = (req,res) => {
    const { idToken } = req.body;
    admin.auth().verifyIdToken({ idToken: idToken , audience: '539870753617-cjb7cdvolethiaj7hl2phmlr7nq322ub.apps.googleusercontent.com' }).then(response => {
      console.log(response)
    })
      
}

exports.forgotPasword = (req,res) => {
  const { email } = req.body.registered_company_email;

  Company.findOne({ email }, (err, company) => {
      if (err || !company) {
          return res.status(401).json({
              error: 'User with that email does not exist'
          });
      }

      const token = jwt.sign({ _id: company._id }, process.env.JWT_RESET_PASSWORD, { expiresIn: '10m' });

      let transporter = nm.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        auth: {
            user: 'financia2926@gmail.com',
            pass: 'fmwh lsuq mhum echs',
        },
        secure: true
    
        })
      // email
      
      const mailOptions = {
          from: 
          {
            name: 'FINANCIA',
            address : 'abanerjee763@gmail.com',
          },
          to: company.registered_company_email,
          subject: 'Email to reset password',
          html: `
          <p>Please use the following link to reset your password:</p> +
          <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
          <hr />
          <p>This email may contain sensetive information</p>
          <p>https://seoblog.com</p>
        };
        `
      };
      // populating the db > user > resetPasswordLink
      return company.updateOne({ resetPasswordLink: token }, (err, success) => {
          if (err) {
              return res.json({ error: err });
          } else {
            transporter.sendMail(mailOptions, (err,success) => {
              if(err){
                  console.log(err);
                  res.status(400).json({
                      error: err
                  });
                  
              }
      
              res.status(200).json({
                  message: "password reset link sent succesfully!"
              })
                })
          }
      });
  });
};

exports.ResetPassword = (req,res) => {
  const { resetPasswordLink, newPassword } = req.body;

  if (resetPasswordLink) {
      jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD, function(err, decoded) {
          if (err) {
              return res.status(401).json({
                  error: 'Expired link. Try again'
              });
          }
          Company.findOne({ resetPasswordLink }, (err, company) => {
              if (err || !company) {
                  return res.status(401).json({
                      error: 'Something went wrong. Try later'
                  });
              }
              const updatedFields = {
                  password: bcrypt.hashSync(newPassword,10),
                  resetPasswordLink: ''
              };

              company = _.extend(company, updatedFields);

              company.save((err, result) => {
                  if (err) {
                      return res.status(400).json({
                          error: err
                      });
                  }
                  res.json({
                      message: `Great! Now you can login with your new password`
                  });
              });
          });
      });
  }
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
  