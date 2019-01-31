USE [master]
GO

IF EXISTS(
	SELECT [name] 
	FROM master.sys.server_principals
    WHERE name = 'starterpack'
	)
BEGIN
	print 'user already exists...deleting'	
	DROP LOGIN [starterpack]
END

GO

CREATE LOGIN [starterpack] 
WITH 
	PASSWORD=N'Your_password123!', 
	DEFAULT_DATABASE=[master], 
	DEFAULT_LANGUAGE=[us_english], 
	CHECK_EXPIRATION=OFF, 
	CHECK_POLICY=OFF
GO

ALTER LOGIN [starterpack] ENABLE
GO

ALTER SERVER ROLE [dbcreator] ADD MEMBER [starterpack]
GO