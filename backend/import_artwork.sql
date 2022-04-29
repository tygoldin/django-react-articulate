-- use option "--local-infile=1" when connecting to the mysql database

CREATE TABLE test (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    author text,
    born_died text,
    title text,
    date text,
    technique text,
    location text,
    url text,
    form text,
    type text,
    school text,
    timeframe text,
    lat double, 
    lng double,
    descriptions text, 
    keywords text, 
    color_0 text,
    color_1 text, 
    color_2 text, 
    color_3 text, 
    color_4 text, 
    color_5 text, 
    cluster_id INT
);

LOAD DATA LOCAL INFILE '/.../catalog_coord_keyword_color.csv'
    INTO TABLE test
    CHARACTER SET latin1
    FIELDS TERMINATED BY ','
    ENCLOSED BY '"'
    LINES TERMINATED BY '\n'
    IGNORE 1 ROWS
    (author, born_died, title, date, technique, location, url, form, 
     type, school, timeframe, lat, lng, descriptions, keywords, color_0,
     color_1, color_2, color_3, color_4, color_5, cluster_id);
