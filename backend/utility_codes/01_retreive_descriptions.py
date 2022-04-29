from bs4 import BeautifulSoup
import requests
import pandas as pd

df = pd.read_csv('../catalog.csv')

descriptions = []
i = 1

for art_url in df['URL']:
    print(i)
    i = i+1
    page = requests.get(art_url)
    htmldata = BeautifulSoup(page.content, 'html.parser')
    descriptions.append(htmldata.find_all('p')[0].get_text())

df['descriptions'] = descriptions

# Remove all escape characters
escapes = '\n\r'
for c in escapes:
    df['descriptions'] = df['descriptions'].str.replace(c,'')

df.to_csv('../catalog_desc_cleaned.csv',index=False)