const Journal = require("../models/Journal")
const Ledger = require("../models/Ledger")
const _ = require('lodash');
const math = require("mathjs")

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
                    message: `${AccountName} A/C Ledger is created`
                })
            }
        })
    })
}


exports.journalcreation = (req,res) => {
        
        const {Transaction_Date,Financial_Year,Assessment_Year,Debit_item_Account,Credit_item_Account,company_name,Narration,Debit_Currency_Type,Credit_Currency_Type} = req.body;
        const number = parseFloat(req.body.Debit_item_Balance).toFixed(3);
        const Debit_item_Balance = math.round(number, 0);
        const number1 = parseFloat(req.body.Credit_item_Balance).toFixed(3);
        const Credit_item_Balance = math.round(number1, 0);
        
        Ledger.findOne({AccountName: req.body.Debit_item_Account}).exec((err,ledger) => {
            const PrevBalance = math.round(parseFloat(ledger.Opening_Balance).toFixed(3),0);
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
                        res.status(200)
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
            const PrevBalance = math.round(parseFloat(ledger.Opening_Balance).toFixed(3),0);
            if (ledger.Balance_Type === "Dr"){
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
            }else if (ledger.Balance_Type === "Cr"){
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
                        res.status(200)
                    }
                })
            }      
        })

        if (Debit_item_Balance !== Credit_item_Balance){
            return res.status(403).json({
                error: "Debit and Credit must be equal"
            })
        }

        if (Debit_Currency_Type.localeCompare(Credit_Currency_Type) !== 0){
            return res.status(403).json({
                error: "Debit and Credit Currency Type must be same"
            })
        }

        let newJournal = new Journal({Transaction_Date,Financial_Year,Assessment_Year,Debit_item_Account,Debit_Currency_Type,Credit_Currency_Type,Credit_item_Account,company_name,Debit_item_Balance,Credit_item_Balance,Narration});

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
    Ledger.find({})
    .select('AccountName Balance Opening_Balance Closing_Balance')
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
