const express = require('express');
const { runValidation } = require('../validators');
const { ledgercreatevalidation, ledgervalidation } = require('../validators/ledger');
const { ledgercreation, getAllLedgers, updateAllClosingBalances, getAllLedgersAccount } = require('../controllers/ledgerjournal');
const router = express.Router();

router.post('/create-new-ledger', ledgercreatevalidation, runValidation, ledgercreation);
router.get('/get-ledgers', getAllLedgers);
router.get('/get-ledgers-specific', getAllLedgersAccount);
router.put('/update-closing-balances', ledgervalidation, runValidation, updateAllClosingBalances);

module.exports = router;