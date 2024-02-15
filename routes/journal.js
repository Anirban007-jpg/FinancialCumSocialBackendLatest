const express = require('express');
const { runValidation } = require('../validators');
const { journalcreatevalidation, ledgervalidation } = require('../validators/ledger');
const { journalcreation } = require('../controllers/ledgerjournal');
const { validateTokenMiddleware } = require('../controllers/validatetoken');
const { companyMiddleware } = require('../controllers/auth');
const router = express.Router();

router.post('/create-journal-entry', journalcreatevalidation, runValidation,validateTokenMiddleware,companyMiddleware, journalcreation);



module.exports = router;