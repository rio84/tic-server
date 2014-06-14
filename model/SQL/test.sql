DELIMITER //
CREATE PROCEDURE p_test(IN in_teamid INTEGER ,IN in_loginid INTEGER )
BEGIN

  SELECT COUNT(*) INTO @tcount FROM team WHERE id= in_teamid AND status=1;
  IF @tcount=0 THEN
    SELECT 'NO_TEAM' AS result;
  ELSE

    SELECT loginid INTO @loginids FROM userteam WHERE teamid= in_teamid;
    select  @loginids ;
  END IF;
END
//
DELIMITER ;


 drop procedure p_test;