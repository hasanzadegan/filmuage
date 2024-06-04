// queries/queries.js
const getAllSubjectsQuery = 'SELECT * FROM Subjects';
const findSubjectByIdQuery = (subjectId) => {
    return `SELECT * FROM subjects WHERE subjectID = ${subjectId}`;
};

const insertSubjectQuery = (subjectName) =>
    `INSERT INTO Subjects (SubjectName) VALUES ('${subjectName}')`;

const deleteSubjectQuery = (subjectId) =>
    `DELETE FROM Subjects WHERE SubjectID = ${subjectId}`;

const generateSRTPhrasesQuery = ( params) => {
    let query = 'SELECT TOP 50 * FROM SRTPhrases';
    const conditions = [];


    if (params.phrase) {
        conditions.push(`Phrase LIKE '%${params.phrase}%'`);
    }

    if (params.selectedPos && params.selectedPos.length > 0) {
        const posConditions = params.selectedPos.map(pos => `POSList LIKE '%${pos}%'`);
        conditions.push(`(${posConditions.join(' AND ')})`);
    }

    if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
    }
    return query;
};

const generateSRTPhrasesAround = (SRTPhraseID) =>
    `SELECT TOP 50 (SRTPhraseID - ${Number(SRTPhraseID)}) loc,
            *,
            CASE 
                WHEN SRTPhraseID = ${Number(SRTPhraseID)} THEN CAST(1 AS BIT) 
                ELSE CAST(0 AS BIT) 
            END as selected
     FROM SRTPhrases 
     WHERE SRTPhraseID BETWEEN ${Number(SRTPhraseID) - 3} 
                           AND ${Number(SRTPhraseID) + 3}`;


const generateCategorisePhrase = (CategoryId, params) => {
    let query = `
        SELECT *
        FROM (
            SELECT ROW_NUMBER() OVER (PARTITION BY ws.Word ORDER BY ws.Word) AS rn, ws.Word, p.*
            FROM [dbo].[SRTPhrases] p
            JOIN [dbo].[WordSoundex] ws ON p.[Phrase] LIKE '% ' + ws.[Word] + ' %'
            JOIN [dbo].[WordCategories] wc ON wc.[WordId] = ws.[ID]
            WHERE wc.CategoryId = ${CategoryId}
        ) q
        WHERE q.rn < 5
    `;

    const conditions = [];

    if (params.phrase) {
        conditions.push(`p.Phrase LIKE '%${params.phrase}%'`);
    }

    if (params.selectedPos && params.selectedPos.length > 0) {
        const posConditions = params.selectedPos.map(pos => `q.POSList LIKE '%${pos}%'`);
        conditions.push(`(${posConditions.join(' OR ')})`);
    }

    if (params.selectedWords && params.selectedWords.length > 0) {
        const wordConditions = params.selectedWords.map(word => `q.Phrase LIKE '%${word}%'`);
        conditions.push(`(${wordConditions.join(' OR ')})`);
    }

    if (conditions.length > 0) {
        query += ' AND ' + conditions.join(' AND ');
    }

    return query;
};





// Get all POS values
const createGetAllPOSQuery =  'SELECT * FROM POS';


const getSubjectPhrasesQuery = (subjectId) => `
  SELECT SRTPhrases.*
  FROM SRTPhrases
  INNER JOIN PhraseList ON PhraseList.SRTPhraseID = SRTPhrases.ID
  WHERE PhraseList.SubjectID = ${subjectId}
`;

const createAssignPhraseQuery = (subjectId, srtPhraseId) => `
  INSERT INTO PhraseList (SubjectID, SRTPhraseID)
  VALUES (${subjectId}, ${srtPhraseId})
`;

// Function to generate query for removing a phrase from a subject
const createRemovePhraseQuery = (phraseListId) => {
    // Generate the query based on the phraseListId
    const query = `DELETE FROM PhraseList WHERE PhraseListID = ${phraseListId}`;
    return query;
};

const selectMoviePartQuery = (guid) =>
    `SELECT * FROM moviePart WHERE GUID = '${guid}'`;

const selectWordSoundex = (wordList) =>
    `
    SELECT JSON_QUERY(
        (
        SELECT w.Word,w.POS,w.SimilarWords SW ,w.SoundexSimilarWords SSW
                FROM WordSoundex w
            WHERE Word IN (${wordList})
            ORDER BY RepeatTime ASC
            FOR JSON PATH
        )
    )as wJSON
 `;

const selectCategory = () =>
    `
    SELECT * from Category
 `;


module.exports = {
    getAllSubjectsQuery,
    findSubjectByIdQuery,
    insertSubjectQuery,
    deleteSubjectQuery,
    generateSRTPhrasesQuery,
    generateSRTPhrasesAround,
    generateCategorisePhrase,
    createGetAllPOSQuery,
    getSubjectPhrasesQuery,
    createAssignPhraseQuery,
    createRemovePhraseQuery,
    selectMoviePartQuery,
    selectWordSoundex,
    selectCategory
};
