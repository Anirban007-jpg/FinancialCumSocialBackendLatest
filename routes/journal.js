const express = require('express');
const { runValidation } = require('../validators');
const { journalcreatevalidation, ledgervalidation } = require('../validators/ledger');
const { journalcreation } = require('../controllers/ledgerjournal');
const router = express.Router();

router.post('/create-journal-entry', journalcreatevalidation, runValidation, journalcreation);



module.exports = router;