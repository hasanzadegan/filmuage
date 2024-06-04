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
    WHERE q.rn < 3
  `;

    const conditions = [];

    if (params.phrase) {
        conditions.push(`q.Phrase LIKE '%${params.phrase}%'`);
    }

    if (params.selectedPos && params.selectedPos.length > 0) {
        const posConditions = params.selectedPos.map(pos => `q.POSList LIKE '%${pos}%'`);
        conditions.push(`(${posConditions.join(' OR ')})`);
    }

    if (conditions.length > 0) {
        query += ' AND ' + conditions.join(' AND ');
    }

    return query;
};

const params = { phrase: 'test', selectedPos: [] };
const CategoryId = 1;

const query = generateCategorisePhrase(CategoryId, params);
console.log('Generated query:', query);
