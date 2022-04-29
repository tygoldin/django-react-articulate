import pandas as pd
import numpy as np

df2 = pd.read_csv('../interactions_table2.csv')
# Remove data points with no ratings
df2 = df2[df2['rating']!=0].drop('view_count',axis=1)

# Use users and artworks models exported into CSVs
users = pd.read_csv('users.csv')
artworks = pd.read_csv('artworks.csv')


user_ids = users['id'].tolist()
recommendations = {}

for i, uid in enumerate(user_ids):
    input_user = df2[df2['user_id']==uid].reset_index().drop(['user_id','index'],axis=1)
    user_subset = df2[df2['artwork_id'].isin(input_user['artwork_id'].tolist())]


    # Get top 100 users with most artworks in common
    user_subset_grp = sorted(user_subset.groupby(['user_id']), key=lambda x: len(x[1]), reverse=True)
    user_subset_grp = user_subset_grp[0:100]

    # Calculate pearson correlation coefficient for current user with respect to all other users
    pearsonCorrelationDict = {}

    for name, group in user_subset_grp:
        group = group.sort_values(by='artwork_id')
        input_user = input_user.sort_values(by='artwork_id')

        nRatings = len(group)

        temp_df = input_user[input_user['artwork_id'].isin(group['artwork_id'].tolist())]
        tempRatingList = temp_df['rating'].tolist()
        tempGroupList = group['rating'].tolist()

        corr = np.corrcoef(tempRatingList,tempGroupList)[0][1]
        pearsonCorrelationDict[name] = corr


    # Create df with similarity ranking
    pearsonDF = pd.DataFrame.from_dict(pearsonCorrelationDict, orient='index')
    pearsonDF.columns = ['corr']
    pearsonDF['user_id'] = pearsonDF.index
    pearsonDF.index = range(len(pearsonDF))

    # Merge artworks rated by top 50 similar users
    # Calculated weighted rating score for artworks as [sum over all users (correlation score * rating)]/[sum of correlation scores]
    similar_users_top50 = pearsonDF.sort_values(by='corr', ascending=False)[1:51]
    similar_users_rating = similar_users_top50.merge(df2,on='user_id',how='inner')
    similar_users_rating['weighted_rating'] = similar_users_rating['corr']*similar_users_rating['rating']

    artwork_weighted_ratings = similar_users_rating.groupby('artwork_id').sum()[['corr','weighted_rating']].reset_index()
    artwork_weighted_ratings['recommendation_score'] = artwork_weighted_ratings['weighted_rating']/artwork_weighted_ratings['corr']
    artwork_weighted_ratings = artwork_weighted_ratings.drop(['corr','weighted_rating'],axis=1)

    # Retrieve recommendations ordered by decreasing recommendation score
    recos = artwork_weighted_ratings[~artwork_weighted_ratings['artwork_id'].isin(input_user['artwork_id'])].sort_values(by='recommendation_score', ascending=False)['artwork_id']
    recommendations[uid] = str(recos.tolist()[:100])
    
    print(i)

recommendations_df = pd.DataFrame.from_dict(recommendations, orient='index')
recommendations_df.columns = ['recommendations']
recommendations_df['user_id'] = recommendations_df.index
recommendations_df.index = range(len(recommendations_df))
recommendations_df.to_csv('../recommendations_all_users.csv',index=False)