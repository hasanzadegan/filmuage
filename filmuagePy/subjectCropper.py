import os
import sys

from modules.connection import conn
from modules.cropper import crop_mkv

from queries.srtPhrase import get_phrase_by_subject_query

# Check if the subject_word argument is provided
if len(sys.argv) < 2:
    print("Usage: python subjectCropper.py <subject_word>")
    sys.exit(1)

# Define the subject word
subject_word = sys.argv[1]

# SRT and MKV directories
srt_directory = r'D:\movies\subs\friends'
mkv_directory = r'D:\movies\friends'
output_directory = r'D:\movies\output'  # Output directory for all cropped movies

# Create the output subdirectory for the subject
subject_output_directory = os.path.join(output_directory, subject_word)
os.makedirs(subject_output_directory, exist_ok=True)

# Create the 'greetings.txt' file inside the subject folder
text_file_name = os.path.join(subject_output_directory, f'{subject_word}.txt')

query = get_phrase_by_subject_query()

# Open the text file in append mode, so that we can add content later if needed
with open(text_file_name, 'a') as text_file:
    # Retrieve the phrases from the PhraseList table for the subject word
    with conn.cursor() as cursor:
        cursor.execute(query, (subject_word,))
        print(f'Subject: {subject_word}')

        results = cursor.fetchall()

        if not results:
            print(f'No records found for the subject: {subject_word}')
        else:
            for result in results:
                guid = str(result[3])  # Convert GUID to string
                phrase = result[4]
                text_file.write(f"fileName: {guid}\nPhrase: {phrase}\n\n---------------------\n")

            print(f'Text file updated for subject: {subject_word}')

    print('All text files updated.')

# Loop 2: Crop the movies based on the subject
# Retrieve the SRT file path, start time, end time, and GUID for phrases containing the subject
with conn.cursor() as cursor:
    cursor.execute(query, (subject_word,))
    results = cursor.fetchall()

if not results:
    print(f'No records found for the subject: {subject_word}')
else:
    # Iterate over the query results
    for result in results:
        srt_file_name = result[0]
        start_time = result[1]
        end_time = result[2]
        guid = result[3]

        # Call the external function to crop the MKV file
        crop_mkv(mkv_directory, srt_file_name, subject_output_directory, guid, start_time, end_time, srt_directory)

        print(f'MKV file cropped successfully for GUID: {guid}')

# Close the database connection
conn.close()
