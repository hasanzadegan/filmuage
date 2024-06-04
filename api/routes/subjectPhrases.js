// routes/subjectPhrases.js
const express = require('express');
const router = express.Router();
const db = require('../db/db');
const { getSubjectPhrasesQuery, createAssignPhraseQuery, createRemovePhraseQuery } = require('../db/queries/queries');


// GET route to assign a phrase to a subject
router.get('/:subjectId/:strPhraseId', async (req, res) => {
    try {
        const { subjectId, strPhraseId } = req.params;

        // Perform validation on the input data if needed

        // Generate the query to assign a phrase to a subject
        const assignQuery = createAssignPhraseQuery(subjectId, strPhraseId);
        await db.executeQuery(assignQuery);

        res.send('Phrase assigned to subject successfully.');
    } catch (error) {
        console.log(error);
        res.status(500).send('Error assigning phrase to subject.');
    }
});

// GET route to retrieve phrases in a subject
router.get('/:subjectId', async (req, res) => {
    try {
        const { subjectId } = req.params;

        // Perform validation on the input data if needed

        // Generate the query to retrieve phrases in the subject
        const phrasesQuery = getSubjectPhrasesQuery(subjectId);
        const phrases = await db.executeQuery(phrasesQuery);

        res.json(phrases);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error retrieving phrases in the subject.');
    }
});

// DELETE route to remove a phrase from a subject
router.delete('/:phraseListId', async (req, res) => {
    try {
        const { phraseListId } = req.params;

        // Perform validation on the input data if needed

        // Generate the query to remove the phrase from the subject
        const removeQuery = createRemovePhraseQuery(phraseListId);
        await db.executeQuery(removeQuery);

        res.send('Phrase removed from subject successfully.');
    } catch (error) {
        console.log(error);
        res.status(500).send('Error removing phrase from subject.');
    }
});

module.exports = router;
