const {exec} = require('child_process');

function getMovieName(srtName) {
    // Extract season and episode information using regular expressions
    const regex = /S(\d+)E(\d+)/i;
    const match = srtName.match(regex);

    if (match) {
        const season = match[1];
        const episode = match[2];

        // Generate the desired filename format
        const unifiedFilename = `S${season}E${episode}.mkv`;
        return unifiedFilename;
    } else {
        // If the filename doesn't match the expected format
        return 'Filename format is not valid.';
    }
}

function getThree(arr) {
    if (arr === undefined) {
        return '';
    }
    const items = arr.split(',');
    return items.slice(0, 3).join();
}


function createEaxmData(movie, soundexList) {
    const phrase = movie.Phrase.replace(/[^a-zA-Z\s,.?]/g, '');

    soundexList = JSON.parse(soundexList[0].wJSON);

    soundexList = soundexList.map(soundex => {
        soundex.SSW = getThree(soundex.SSW);
        soundex.SW = getThree(soundex.SW);
        return soundex;
    })

    // console.log(soundexList);
    let comment = {phrase: phrase, soundexList: soundexList};

    const encodedComment = Buffer.from(JSON.stringify(comment)).toString('base64');
    // return '';
    return encodedComment;
}

function cropMovie(moviePath, movieName, outPath, movie, soundexList, startTime, endTime, fromItem, toItem) {
    return new Promise((resolve, reject) => {
        outMovieName = movie.GUID + '_' + fromItem + '_' + toItem;
        const inputMoviePath = moviePath + movieName;
        const outputMoviePath = outPath + outMovieName + '.mp4';
        const thumbnailPath = outPath + `thumbnail\\${outMovieName}.jpg`;

        // Convert start and end times to desired format
        const startDateTime = new Date(startTime).toISOString().substr(11, 12);
        const endDate = new Date(endTime);
        endDate.setSeconds(endDate.getSeconds() + 1.2);
        const endDateTime = endDate.toISOString().substr(11, 12);

        // FFmpeg command to crop the movie
        const examData = createEaxmData(movie, soundexList);


        const cropCommand = `ffmpeg -noaccurate_seek -i "${inputMoviePath}" -ss ${startDateTime} -to ${endDateTime} -c:v libx264 -preset ultrafast -threads 4 -c:a aac -vf "format=yuv420p" -strict -2 -metadata comment="${examData}" "${outputMoviePath}"`;
        console.log(cropCommand);
        const thumbnailCommand = `ffmpeg -noaccurate_seek -ss ${startDateTime} -i "${inputMoviePath}" -vframes 1 -threads 4 "${thumbnailPath}"`;
        console.log(thumbnailCommand);
        console.log(new Date());

        // Execute the crop command
        exec(cropCommand, (error, stdout, stderr) => {
            if (error) {
                console.error('Error occurred while cropping the movie:', error);
                reject(error);
                return;
            }
            console.log(new Date(), 'Thumbnail cropped successfully!');

            // Execute the thumbnail command
            exec(thumbnailCommand, (thumbnailError, thumbnailStdout, thumbnailStderr) => {
                if (thumbnailError) {
                    console.error('Error occurred while generating the thumbnail:', thumbnailError);
                    reject(thumbnailError);
                    return;
                }
                console.log(new Date(), ' Movie cropped successfully!');
                resolve(outputMoviePath);
            });
        });
    });
}

module.exports = {
    getMovieName,
    cropMovie
};
