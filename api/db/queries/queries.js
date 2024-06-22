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

    if(params.fileId){
        conditions.push(`SRTFileID = ${params.fileId}`);
    }

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
    console.log(query);
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
    `SELECT * from Category`;

// CRUD queries for Topic
const getAllTopicsQuery = (userId) => `SELECT top 30 * FROM Topic where userId=${userId} and IsActive = 1 order by CreateDate desc`;
const getAllLessonType= (userId) => `SELECT * FROM LessonType where isActive = 1`;

const getSerachTopicsQuery = (userId,title) => `
    SELECT top 30 * FROM Topic 
    where userId=${userId} 
    and IsActive = 1
    and title like '%${title}%'`;

const findTopicByIdQuery = (id) => `
    SELECT * FROM Topic WHERE Id = '${id}';
`;

const insertTopicQuery = (Title, UserId,IsActive) => `
    INSERT INTO Topic (Title, UserId,IsActive)
    VALUES ('${Title}','${UserId}', ${IsActive});
`;

const updateTopicByIdQuery = (id, Title) => `
    UPDATE Topic
    SET Title = '${Title}'
    WHERE Id = '${id}';
`;

const deleteTopicByIdQuery = (id) => `
    UPDATE Topic
    SET IsActive = 0
    WHERE Id = '${id}';
`;


const insertTopicItemQuery = (topicId, lessonTypeId, srtPhraseId, fromId, toId, content, title) => `
    INSERT INTO TopicItem (TopicId, LessonTypeId, SRTPhraseID, FromId, ToId, Content, Title)
    VALUES ('${topicId}', ${lessonTypeId}, ${srtPhraseId}, ${fromId}, ${toId}, '${content}', '');
`;


const getAllTopicItemsQuery = (topicId) => `
    SELECT * FROM VWTopicItem where topicId = '${topicId}' order by orderId,createDate ;
`;

const getTopicListQuery = (topicId) => `
    SELECT Id FROM VWTopicItemList where topicId = '${topicId}' order by orderId,createDate ;
`;

const getStudentTopicItemsQuery = (topicItemId) => `
    SELECT top 1 FROM VWStudentTopicItem where topicItemId = '${topicItemId}' order by orderId,createDate ;
`;

const findTopicItemByIdQuery = (id) => `
    SELECT * FROM TopicItem WHERE Id = '${id}';
`;
const updateTopicItemByIdQuery = (topicItemId, lessonTypeId, content, title) => `
    UPDATE TopicItem
    SET LessonTypeId = ${lessonTypeId}, 
        Content = '${content}', 
        Title = '${title}'
    WHERE Id = '${topicItemId}';
`;

const updateTopicAnswerQuery = (topicItemId, question, options,answer) => `
    UPDATE TopicItem
    SET question = '${question}', 
        options = '${options}', 
        answer = '${answer}'
    WHERE Id = '${topicItemId}';
`;

const deleteTopicItemByIdQuery = (id) => `
    DELETE FROM TopicItem WHERE Id = '${id}';
`;

const selectWordSoundexQuery = (word) => `
    select w.SoundexSimilarWords from WordSoundex w where w.Word = '${word}'
`;

const selectWordDefinitionsQuery = (word) => `
    select w.definitions  from WordSoundex w where w.Word = '${word}'
`;

const updateWordDefinitionsQuery = (word,definitions) => `
UPDATE WordSoundex SET definitions = '${definitions}' WHERE Word = '${word}'
`;


const selectFileName = (name) => `
    select * from SRTFiles where UPPER(FileName) like '%${name}%'
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
    selectWordDefinitionsQuery,
    updateWordDefinitionsQuery,
    getAllTopicsQuery,
    getAllLessonType,
    getSerachTopicsQuery,
    findTopicByIdQuery,
    insertTopicQuery,
    updateTopicByIdQuery,
    deleteTopicByIdQuery,
    selectCategory,
    insertTopicItemQuery,
    getAllTopicItemsQuery,
    getTopicListQuery,
    getStudentTopicItemsQuery,
    findTopicItemByIdQuery,
    updateTopicItemByIdQuery,
    updateTopicAnswerQuery,
    deleteTopicItemByIdQuery,
    selectWordSoundexQuery,
    selectFileName
};
