import os
import pymssql
import uuid
from datetime import datetime
from tqdm import tqdm
import nltk
import re

# Database connection details
conn = pymssql.connect(
    server='localhost',
    database='filmuageDb',
    user='flmj',
    password='flmj'
)
cursor = conn.cursor()

# Function to insert phrase data into the database
def insert_phrase_data(srt_id, start_time, end_time, phrase):
    # Generate a new GUID
    guid = str(uuid.uuid4())

    # Convert start_time and end_time to string format expected by the database
    start_time_str = start_time.strftime('%Y-%m-%d %H:%M:%S')
    end_time_str = end_time.strftime('%Y-%m-%d %H:%M:%S')

    # Remove numbers from the end of the phrase
    cleaned_phrase = re.sub(r'\d+$', '', phrase.strip())

    # Split the cleaned phrase into words
    words = nltk.word_tokenize(cleaned_phrase)

    # Get the POS tags for each word
    pos_list = nltk.pos_tag(words)

    # Insert the phrase, GUID, start time, end time, and POS list into the database
    insert_query = 'INSERT INTO SRTPhrases (SRTFileID, GUID, StartTime, EndTime, Phrase, POSList) VALUES (%s, %s, %s, %s, %s, %s)'
    cursor.execute(insert_query, (srt_id, guid, start_time_str, end_time_str, cleaned_phrase, str(pos_list),))

# Folder path containing the SRT files
folder_path = 'D:/movies/subs/friends'

# Get the list of SRT files in the folder
srt_files = [f for f in os.listdir(folder_path) if f.endswith('.srt')]

# Initialize NLTK POS tagger
nltk.download('punkt')
nltk.download('averaged_perceptron_tagger')

# Iterate over the SRT files
for srt_file in tqdm(srt_files, desc='Processing SRT Files'):
    # Insert SRT file name into the database
    insert_srt_query = 'INSERT INTO SRTFiles (FileName) VALUES (%s)'
    cursor.execute(insert_srt_query, (srt_file,))
    conn.commit()

    # Get the generated SRT ID
    select_srt_id_query = 'SELECT SCOPE_IDENTITY()'
    cursor.execute(select_srt_id_query)
    srt_id = cursor.fetchone()[0]

    # Read the content of the SRT file
    srt_path = os.path.join(folder_path, srt_file)
    with open(srt_path, 'r') as file:
        lines = file.readlines()

    # Initialize variables to store the subtitle data
    start_time = None
    end_time = None
    phrase = ''

    # Iterate over the lines in the SRT file
    for line in lines:
        line = line.strip()
        if line:
            # Check if it's a time range line
            if '-->' in line:
                if start_time and end_time and phrase:
                    # Process the previous subtitle and insert data into the database
                    insert_phrase_data(srt_id, start_time, end_time, phrase)

                # Parse the new time range
                start_time, end_time = line.split(' --> ')
                start_time = datetime.strptime(start_time.strip(), '%H:%M:%S,%f')
                end_time = datetime.strptime(end_time.strip(), '%H:%M:%S,%f')

                # Reset the subtitle phrase
                phrase = ''
            else:
                # Accumulate the subtitle phrase
                phrase += line + ' '

    # Process the last subtitle in the SRT file
    if start_time and end_time and phrase:
        insert_phrase_data(srt_id, start_time, end_time, phrase.strip())

# Commit the changes and close the database connection
conn.commit()
conn.close()
