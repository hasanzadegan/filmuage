const express = require('express');
const router = express.Router();
const db = require('../db/db');
const { generateSRTPhrasesAround,generateSRTPhrasesQuery ,generateCategorisePhrase, selectMoviePartQuery, selectWordSoundex,selectCategory} = require('../db/queries/queries');
const { cropMovie,getMovieName } = require('../global/movieAction');

// POST SRTPhrases with dynamic criteria
router.post('/', async (req, res) => {

    try {
        const criteria = req.body.params;
        let query = '';
        if(criteria.categoryId){
            query = generateCategorisePhrase(criteria.categoryId, criteria);
        }else{
            query = generateSRTPhrasesQuery(criteria);
        }

        const srtPhrases = await db.executeQuery(query);
        res.json(srtPhrases);
    } catch (error) {
        res.status(500).send('Error executing the query.');
    }
});



// POST route to crop a movie
router.get('/around/:SRTPhraseID', async (req, res) => {
    try {
        const query = generateSRTPhrasesAround(req.params.SRTPhraseID);
        const movies = await db.executeQuery(query);
        res.send(movies);
    } catch (error) {
        res.status(500).send('Error Around',error);
    }
})

router.post('/cropMovie', async (req, res) => {
    try {
        const guid = req.body.GUID;
        const query = selectMoviePartQuery(guid);
        const movies = await db.executeQuery(query);
        const movie = movies[0];

        const phrase = movie.Phrase.replace(/[^a-zA-Z\s?]/g, '');
        const wordList = phrase.trim().split(' ').map(word => `'${word}'`).join(',');
        const query1 = selectWordSoundex(wordList);
        const soundexList = await db.executeQuery(query1);


        const startTime = req.body.StartTime;
        const endTime = req.body.EndTime;
        const fromItem = req.body.fromItem;
        const toItem = req.body.toItem;

        const movieName = getMovieName(movie.FileName);
        await cropMovie(
            'd:\\movies\\friends\\' ,
            movieName,
            'd:\\project\\filmuage\\web\\src\\assets\\video\\',
            movie,soundexList,startTime,endTime,fromItem,toItem);


        res.send('Movie cropped successfully!');
    } catch (error) {
        console.log(error);
        res.status(500).send('Error cropping the movie.');
    }
});

router.get('/Category', async (req, res) => {
    try {
        const query = selectCategory();
        const Categories = await db.executeQuery(query);
        res.send(Categories);
    } catch (error) {
        res.status(500).send('Error cropping the movie.');
    }
});




module.exports = router;
