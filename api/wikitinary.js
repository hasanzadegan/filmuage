const axios = require('axios');
const cheerio = require('cheerio');

async function getWordMeaning(word) {
    try {
        const response = await axios.get(`https://en.wiktionary.org/wiki/${word}`);
        const $ = cheerio.load(response.data);
        const meanings = [];

        // Extract meanings from the page
        $('.mw-parser-output > ol').first().find('li').each((index, element) => {
            meanings.push($(element).text());
        });

        return meanings;
    } catch (error) {
        console.error("Error:", error);
        return "Failed to fetch meaning.";
    }
}

// Example usage:
const word = 'example';
getWordMeaning(word)
    .then(meanings => {
        console.log(`Meanings of '${word}':`);
        meanings.forEach((meaning, index) => {
            console.log(`${index + 1}. ${meaning}`);
        });
    })
    .catch(error => console.error(error));
