import pandas as pd
import numpy as np
from statistics import stdev
from scipy.sparse import issparse
from sklearn.cluster import AgglomerativeClustering
from sklearn.neighbors import KNeighborsClassifier


####################################
# Pre-Processing data for clustering
####################################

df = pd.read_csv('../catalog_colors.csv')

# Convert keywords list string to set
df['keywords_list'] = df.keywords.apply(lambda x: x[1:-1].split(', '))
df['keywords_list'] = df.keywords_list.apply(lambda x: [i.strip("'") for i in x if i.strip("'")])
df['keywords_set'] = df.keywords_list.apply(lambda x: set(x))

# Convert colors list string to set
for i in range(6):
    df['color_'+str(i)] = df['color_'+str(i)].apply(lambda x: x[1:-1].split(', ')).apply(lambda x: [float(k) for k in x])


# Calculate statistical measures of colors
def h_mean(df):
    return (df['color_0'][0]+df['color_1'][0]+df['color_2'][0]+df['color_3'][0]+df['color_4'][0]+df['color_5'][0])/6

def s_mean(df):
    return (df['color_0'][1]+df['color_1'][1]+df['color_2'][1]+df['color_3'][1]+df['color_4'][1]+df['color_5'][1])/6

def v_mean(df):
    return (df['color_0'][2]+df['color_1'][2]+df['color_2'][2]+df['color_3'][2]+df['color_4'][2]+df['color_5'][2])/6

def h_sd(df):
    return stdev([df['color_0'][0],df['color_1'][0],df['color_2'][0],df['color_3'][0],df['color_4'][0],df['color_5'][0]])

def s_sd(df):
    return stdev([df['color_0'][1],df['color_1'][1],df['color_2'][1],df['color_3'][1],df['color_4'][1],df['color_5'][1]])

def v_sd(df):
    return stdev([df['color_0'][2],df['color_1'][2],df['color_2'][2],df['color_3'][2],df['color_4'][2],df['color_5'][2]])

df['h_mean'] = df.apply(h_mean,axis=1)
df['s_mean'] = df.apply(s_mean,axis=1)
df['v_mean'] = df.apply(v_mean,axis=1)
df['h_sd'] = df.apply(h_sd,axis=1)
df['s_sd'] = df.apply(s_sd,axis=1)
df['v_sd'] = df.apply(v_sd,axis=1)

# Clean technique field
df['TECHNIQUE'] = df['TECHNIQUE'].apply(lambda x: x.split(',')[0])


df.fillna("",inplace=True)
df = df.drop(['BORN-DIED','DATE','URL','descriptions','keywords','keywords_list','color_0','color_1','color_2','color_3','color_4','color_5'],axis=1)




####################################
# Custom Gower Distance Function
####################################

# Code from python package gower modified to handle set comparision
# Used to compare similarity of keywords extracted
# Gower distance is used to calculate distances between data points for clustering 

def custom_gower_matrix(data_x, data_y=None, weight=None, cat_features=None):  
    
    # function checks
    X = data_x
    if data_y is None: Y = data_x 
    else: Y = data_y 
    if not isinstance(X, np.ndarray): 
        if not np.array_equal(X.columns, Y.columns): raise TypeError("X and Y must have same columns!")   
    else: 
         if not X.shape[1] == Y.shape[1]: raise TypeError("X and Y must have same y-dim!")  
                
    if issparse(X) or issparse(Y): raise TypeError("Sparse matrices are not supported!")        
            
    x_n_rows, x_n_cols = X.shape
    y_n_rows, y_n_cols = Y.shape 
    
    if cat_features is None:
        if not isinstance(X, np.ndarray): 
            is_number = np.vectorize(lambda x: not np.issubdtype(x, np.number))
            cat_features = is_number(X.dtypes)    
        else:
            cat_features = np.zeros(x_n_cols, dtype=bool)
            for col in range(x_n_cols):
                if not np.issubdtype(type(X[0, col]), np.number):
                    cat_features[col]=True
    else:          
        cat_features = np.array(cat_features)
    
#     print(cat_features)
    
    # Convert Dataframe to Numpy NDArray
    if not isinstance(X, np.ndarray): X = np.asarray(X)
    if not isinstance(Y, np.ndarray): Y = np.asarray(Y)
    
    Z = np.concatenate((X,Y))
    
    x_index = range(0,x_n_rows)
    y_index = range(x_n_rows,x_n_rows+y_n_rows)
    
    # Get data with numeric features
    Z_num = Z[:,np.logical_not(cat_features)]
    
    
    num_cols = Z_num.shape[1]
    num_ranges = np.zeros(num_cols)
    num_max = np.zeros(num_cols)
    
    for col in range(num_cols):
        col_array = Z_num[:, col].astype(np.float32) 
        max = np.nanmax(col_array)
        min = np.nanmin(col_array)
     
        if np.isnan(max):
            max = 0.0
        if np.isnan(min):
            min = 0.0
        num_max[col] = max
        num_ranges[col] = (1 - min / max) if (max != 0) else 0.0

    # This is to normalize the numeric values between 0 and 1.
    Z_num = np.divide(Z_num ,num_max,out=np.zeros_like(Z_num), where=num_max!=0)
    
    # Get data with numeric features
    Z_cat = Z[:,cat_features]
    
    if weight is None:
        weight = np.ones(Z.shape[1])
        
    #print(weight)    
    
    weight_cat=weight[cat_features]
    weight_num=weight[np.logical_not(cat_features)]   
        
    out = np.zeros((x_n_rows, y_n_rows), dtype=np.float32)
        
    weight_sum = weight.sum()
    
    X_cat = Z_cat[x_index,]
    X_num = Z_num[x_index,]
    Y_cat = Z_cat[y_index,]
    Y_num = Z_num[y_index,]
    
#     print(X_cat,X_num,Y_cat,Y_num)
    
    for i in range(x_n_rows):          
        j_start= i        
        if x_n_rows != y_n_rows:
            j_start = 0
        # call the main function
        res = custom_gower_get(X_cat[i,:], 
                          X_num[i,:],
                          Y_cat[j_start:y_n_rows,:],
                          Y_num[j_start:y_n_rows,:],
                          weight_cat,
                          weight_num,
                          weight_sum,
                          cat_features,
                          num_ranges,
                          num_max) 
        #print(res)
        out[i,j_start:]=res
        if x_n_rows == y_n_rows: out[i:,j_start]=res
        
    return out

def cat_compare(a1,a2):
    final_array = []
    for j in range(len(a2)):
        compare_list = []
        for i in range(len(a1)):
            if isinstance(a1[i],str):
                if a1[i] == a2[j][i]:
                    compare_list.append(0)
                else:
                    compare_list.append(1)
            elif isinstance(a1[i],set):
                compare_list.append(5-len(a1[i].intersection(a2[j][i])))
        final_array.append(np.array(compare_list))
    return np.array(final_array)

def custom_gower_get(xi_cat,xi_num,xj_cat,xj_num,feature_weight_cat,
              feature_weight_num,feature_weight_sum,categorical_features,
              ranges_of_numeric,max_of_numeric ):
    
    # categorical columns
    sij_cat = cat_compare(xi_cat,xj_cat)
    sum_cat = np.multiply(feature_weight_cat,sij_cat).sum(axis=1) 
    
    # numerical columns
    abs_delta=np.absolute(xi_num-xj_num)
    sij_num=np.divide(abs_delta, ranges_of_numeric, out=np.zeros_like(abs_delta), where=ranges_of_numeric!=0)

    sum_num = np.multiply(feature_weight_num,sij_num).sum(axis=1)
    sums= np.add(sum_cat,sum_num)
    
    sum_sij = np.divide(sums,feature_weight_sum)
    
    return sum_sij



####################################
# Clustering Recommendation System
####################################

# Calculate Distance Matrix
distance_matrix = custom_gower_matrix(df)
print(distance_matrix)

np.fill_diagonal(distance_matrix,0)

# Use agglomerative clustering to generate clusters
agg = AgglomerativeClustering(n_clusters=1000, affinity='precomputed',linkage='average').fit_predict(distance_matrix)
df['cluster'] = agg


# Certain clusters have very low number of data points due to the nature of agglomerative clustering
# We identify data points belonging to clusters with less than 15 data points
# Then we use a K-Nearest Neighbors classifier to classify them into existing larger clusters


# Retrieve larger clusters to be used as labels
cluster_size = df.groupby('cluster').size().to_frame('cluster_size').reset_index()
df_cluster_size = df.join(cluster_size,on='cluster',how ='left', lsuffix='_left', rsuffix='_right')

s = np.array(df_cluster_size['cluster_size'] > 15)

# Build KNN classifer
knn = KNeighborsClassifier(n_neighbors=5, metric='precomputed')
knn.fit(distance_matrix[s,:][:,s],np.array(df_cluster_size['cluster_left'][s]))

# Predict labels for remaining data points
Y_pred = knn.predict(distance_matrix2[~s,:][:,s])

df2 = df
new_clusters = pd.DataFrame({'cluster':Y_pred})
new_clusters = new_clusters.set_index(pd.Index([i for i, x in enumerate(s) if ~x]))
df2.update(new_clusters)

df2.to_csv('../catalog_clusters.csv',index=False)