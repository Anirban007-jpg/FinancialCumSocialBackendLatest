const express = require('express');
const { runValidation } = require('../validators');
const { ledgercreatevalidation, ledgervalidation } = require('../validators/ledger');
const { ledgercreation, getAllLedgers, updateAllClosingBalances, getAllLedgersAccount } = require('../controllers/ledgerjournal');
const { requireSignin, companyMiddleware } = require('../controllers/auth');
const { validateTokenMiddleware } = require('../controllers/validatetoken');
const router = express.Router();

router.post('/create-new-ledger', ledgercreatevalidation, runValidation, validateTokenMiddleware ,companyMiddleware,ledgercreation);
router.post('/get-ledgers-details', validateTokenMiddleware ,companyMiddleware,getAllLedgers);
router.get('/get-ledgers-specific', validateTokenMiddleware ,companyMiddleware,getAllLedgersAccount);
router.put('/update-closing-balances', ledgervalidation, runValidation,validateTokenMiddleware ,companyMiddleware, updateAllClosingBalances);


module.exports = router;