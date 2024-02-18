const Journal = require("../models/Journal")
const Ledger = require("../models/Ledger")
const _ = require('lodash');
const math = require("mathjs");
const ProfitLoss = require("../models/Profit&Loss");

exports.ledgercreation = (req,res) => {
    Ledger.findOne({AccountName : req.body.AccountName}).exec((err,ledger) => {
        if (ledger){
            return res.status(400).json({
                error: "Account already exsists... Cannot create new Account"
            })
        }

        const {AccountName,AccountGroup,SubAccountGroup,IndividualAccountGroup,company_name,Balance_Type,Financial_Year,Currency_Type} = req.body;
        const number = parseFloat(req.body.balStart).toFixed(3);
        const Opening_Balance = math.round(number, 0);
        const Balance = Opening_Balance;

        if (AccountName === "Debtor"){
            const Debtor_id = math.round(math.random()*10000, 0);  
            let newLedger = new Ledger({AccountName,AccountGroup,SubAccountGroup,IndividualAccountGroup,company_name,Currency_Type, Financial_Year,Balance_Type,Opening_Balance,Balance,Debtor_id});
            newLedger.save((err, success) => {
                if (err){
                    return res.status(400).json({
                        error: err
                    })
                }
                else if(success){
                    res.status(200).json({
                        message: `${AccountName} A/C Ledger is created`
                    })
                }
            })    
        }

        if (AccountName === "Creditor"){
            const Creditor_id = math.round(math.random()*10000, 0);  
            let newLedger = new Ledger({AccountName,AccountGroup,SubAccountGroup,IndividualAccountGroup,company_name,Currency_Type, Financial_Year,Balance_Type,Opening_Balance,Balance,Creditor_id});
            newLedger.save((err, success) => {
                if (err){
                    return res.status(400).json({
                        error: err
                    })
                }
                else if(success){
                    res.status(200).json({
                        message: `${AccountName} A/C Ledger is created`
                    })
                }
            })    
        }
        
        let newLedger = new Ledger({AccountName,AccountGroup,SubAccountGroup,IndividualAccountGroup,company_name,Currency_Type, Financial_Year,Balance_Type,Opening_Balance,Balance});
        newLedger.save((err, success) => {
            if (err){
                return res.status(400).json({
                    error: err
                })
            }
            else if(success){
                res.status(200).json({
                    message: `${AccountName} is created`
                })
            }
        })
    })
}


exports.journalcreation = async (req,res) => {
        
    const {Transaction_Date,Financial_Year,Assessment_Year,Debit_item_Account,Discount_Received,Discount_Allowed,Credit_item_Account,company_name,Narration,Debit_Currency_Type,Credit_Currency_Type} = req.body;
    var number = parseFloat(req.body.Debit_item_Balance).toFixed(3);
    var Debit_item_Balance = math.round(number, 0);
    var number1 = parseFloat(req.body.Credit_item_Balance).toFixed(3);
    var Credit_item_Balance = math.round(number1, 0);
 
    if (Debit_item_Account === "Purchases"){
        var number4 = math.divide(parseFloat(Discount_Received).toFixed(3),100);
        var Discount_Received_Percentage = math.round(number4,3);
        var number5 = math.multiply(Discount_Received_Percentage,Debit_item_Balance);
        var Discount_Received_Balance = math.round(number5,0);
        var Discount_Received_Balance_Type = "Cr"
        var Credit_item_Balance = math.subtract(Credit_item_Balance, Discount_Received_Balance);
        // console.log();
    }

    let data = await Ledger.findOne({ AccountName : Credit_item_Account});
    
    if (data.IndividualAccountGroup === "Assets"){
        if (Debit_item_Balance > Credit_item_Balance){
            var Profit_on_Sale_of_Asset_Balance = math.subtract(Debit_item_Balance, Credit_item_Balance);
            var Profit_on_Sale_of_Asset_Balance_Type = "Cr";
        } else if (Debit_item_Balance < Credit_item_Balance){
            var Loss_on_Sale_of_Asset_Balance = math.subtract(Credit_item_Balance, Debit_item_Balance);
            var Loss_on_Sale_of_Asset_Balance_Type = "Dr";
        }
    }

    if (Credit_item_Account === "Sales"){
        var number6 = math.divide(parseFloat(Discount_Allowed).toFixed(3),100);
        var Discount_Allowed_Percentage = math.round(number6,3);
        var number7 = math.multiply(Discount_Allowed_Percentage,Debit_item_Balance);
        var Discount_Allowed_Balance = math.round(number7,0);
        var Discount_Allowed_Balance_Type = "Dr"
        var Debit_item_Balance = math.subtract(Debit_item_Balance, Discount_Allowed_Balance);
    
        // console.log();
    }
    
    // console.log(req.body.Debit_item_Account);

    Ledger.findOne({AccountName: req.body.Debit_item_Account}).exec((err,ledger) => {
        const PrevBalance = math.round(parseFloat(ledger.Balance).toFixed(3),0);
        console.log(Debit_item_Balance);
        if (ledger.Balance_Type === "Dr"){
            let newBalance = math.add(PrevBalance, Debit_item_Balance);
            const updatedFields = {
                Balance : newBalance
            }
                ledger = _.extend(ledger, updatedFields);
                ledger.save((err,success) => {
                if (err){
                    return res.status(400).json({
                        error: err
                    })
                }
                else if(success){
                    res.status(200);
                    // console.log(success);
                }
            })
        }else if (ledger.Balance_Type === "Cr"){
            let newBalance = math.subtract(PrevBalance, Debit_item_Balance);
            const updatedFields = {
                Balance : newBalance
            }
                ledger = _.extend(ledger, updatedFields);
                ledger.save((err,success) => {
                if (err){
                    return res.status(400).json({
                        error: err
                    })
                }
                else if(success){
                    res.status(200)
                }
            })
        }
    })

    Ledger.findOne({AccountName: req.body.Credit_item_Account}).exec((err,ledger) => {
        const PrevBalance = math.round(parseFloat(ledger.Balance).toFixed(3),0);
        console.log()
        if (ledger.Balance_Type === "Dr"){
            let newBalance = math.subtract(PrevBalance, Credit_item_Balance);
            const updatedFields = {
                Balance : newBalance
            }

            ledger = _.extend(ledger, updatedFields);
            ledger.save((err,success) => {
                if (err){
                    return res.status(400).json({
                        error: err
                    })
                }
                else if(success){
                    res.status(200);
                    // console.log(success)
                }
            })
        }else if (ledger.Balance_Type === "Cr"){

            let newBalance = math.add(PrevBalance, Credit_item_Balance);
            const updatedFields = {
                Balance : newBalance
            }

            ledger = _.extend(ledger, updatedFields);
            ledger.save((err,success) => {
                if (err){
                    return res.status(400).json({
                        error: err
                    })
                }
                else if(success){
                    res.status(200)
                }
            })
        }      
    })

    
    if (Debit_Currency_Type.localeCompare(Credit_Currency_Type) !== 0){
        return res.status(403).json({
            error: "Debit and Credit Currency Type must be same"
        })
    }

    
    if (data.IndividualAccountGroup === "Assets" && Credit_item_Account === data.AccountName){
        let newPL = new ProfitLoss({Transaction_Date,Financial_Year,Assessment_Year,Profit_on_Sale_of_Asset_Balance,Profit_on_Sale_of_Asset_Balance_Type,Loss_on_Sale_of_Asset_Balance,Loss_on_Sale_of_Asset_Balance_Type});
        newPL.save((err,success) => {
            if (err){
                return res.status(400).json({
                    error: err
                })  
            }
    
            res.status(200).json()
        })
    }

    let newJournal = new Journal({Transaction_Date, Profit_on_Sale_of_Asset_Balance,Profit_on_Sale_of_Asset_Balance_Type,Loss_on_Sale_of_Asset_Balance,Loss_on_Sale_of_Asset_Balance_Type,Discount_Received_Balance,Discount_Received_Balance_Type,Discount_Allowed_Balance,Discount_Allowed_Balance_Type,Financial_Year,Assessment_Year,Debit_item_Account,Debit_Currency_Type,Credit_Currency_Type,Credit_item_Account,company_name,Debit_item_Balance,Credit_item_Balance,Narration});
    
    newJournal.save((err, success) => {
        if (err){
            return res.status(400).json({
                error: err
            })
        }
        else if(success){
            res.status(200).json({
                message: `Journal entry created`
            })
        }
    })
}

exports.getAllLedgers = (req,res) => {
    Journal.find({$or : [{Credit_item_Account: req.body.AccountName,Financial_Year: req.body.Financial_Year},{Debit_item_Account: req.body.AccountName,Financial_Year: req.body.Financial_Year}]})
    .select('Debit_item_Account Transaction_Date Credit_item_Account Debit_item_Balance Credit_item_Balance Narration')
    .exec((err,data) => {
        if (err){
            return res.status(400).json({
                error: err
            })
        }
        res.json(data);
    })
}

exports.getAllLedgersAccount = (req,res) => {
    Ledger.find({})
    .select('AccountName Balance Closing_Balance')
    .exec((err,data) => {
        if (err){
            return res.status(400).json({
                error: err
            })
        }
        res.json(data);
    })
}


exports.updateAllClosingBalances = (req,res) => {
   const {AccountName} = req.body;
   Ledger.findOne({AccountName: AccountName}).exec((err,ledger) => {
    const updatedFields = {
        Closing_Balance : ledger.Balance
    }

    ledger = _.extend(ledger,updatedFields);
    ledger.save((err,success) => {
        if (err){
            return res.status(400).json({
                error: err
            })
        }
        else if(success){
            res.status(200).json({
                message: `Closing Balances of ${Account} A/C updated successfully`
            })
        }
    })
   })
}
