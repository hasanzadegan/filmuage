const express = require('express');
const app = express();
const port = 3000;
const subjectsRouter = require('./routes/subjects');
const srtPhrasesRouter = require('./routes/srtPhrases');
const posRoute = require('./routes/pos');
const subjectPhrases = require('./routes/subjectPhrases')


// Routes
app.use(express.json());
app.use('/api/subjects', subjectsRouter);
app.use('/api/srtPhrases', srtPhrasesRouter);
app.use('/api/pos', posRoute);
app.use('/api/subjectPhrases', subjectPhrases);

// Start the server
app.listen(port, () =>
    console.log(`Server is listening at http://localhost:${port}`)
);
