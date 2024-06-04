// routes/pos.js
const express = require('express');
const router = express.Router();
const db = require('../db/db');
const { createGetAllPOSQuery } = require('../db/queries/queries');

// GET all POS values
router.get('/', async (req, res) => {
    try {
        const posValues = await db.executeQuery(createGetAllPOSQuery);
        res.json(posValues);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error retrieving POS values.');
    }
});

module.exports = router;
