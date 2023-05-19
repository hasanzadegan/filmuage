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

# Mapping of tags to descriptions
tag_description_mapping = {
    'CC': 'Coordinating Conjunction',
    'WDT': 'Wh-Determiner',
    'WP': 'Wh-Pronoun',
    'NN': 'Noun, Singular or Mass',
    'VBG': 'Verb, Gerund or Present Participle',
    'PRP': 'Personal Pronoun',
    'CD': 'Cardinal Number',
    'JJ': 'Adjective',
    'IN': 'Preposition or Subordinating Conjunction',
    'VBP': 'Verb, Non-3rd Person Singular Present',
    'VBD': 'Verb, Past Tense',
    'WRB': 'Wh-Adverb',
    'VBZ': 'Verb, 3rd Person Singular Present',
    'TO': 'to',
    'MD': 'Modal Verb',
    'RB': 'Adverb',
    'RBR': 'Adverb, Comparative',
    'VB': 'Verb, Base Form',
    'JJR': 'Adjective, Comparative',
    'JJS': 'Adjective, Superlative',
    'WP$': 'Possessive Wh-Pronoun',
    'VBN': 'Verb, Past Participle',
    'PRP$': 'Possessive Pronoun',
    'DT': 'Determiner',
    'NNS': 'Noun, Plural'
}

# List to store (tag, description) tuples
pos_data = []

# Initialize NLTK POS tagger
nltk.download('averaged_perceptron_tagger')

# POS tag the words
words = nltk.word_tokenize(' '.join(tag_description_mapping.keys()))
pos_tags = nltk.pos_tag(words)

# Iterate over the POS tags and get their descriptions
for tag, _ in pos_tags:
    description = tag_description_mapping.get(tag, 'Other')
    pos_data.append((tag, description))

# Insert POS tags and descriptions into the POS table
insert_pos_query = 'INSERT INTO POS (Tag, Description) VALUES (%s, %s)'
cursor.executemany(insert_pos_query, pos_data)

# Commit the changes to the database
conn.commit()

# Close the database connection
conn.close()
