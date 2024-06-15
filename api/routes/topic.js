const express = require('express');
const router = express.Router();
const db = require('../db/db');


// Function to count and rank similar words
function findSimilarWords(word, data, limit = 4, maxResults = 12) {
    if (!data || !Array.isArray(data) || data.length === 0 || !data[0].SoundexSimilarWords) {
        console.error('Invalid data format or empty data.');
        return [];
    }

    const similarWords = data[0].SoundexSimilarWords.split(',').map(w => w.trim());

    // Array to store word objects with similarity score and selected flag
    const result = [];

    // Calculate similarity count for each word
    similarWords.forEach(w => {
        const similarityScore = countSimilarCharacters(word, w);
        result.push({ word: w, similarity: similarityScore });
    });

    // Sort words by similarity score descending
    result.sort((a, b) => b.similarity - a.similarity);

    // Mark the top 'limit' items as selected
    result.slice(0, limit).forEach(item => {
        item.selected = true;
    });

    return result.slice(0, maxResults);;
}

// Function to count similar characters between two words
function countSimilarCharacters(word1, word2) {
    const set1 = new Set(word1);
    const set2 = new Set(word2);

    let count = 0;
    set1.forEach(char => {
        if (set2.has(char)) {
            count++;
        }
    });

    return count;
}



const {
    getAllTopicsQuery,
    getSerachTopicsQuery,
    findTopicByIdQuery,
    insertTopicQuery,
    getAllLessonType,
    updateTopicByIdQuery,
    deleteTopicByIdQuery,
    getAllTopicItemsQuery,
    findTopicItemByIdQuery,
    insertTopicItemQuery,
    updateTopicItemByIdQuery,
    updateTopicAnswerQuery,
    deleteTopicItemByIdQuery,
    selectWordSoundexQuery,
} = require('../db/queries/queries');


function parsePOSList(posList) {
    try {
        // Remove surrounding square brackets and split by '),'
        posList = posList.slice(1, -1).split('),');

        // Remove extra spaces and trim each item
        posList = posList.map(item => item.replace(/[\(\)\[\]]/g, '').trim());

        // Initialize an array to store parsed objects
        let parsedPOSList = [];

        // Iterate through each item and construct objects
        posList.forEach(item => {
            // Split each item by ', ' to separate word and POS
            let parts = item.split(', ');
            let word = parts[0].trim().replace(/'/g, ''); // Remove single quotes around word
            let pos = parts[1].trim().replace(/'/g, ''); // Remove single quotes around POS

            // Create an object for the word and POS
            let posObject = {};
            posObject[word] = pos;

            // Push the object to the parsed list array
            parsedPOSList.push(posObject);
        });

        return parsedPOSList;
    } catch (error) {
        console.error('Error parsing POS List:', error.message);
        return null; // Handle parsing error gracefully
    }
}


// GET all topic items by topicId
router.get('/topicItem/all/:topicId', async (req, res) => {
    const {topicId} = req.params;
    console.log(getAllTopicItemsQuery(topicId))
    try {
        const topicItems = await db.executeQuery(getAllTopicItemsQuery(topicId));

        topicItems.forEach(item => {
            item.POSList = parsePOSList(item.POSList);
        });
        console.log(topicItems);

        res.send(topicItems);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving topic items.');
    }
});

// GET a topic item by ID
router.get('/topicItem/:topicItemId', async (req, res) => {
    const {topicItemId} = req.params;
    try {
        const topicItem = await db.executeQuery(findTopicItemByIdQuery(topicItemId));
        if (topicItem.length === 0) {
            res.send({});
        } else {
            res.json(topicItem[0]);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving the topic item.');
    }
});

// POST create a new topic item
router.post('/topicItem', async (req, res) => {
    const {topicId, lessonTypeId, srtPhraseId, fromId, toId, content, title} = req.body;
    console.log(insertTopicItemQuery(topicId, lessonTypeId, srtPhraseId, fromId, toId, content, title));
    try {
        await db.executeQuery(insertTopicItemQuery(topicId, lessonTypeId, srtPhraseId, fromId, toId, content, title));
        res.status(201).json({message: 'Topic item created successfully.'});
    } catch (error) {
        // console.error(error);
        res.status(500).send('Error creating the topic item.');
    }
});

// PUT update an existing topic item by ID
router.put('/topicItem/:topicItemId', async (req, res) => {
    const {topicItemId} = req.params;
    let {title, content, lessonTypeId} = req.body;

    content = content.replace(/'/g,"''");
    console.log("content >>>>>>>>>>>>>", content);

    try {
        console.log(updateTopicItemByIdQuery(topicItemId, lessonTypeId, content, title));
        await db.executeQuery(updateTopicItemByIdQuery(topicItemId, lessonTypeId, content, title));
        res.json({message: 'Topic item updated successfully.'});
    } catch (error) {
        // console.error(error);
        res.status(500).send('Error updating the topic item.');
    }
});

// PUT update an existing topic item by ID
router.put('/topicItem/answer/:topicItemId', async (req, res) => {
    const {topicItemId} = req.params;
    let {question, options,answer} = req.body;

    try {
        console.log(updateTopicAnswerQuery(topicItemId,question, options,answer));
        await db.executeQuery(updateTopicAnswerQuery(topicItemId,question, options,answer));
        res.json({message: 'Topic item updated successfully.'});
    } catch (error) {
        // console.error(error);
        res.status(500).send('Error updating the topic item.');
    }
});

// DELETE a topic item by ID
router.delete('/topicItem/:topicItemId', async (req, res) => {
    const {topicItemId} = req.params;
    try {
        await db.executeQuery(deleteTopicItemByIdQuery(topicItemId));
        res.json({message: 'Topic item deleted successfully.'});
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting the topic item.');
    }
});
// topics

router.get('/all', async (req, res) => {
    try {
        const topics = await db.executeQuery(getAllTopicsQuery(1));
        res.json(topics);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving topics.');
    }
});

router.get('/lessonType', async (req, res) => {
    try {
        const lessonTypes = await db.executeQuery(getAllLessonType());
        res.json(lessonTypes);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving lessonTypes.');
    }
});

router.get('/search/:text', async (req, res) => {
    console.log('>>>>>>>>>>>>>>>>>>>>>');
    try {
        const topics = await db.executeQuery(getSerachTopicsQuery(1, req.params.text));
        res.json(topics);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving topics.');
    }
});

// GET a topic by ID
router.get('/:topicId', async (req, res) => {
    const {topicId} = req.params;
    try {
        const topic = await db.executeQuery(findTopicByIdQuery(topicId));
        if (topic.length === 0) {
            res.send({});
        } else {
            res.json(topic[0]);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving the topic.');
    }
});

// POST create a new topic
router.post('/', async (req, res) => {
    console.log(req.body)
    const {Title, IsActive, UserId} = req.body;
    try {
        await db.executeQuery(insertTopicQuery(Title, IsActive, UserId));
        res.status(201).json({message: 'Topic created successfully.'});
    } catch (error) {
        console.log(error);
        res.status(500).send('Error creating the topic.');
    }
});

// PUT update an existing topic by ID
router.put('/:topicId', async (req, res) => {
    const {topicId} = req.params;
    const {Title, IsActive, UserId} = req.body;
    console.log(topicId, Title);
    try {
        await db.executeQuery(updateTopicByIdQuery(topicId, Title));
        res.json({message: 'Topic updated successfully.'});
    } catch (error) {
        console.log(error)
        res.status(500).send('Error updating the topic.');
    }
});

// DELETE a topic by ID
router.delete('/:topicId', async (req, res) => {
    const {topicId} = req.params;
    try {
        await db.executeQuery(deleteTopicByIdQuery(topicId));
        res.json({message: 'Topic deleted successfully.'});
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting the topic.');
    }
});

// GET a topic by ID
router.get('/soundex/:word', async (req, res) => {
    const {word} = req.params;
    try {
        const soundexData = await db.executeQuery(selectWordSoundexQuery(word));
        // Usage example: find 4 most similar words to 'straight'
        const similarWords = findSimilarWords('straight', soundexData, 4,12);
        console.log(similarWords);

        res.json(similarWords);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving the topic.');
    }
});


module.exports = router;
