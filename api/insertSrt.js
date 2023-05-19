const sql = require('mssql');
const fs = require('fs');

const config = {
    server: 'localhost',
    database: 'filmuageDb',
    driver: 'msnodesqlv8',
    authentication: {
        type: 'default',
        options: {
            trustedConnection: true
        }
    }
};


function parseSrt(srtContent) {
    const subtitleRegex = /\d+\n(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})\n([\s\S]*?)(?=\n\n|\n$|$)/g;
    const subtitles = [];
    let match;

    while ((match = subtitleRegex.exec(srtContent)) !== null) {
        subtitles.push({
            id: subtitles.length + 1,
            startTime: match[1],
            endTime: match[2],
            text: match[3].trim()
        });
    }
    return subtitles;
}

async function insertSubtitleData(filePath) {
    try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const subtitleData = parseSrt(fileContent); // فرض بر این است که تابع parseSrt قبلا تعریف شده است

        const pool = await sql.connect(config);

        for (const data of subtitleData) {
            const request = pool.request();

            request.input('id', sql.Int, data.id);
            request.input('startTime', sql.Time, data.startTime);
            request.input('endTime', sql.Time, data.endTime);
            request.input('text', sql.NVarChar, data.text);

            await request.query('INSERT INTO Subtitles (ID, StartTime, EndTime, Text) VALUES (@id, @startTime, @endTime, @text)');
        }

        console.log('Subtitle data has been inserted successfully!');
    } catch (err) {
        console.error(err);
    }
}

insertSubtitleData("D:\\movies\\subs\\freinds\\Friends S02E01 EN.srt")
