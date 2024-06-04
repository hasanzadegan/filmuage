import pymssql
import jellyfish
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

# Function to get description from POS tag
def get_description_from_tag(tag):
    if tag.startswith('CC'):
        return 'Coordinating Conjunction'
    elif tag.startswith('WDT'):
        return 'Wh-Determiner'
    elif tag.startswith('WP'):
        return 'Wh-Pronoun'
    elif tag.startswith('NN'):
        return 'Noun, Singular or Mass'
    elif tag.startswith('VBG'):
        return 'Verb, Gerund or Present Participle'
    elif tag.startswith('PRP'):
        return 'Personal Pronoun'
    elif tag.startswith('CD'):
        return 'Cardinal Number'
    elif tag.startswith('JJ'):
        return 'Adjective'
    elif tag.startswith('IN'):
        return 'Preposition or Subordinating Conjunction'
    elif tag.startswith('VBP'):
        return 'Verb, Non-3rd Person Singular Present'
    elif tag.startswith('VBD'):
        return 'Verb, Past Tense'
    elif tag.startswith('WRB'):
        return 'Wh-Adverb'
    elif tag.startswith('VBZ'):
        return 'Verb, 3rd Person Singular Present'
    elif tag.startswith('TO'):
        return 'to'
    elif tag.startswith('MD'):
        return 'Modal Verb'
    elif tag.startswith('RB'):
        return 'Adverb'
    elif tag.startswith('RBR'):
        return 'Adverb, Comparative'
    elif tag.startswith('VB'):
        return 'Verb, Base Form'
    elif tag.startswith('JJR'):
        return 'Adjective, Comparative'
    elif tag.startswith('JJS'):
        return 'Adjective, Superlative'
    elif tag.startswith('WP$'):
        return 'Possessive Wh-Pronoun'
    elif tag.startswith('VBN'):
        return 'Verb, Past Participle'
    elif tag.startswith('PRP$'):
        return 'Possessive Pronoun'
    elif tag.startswith('DT'):
        return 'Determiner'
    elif tag.startswith('NNS'):
        return 'Noun, Plural'
    else:
        return 'Other'

# Dictionary to store unique lowercase words and their repeat time
word_counts = {}

# Get all words from the WordSoundex table
select_query = 'SELECT Word FROM WordSoundex'
cursor.execute(select_query)
words = [row[0] for row in cursor.fetchall()]

# Count the total number of words
total_words = len(words)

# Initialize NLTK POS tagger
nltk.download('averaged_perceptron_tagger')

# Iterate over the words with progress bar
with tqdm(total=total_words, desc='Processing Words') as pbar:
    for word in words:
        # Get the repeat time for the word from the WordSoundex table
        repeat_time_query = 'SELECT RepeatTime FROM WordSoundex WHERE Word = %s'
        cursor.execute(repeat_time_query, (word,))
        repeat_time = cursor.fetchone()[0]

        # POS tag the word
        pos_tags = nltk.pos_tag([word])
        pos = pos_tags[0][1]

        # Get description from POS tag
        description = get_description_from_tag(pos)

        # Update the word counts dictionary
        if word in word_counts:
            word_counts[word]['repeat_time'] += repeat_time
        else:
            word_counts[word] = {
                'repeat_time': repeat_time,
                'pos': pos,
                'description': description
            }

        # Update the progress bar
        pbar.update(1)

# Insert POS tags and descriptions into the POS table
insert_pos_query = 'INSERT INTO POS (Tag, Description) VALUES (%s, %s)'

# Get unique POS tags and descriptions
pos_tags = set([(data['pos'], data['description']) for data in word_counts.values()])

# Insert unique POS tags and descriptions into the POS table
for pos, description in pos_tags:
    cursor.execute(insert_pos_query, (pos, description))

# Commit the changes to the database
conn.commit()

# Get the POS IDs from the POS table
pos_ids_query = 'SELECT ID, Tag FROM POS'
cursor.execute(pos_ids_query)
pos_ids = {row[1]: row[0] for row in cursor.fetchall()}

# Iterate over the unique words, calculate their Soundex values, and insert them into the WordSoundexPOS table
insert_query = 'INSERT INTO WordSoundexPOS (Word, Soundex, RepeatTime, POS_ID) VALUES (%s, %s, %s, %s)'

for word, data in word_counts.items():
    repeat_time = data['repeat_time']
    pos = data['pos']
    soundex_value = jellyfish.soundex(word)
    pos_id = pos_ids[pos]
    cursor.execute(insert_query, (word, soundex_value, repeat_time, pos_id))

# Commit the changes to the database
conn.commit()

# Close the database connection
conn.close()
