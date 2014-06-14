

CREATE DATABASE ticSys DEFAULT CHARACTER SET utf8;
GO;

USE ticSys;

GO;

--LOGIN

CREATE TABLE login(
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(20) UNIQUE KEY ,
  passwd VARCHAR(18),
  status TINYINT,
  pin  CHAR(4),
  time INT(10)
);

-- USERINFO



CREATE TABLE userinfo(
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  loginId INTEGER NOT NULL UNIQUE KEY ,
  parentId INTEGER,
  status INT(1)

);


CREATE TABLE ticket(
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  pin INT(4),
  loginId INTEGER NOT NULL,
  price DECIMAL ,
  status INT(1),
  comment VARCHAR(140),

  headCount INT(2),
  tradeNo VARCHAR(32),
  buyer VARCHAR(20),
  checkCode CHAR(8),

  createTime INT(10),
  expire INT(10),
  validateTime INT(10)

);
