DROP DATABASE IF EXISTS secure_storage;
CREATE DATABASE secure_storage;

\connect secure_storage;

CREATE DOMAIN username_t AS varchar(40);

CREATE TABLE users(
    username username_t NOT NULL,
    password varchar(80) NOT NULL,
    CONSTRAINT PK_users_username PRIMARY KEY (username)
);

CREATE TABLE storage(
    id varchar(16) NOT NULL,
    filename varchar(100) NOT NULL,
    owner username_t NOT NULL,
    size bigint NOT NULL,
    data bytea NOT NULL,
    created_at date NOT NULL DEFAULT CURRENT_DATE,
    CONSTRAINT PK_storage_id PRIMARY KEY (id),
    FOREIGN KEY (owner) REFERENCES users (username)
);

CREATE TABLE jwtokens(
    token text NOT NULL,
    created_at date NOT NULL DEFAULT CURRENT_DATE
);