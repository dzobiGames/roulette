DROP TABLE IF EXISTS algoroll;
DROP TABLE IF EXISTS algo;
CREATE TABLE algoroll (
    index VARCHAR(255),
    zero FLOAT,
    ten FLOAT,
    red FLOAT,
    last INT,
    win INT
);
CREATE TABLE algo (
    id SERIAL PRIMARY KEY,
    algovalue int
);

-- Ajouter un index à chaque colonne
CREATE INDEX index_index ON algoroll (index);
CREATE INDEX zero_index ON algoroll (zero);
CREATE INDEX ten_index ON algoroll (ten);
CREATE INDEX red_index ON algoroll (red);
CREATE INDEX last_index ON algoroll (last);
CREATE INDEX win_index ON algoroll (win);
CREATE INDEX algovalue_index ON algo (algovalue);
