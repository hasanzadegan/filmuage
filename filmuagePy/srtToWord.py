import pymssql
import re
import jellyfish
import os
import nltk
from tqdm import tqdm

# Connect to your SQL Server database
conn = pymssql.connect(
    server='localhost',
    database='filmuageDb',
    user='flmj',
    password='flmj'
)
cursor = conn.cursor()

# Folder path containing the SRT files
folder_path = 'D:/movies/subs/friends'

# Dictionary to store unique lowercase words and their repeat time
word_counts = {}

# Count the total number of files
total_files = sum(1 for filename in os.listdir(folder_path) if filename.endswith('.srt'))

# Initialize NLTK POS tagger
nltk.download('averaged_perceptron_tagger')

# Iterate over all files in the folder with progress bar
with tqdm(total=total_files, desc='Processing SRT Files') as pbar:
    for filename in os.listdir(folder_path):
        if filename.endswith('.srt'):
            srt_file_path = os.path.join(folder_path, filename)

            # Read the contents of the SRT file and extract the words
            with open(srt_file_path, 'r') as file:
                for line in file:
                    # Use regular expression to extract words only (excluding symbols)
                    extracted_words = re.findall(r'\b[A-Za-z]+\b', line)
                    lowercase_words = [word.lower() for word in extracted_words]
                    for word in lowercase_words:
                        if word in word_counts:
                            word_counts[word] += 1
                        else:
                            word_counts[word] = 1

        # Update the progress bar
        pbar.update(1)

# Function to get POS tag for a word
def get_pos_tag(word):
    pos_tags = nltk.pos_tag([word])
    return pos_tags[0][1]

# Iterate over the unique lowercase words, calculate their Soundex values,
# detect the POS tag, and insert them into the database
insert_query = 'INSERT INTO WordSoundex (Word, Soundex, RepeatTime, POS) VALUES (%s, %s, %s, %s)'

with tqdm(total=len(word_counts), desc='Inserting Words into Database') as pbar:
    for word, repeat_time in word_counts.items():
        soundex_value = jellyfish.soundex(word)
        pos = get_pos_tag(word)
        cursor.execute(insert_query, (word, soundex_value, repeat_time, pos))

        # Update the progress bar
        pbar.update(1)

# Commit the changes to the database
conn.commit()

# Close the database connection
conn.close()
