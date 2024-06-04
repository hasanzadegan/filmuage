import pymssql
import nltk
from fuzzywuzzy import fuzz
from tqdm import tqdm

# Connect to your SQL Server database
conn = pymssql.connect(
    server='localhost',
    database='filmuageDb',
    user='flmj',
    password='flmj'
)
cursor = conn.cursor()

def update_similar_words():
    # Retrieve the first 10 words from the WordSoundex table
    select_query = """
    SELECT [ID], [Word]
    FROM [dbo].[WordSoundex]
    """
    cursor.execute(select_query)
    rows = cursor.fetchall()

    for row in tqdm(rows, desc='Processing', unit='word'):
        word_id = row[0]
        word = row[1]

        similar_words = find_similar_words(word)
        similar_words_str = ', '.join(similar_words)

        # Update the SimilarWords field in the WordSoundex table
        update_query = f"""
        UPDATE [dbo].[WordSoundex]
        SET [SimilarWords] = '{similar_words_str}'
        WHERE [ID] = {word_id}
        """
        cursor.execute(update_query)

    # Commit the changes to the database
    conn.commit()

def find_similar_words(target_word):
    word_list = nltk.corpus.words.words()
    similar_words = []
    for dict_word in word_list:
        similarity = fuzz.ratio(target_word, dict_word)
        if similarity >= 80:  # Adjust the threshold as needed
            similar_words.append(dict_word)

    return similar_words

# Call the function to update the SimilarWords field
update_similar_words()

# Close the database connection
conn.close()
