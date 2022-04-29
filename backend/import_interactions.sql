-- use option "--local-infile=1" when connecting to the mysql database

LOAD DATA LOCAL INFILE '/.../interactions_table.csv'
    INTO TABLE interactions
    FIELDS TERMINATED BY ','
    ENCLOSED BY '"'
    LINES TERMINATED BY '\n'
    IGNORE 1 ROWS
    (view_count, liked, artwork_id, user_id);
