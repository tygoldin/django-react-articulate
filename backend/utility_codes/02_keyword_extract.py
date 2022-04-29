from sklearn.feature_extraction.text import CountVectorizer
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
import numpy as np
import sys

import warnings
warnings.filterwarnings('ignore')

df = pd.read_csv('../catalog_desc_cleaned.csv')

df = df.replace(np.nan, '', regex=True)

keywords_list = []

for doc in range(len(df)):
    print(doc)
    if df['descriptions'].iloc[doc] == '':
        keywords_list.append([])
        continue

    # Get most common (meaningful) words in decreasing order
    count = CountVectorizer(ngram_range=(1,1), stop_words="english").fit([df['descriptions'].iloc[doc]])
    candidates = count.get_feature_names()

    # Encode features for semantic similarity matching
    model = SentenceTransformer('distilbert-base-nli-mean-tokens')
    doc_embedding = model.encode([df['descriptions'].iloc[doc]])
    candidate_embeddings = model.encode(candidates)

    # Retreive top 5 keywords for each doc
    top_n = 5
    distances = cosine_similarity(doc_embedding, candidate_embeddings)
    keywords = [candidates[index] for index in distances.argsort()[0][-top_n:]]
    keywords_list.append(keywords)

df['keywords'] = keywords_list

df.to_csv('../catalog_keywords.csv',index=False)
