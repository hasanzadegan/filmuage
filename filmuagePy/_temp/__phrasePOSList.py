import pymssql
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

# Initialize NLTK POS tagger
nltk.download('averaged_perceptron_tagger')

# Get the phrases from SRTPhrases where there is no corresponding record in SRTPhrasesPOS
select_query = '''
    SELECT TOP 10 Phrase
    FROM SRTPhrases
    WHERE NOT EXISTS (
        SELECT 1
        FROM SRTPhrasesPOS
        WHERE CAST(SRTPhrases.Phrase AS NVARCHAR(MAX)) = SRTPhrasesPOS.Phrase
    )
'''
cursor.execute(select_query)
phrases = [row[0] for row in cursor.fetchall()]

# Process each phrase to find the corresponding POS list
with tqdm(total=len(phrases), desc='Processing Phrases') as pbar:
    for phrase in phrases:
        # Split the phrase into words
        words = phrase.split()

        # Get the POS list for each word
        pos_list = nltk.pos_tag(words)

        # Insert the phrase and its corresponding POS list into the SRTPhrasesPOS table
        insert_query = 'INSERT INTO SRTPhrasesPOS (Phrase, POSList) VALUES (%s, %s)'
        cursor.execute(insert_query, (phrase, str(pos_list)))

        # Commit the changes after each insertion
        conn.commit()

        # Update the progress bar
        pbar.update(1)

# Close the database connection
conn.close()
