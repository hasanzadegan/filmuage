// routes/subjects.js
const express = require('express');
const router = express.Router();
const db = require('../db/db');
const { getAllSubjectsQuery,findSubjectByIdQuery, insertSubjectQuery, deleteSubjectQuery } = require('../db/queries/queries');

// GET all subjects
router.get('/', async (req, res) => {
    try {
        const result = await db.executeQuery(getAllSubjectsQuery);
        res.send(result);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error executing the query.');
    }
});

// GET route to find a subject by ID
router.get('/find/:subjectId', async (req, res) => {
    try {
        console.log(req.params)
        const { subjectId } = req.params;

        // Perform validation on the input data if needed

        // Generate the query to find the subject by ID using the separated function
        const findQuery = findSubjectByIdQuery(subjectId);
        const subject = await db.executeQuery(findQuery);

        if (subject.length === 0) {
            res.status(404).send('Subject not found.');
        } else {
            res.json(subject[0]);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Error finding subject.');
    }
});

// POST a new subject
router.post('/', async (req, res) => {
    try {
        const subjectName = req.body.SubjectName;
        const query = insertSubjectQuery(subjectName);
        await db.executeQuery(query);
        res.status(201).json({ message: 'Subject created successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error executing the query.' });
    }
});


// DELETE a subject
router.delete('/:id', async (req, res) => {
    try {
        const subjectId = req.params.id;
        const query = deleteSubjectQuery(subjectId);
        await db.executeQuery(query);
        res.sendStatus(204);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error executing the query.');
    }
});

module.exports = router;
