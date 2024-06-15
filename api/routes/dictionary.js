const express = require('express');
const router = express.Router();
const db = require('../db/db');
const { selectWordDefinitionsQuery,updateWordDefinitionsQuery} = require('../db/queries/queries');

// app.js

const axios = require('axios');


router.get('/:word', async (req, res) => {
    try {
        const word = req.params.word;
        const cleanedWord = word.replace(/[^\w\s]/g, '');

        const query = selectWordDefinitionsQuery(word);
        const result = await db.executeQuery(query);
        console.log(result[0].definitions != null,query);
        if (result[0].definitions != null) {
            res.send(JSON.parse(result[0].definitions)[0].meanings[0].definitions);
        }
        else{

            const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${cleanedWord}`);
            const def = JSON.stringify(response.data).replace(/'/g,"''");
            const query = updateWordDefinitionsQuery(word,def);
            console.log('result',query);

            const result = await db.executeQuery(query);
            const data = response.data[0];

            if (data.meanings && data.meanings.length > 0) {
                res.send(data.meanings[0].definitions);
            } else {
                console.log(`No definition found for "${word}"`);
            }


        }




    } catch (error) {
        console.error('Error fetching word definition:', error.message);
    }

});

module.exports = router;
