

CREATE DATABASE ticSys DEFAULT CHARACTER SET utf8;
GO;

USE ticSys;

GO;

--LOGIN

CREATE TABLE login(
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(20) UNIQUE KEY ,
  passwd VARCHAR(18),
  status TINYINT,-- 1 激活, 9 禁用
  pin  CHAR(4),
  time INT(10)
);

-- USERINFO



CREATE TABLE userinfo(
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  pin  CHAR(4),
  role TINYINT,-- 9 管理员,1 一般人员, 0 不能操作
  loginId INTEGER NOT NULL UNIQUE KEY ,
  parentId INTEGER,
  status INT(1)--暂时不用

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
