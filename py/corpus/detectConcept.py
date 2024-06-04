from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB

# Step 1: Prepare Data
phrases = [
    "hotel I need to book a hotel room for two nights",
    "hotel Can you help me with hotel reservations?",
    "hotel What are the available hotels for my travel dates?",
    "hotel I want to cancel my hotel reservation",
    "hotel How much does it cost to stay in a hotel?",
    # Add more phrases related to hotel reservations
    "other How old are you",
    "other What time is it?",
    "other Do you have any pets?",
    "other Can you recommend a good restaurant?",
    # Add more unrelated phrases
]

# Step 2: Define Categories
categories = ["hotel"] * 5 + ["other"] * 4

# Step 3: Feature Extraction
vectorizer = CountVectorizer()
X = vectorizer.fit_transform(phrases)

# Step 4: Train a Classifier
classifier = MultinomialNB()
classifier.fit(X, categories)

# New phrases to categorize
new_phrases = [
    "I'm looking for a budget hotel",
    "Do you have any vegetarian restaurants nearby?",
    "What's the best time to visit the city?",
    # Add more new phrases to categorize
]

# Transform new phrases using the same vectorizer
X_new = vectorizer.transform(new_phrases)

# Step 5: Categorize New Phrases
predicted_categories = classifier.predict(X_new)

# Print new phrases and their predicted categories
for phrase, category in zip(new_phrases, predicted_categories):
    print(f"{category}: {phrase}")
