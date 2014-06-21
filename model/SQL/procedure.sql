USE ticSys;
go;


/*

 name VARCHAR(20) UNIQUE KEY ,
  passwd VARCHAR(18),
  status TINYINT,
  time INT(10)


  pin  CHAR(4),
  role TINYINT,
  loginId INTEGER NOT NULL UNIQUE KEY ,
  parentId INTEGER,
  status INT(1)
 */
DELIMITER //
CREATE PROCEDURE p_register(IN in_name VARCHAR(20) ,IN in_psw VARCHAR(18),IN in_pin CHAR(4),IN in_pid INTEGER)
BEGIN
  SELECT COUNT(*) into @count FROM login WHERE name=in_name;
  IF @count=0 THEN
    INSERT INTO login(name,passwd,status,pin,time) VALUES (in_name,in_psw,0,in_pin,UNIX_TIMESTAMP());
    SELECT LAST_INSERT_ID() INTO @loginid;
    INSERT INTO userinfo(loginId,parentId,pin,role,status) VALUES (@loginid,in_pid,in_pin,0,0);
    SELECT @loginid AS result;
  ELSE
    SELECT 'NAME_EXSIST' AS result;
  END IF;

END
//
DELIMITER ;



/*

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
 */

DELIMITER //
CREATE PROCEDURE p_create_ticket(IN in_loginid INTEGER,
  IN in_pin INT(4),
  IN in_price DECIMAL,
  IN in_comment VARCHAR(140),
  IN in_headCount INT(2),
  IN in_tradeNo VARCHAR(32),
  IN in_buyer VARCHAR(20),
  IN in_checkCode CHAR(8),
  IN in_expire INT(10))
BEGIN
  INSERT INTO ticket(pin,loginId,price,status,comment,headCount,tradeNo,buyer,checkCode,createTime,expire)
  VALUES (in_pin,in_loginid,in_price,1,in_comment,in_headCount,in_tradeNo,in_buyer,in_checkCode,UNIX_TIMESTAMP(),in_expire);
  SELECT LAST_INSERT_ID() AS result;


END
//
DELIMITER ;

