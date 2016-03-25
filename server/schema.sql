CREATE DATABASE chat;

USE chat;

CREATE TABLE username (
 id INT NOT NULL AUTO_INCREMENT,
 username VARCHAR(10) NOT NULL,
 PRIMARY KEY (id)
);

CREATE TABLE messages (
  id INT NOT NULL AUTO_INCREMENT,
  createDateTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  message TEXT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE rooms (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(20) NOT NULL,
  PRIMARY KEY (id)
);


CREATE TABLE username_message (
  id INT NOT NULL AUTO_INCREMENT,
  id_username INT,
  id_room INT,
  PRIMARY KEY (id),
  FOREIGN KEY (id_username)
          REFERENCES username(id),
  FOREIGN KEY (id_room)
            REFERENCES rooms(id)
);

CREATE TABLE message_room (
  id INT NOT NULL AUTO_INCREMENT,
  id_message INT,
  id_room INT,
  PRIMARY KEY(id),
  FOREIGN KEY (id_message)
          REFERENCES messages(id),
  FOREIGN KEY (id_room)
          REFERENCES rooms(id)
);

/*  Execute this file from the command line by typing:
 *    mysql -u root < server/schema.sql
 *  to create the database and the tables.*/

