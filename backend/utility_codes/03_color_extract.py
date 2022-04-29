from PIL import Image
import requests
from io import BytesIO
import colorgram
import sys
import pandas as pd
import numpy as np

import warnings
warnings.filterwarnings('ignore')

df = pd.read_csv('../catalog_keywords.csv')

colors_list = []
i = 0

for art_url in df['URL']:
  img_url = 'https://www.wga.hu/detail'+art_url.split('/html')[-1][:-4]+'jpg'
  
  if img_url[-8:-4] == "html":
    img_url = img_url[:-9]+img_url[-4:]+'.jpg'
  
  img = Image.open(BytesIO(requests.get(img_url).content))
  # Extract 6 colors from an image.
  colors = colorgram.extract(img, 6)
  colors_list.append(colors)

  print(i)
  i = i+1

for c in range(6):
  df['color_'+str(c)] = [[row[c].hsl.h,row[c].hsl.s,row[c].hsl.l,row[c].proportion] if c<len(row) else [0,0,0,0] for row in colors_list]

df.to_csv('../catalog_colors.csv',index=False)