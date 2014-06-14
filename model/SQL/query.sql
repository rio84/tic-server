

USE iGroup;

GO;

-- LOGIN
SELECT COUNT(*) FROM login WHERE phone ='' AND passwd ='' AND status=1;
