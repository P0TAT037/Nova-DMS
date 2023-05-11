CREATE DATABASE NOVA
GO
USE [NOVA]
GO
/****** Object:  Schema [NOV]    Script Date: 5/11/2023 8:33:01 AM ******/
CREATE SCHEMA [NOV]
GO
/****** Object:  UserDefinedFunction [dbo].[getName]    Script Date: 5/11/2023 8:33:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date, ,>
-- Description:	<Description, ,>
-- =============================================
CREATE FUNCTION [dbo].[getName] 
(
	@UserId int
)
RETURNS varchar(50)
as

begin

	declare @name varchar(50)
	select @name = USERS.NAME FROM NOV.USERS WHERE ID = @UserId
	RETURN(@name);
end
GO
/****** Object:  UserDefinedFunction [NOV].[GetNodes]    Script Date: 5/11/2023 8:33:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


-- SELECT * from NOV.GetUser('admin', 'admin')
--Select Id, name , dir.ToString() from Nov.FILES
--SELECT * from NOV.GetNodes(0, 0, cast('/6/' as hierarchyid))
--go

--use NOVA
--go

CREATE FUNCTION [NOV].[GetNodes]
(
	@UsrId int,
	@DirId hierarchyid
)
RETURNS @returntable TABLE
(
    Id int,
    Name nvarchar(50),
    HID varchar(5000)
)
AS
BEGIN
	DECLARE @hids TABLE (id int, hid hierarchyid);
	DECLARE @names TABLE (id int, name nvarchar(50));

	Insert into @hids
	select Files.ID, FILES.DIR
	From FILES
	Where FILES.ID = @UsrId 
	And FILES.DIR.IsDescendantOf(@DirID) = 1
	And FILES.DIR.GetLevel() = @DirId.GetLevel()+1
	
	insert @names
	select Distinct Files.id, FILES.NAME
	From FIles

	insert @returntable
	select distinct [@hids].id, [@names].name, [@hids].hid.ToString()
	from @hids join @names on ([@hids].id = [@names].id)
	return
END
GO
/****** Object:  Table [NOV].[USERS]    Script Date: 5/11/2023 8:33:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [NOV].[USERS](
	[ID] [int] IDENTITY(0,1) NOT NULL,
	[NAME] [nvarchar](50) NOT NULL,
	[USERNAME] [varchar](50) NOT NULL,
	[PASSWORD] [varchar](255) NOT NULL,
	[LEVEL] [int] NOT NULL,
 CONSTRAINT [PK__USERS__3214EC27FED8DB59] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  UserDefinedFunction [NOV].[GetUser]    Script Date: 5/11/2023 8:33:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE FUNCTION [NOV].[GetUser]
(
	@username varchar(50)
)
RETURNS TABLE
RETURN(
	SELECT USERS.ID, USERS.NAME, USERS.LEVEL, USERS.PASSWORD FROM NOV.USERS WHERE USERNAME = @username
);

GO
/****** Object:  Table [NOV].[FILES]    Script Date: 5/11/2023 8:33:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [NOV].[FILES](
	[ID] [int] IDENTITY(0,1) NOT NULL,
	[NAME] [nvarchar](50) NOT NULL,
	[DIR] [hierarchyid] NOT NULL,
	[IsFolder] [bit] NOT NULL,
 CONSTRAINT [PK__FILES__3214EC27C06D9000] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [NOV].[FILES_OWNERS]    Script Date: 5/11/2023 8:33:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [NOV].[FILES_OWNERS](
	[FileID] [int] NOT NULL,
	[UserID] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[FileID] ASC,
	[UserID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [NOV].[FILES_USERS]    Script Date: 5/11/2023 8:33:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [NOV].[FILES_USERS](
	[FILE_ID] [int] NOT NULL,
	[USER_ID] [int] NOT NULL,
	[PERM] [bit] NOT NULL,
 CONSTRAINT [PK__FILES_US__A6FBA2C55A880350] PRIMARY KEY CLUSTERED 
(
	[FILE_ID] ASC,
	[USER_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [NOV].[ROLES]    Script Date: 5/11/2023 8:33:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [NOV].[ROLES](
	[ID] [int] IDENTITY(0,1) NOT NULL,
	[NAME] [varchar](50) NOT NULL,
 CONSTRAINT [PK__ROLES__3214EC27D27E53BB] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [NOV].[USERS_ROLES]    Script Date: 5/11/2023 8:33:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [NOV].[USERS_ROLES](
	[USER_ID] [int] NOT NULL,
	[ROLE_ID] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[USER_ID] ASC,
	[ROLE_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [NOV].[FILES] ON 
GO
INSERT [NOV].[FILES] ([ID], [NAME], [DIR], [IsFolder]) VALUES (4, N'root', N'/4/', 1)
GO
INSERT [NOV].[FILES] ([ID], [NAME], [DIR], [IsFolder]) VALUES (5, N'root', N'/4/5/', 0)
GO
INSERT [NOV].[FILES] ([ID], [NAME], [DIR], [IsFolder]) VALUES (6, N'folder2', N'/6/', 1)
GO
SET IDENTITY_INSERT [NOV].[FILES] OFF
GO
INSERT [NOV].[FILES_OWNERS] ([FileID], [UserID]) VALUES (4, 0)
GO
INSERT [NOV].[FILES_USERS] ([FILE_ID], [USER_ID], [PERM]) VALUES (5, 0, 1)
GO
INSERT [NOV].[FILES_USERS] ([FILE_ID], [USER_ID], [PERM]) VALUES (6, 0, 1)
GO
INSERT [NOV].[FILES_USERS] ([FILE_ID], [USER_ID], [PERM]) VALUES (6, 1, 1)
GO
SET IDENTITY_INSERT [NOV].[USERS] ON 
GO
INSERT [NOV].[USERS] ([ID], [NAME], [USERNAME], [PASSWORD], [LEVEL]) VALUES (0, N'Admin', N'admin', N'$2a$11$TfLYqA27sfQN8of93AH9zee3o8T00IRDLzibOxrqX0P/lbMpj9Tve', 2)
GO
INSERT [NOV].[USERS] ([ID], [NAME], [USERNAME], [PASSWORD], [LEVEL]) VALUES (1, N'User', N'user', N'$2a$11$uAWh.ay0wYYbt8c0ZHUs9OQ1.RMenEulrMWFu11CJfh8jGRw4W2IS', 0)
GO
SET IDENTITY_INSERT [NOV].[USERS] OFF
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ_NAME]    Script Date: 5/11/2023 8:33:01 AM ******/
ALTER TABLE [NOV].[ROLES] ADD  CONSTRAINT [UQ_NAME] UNIQUE NONCLUSTERED 
(
	[NAME] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__USERS__B15BE12E7C3A3DE7]    Script Date: 5/11/2023 8:33:01 AM ******/
ALTER TABLE [NOV].[USERS] ADD  CONSTRAINT [UQ__USERS__B15BE12E7C3A3DE7] UNIQUE NONCLUSTERED 
(
	[USERNAME] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
ALTER TABLE [NOV].[FILES] ADD  CONSTRAINT [DF_FILES_IsFolder]  DEFAULT ((0)) FOR [IsFolder]
GO
ALTER TABLE [NOV].[USERS] ADD  CONSTRAINT [DF__USERS__LEVEL__4AB81AF0]  DEFAULT ((0)) FOR [LEVEL]
GO
ALTER TABLE [NOV].[FILES_OWNERS]  WITH CHECK ADD FOREIGN KEY([FileID])
REFERENCES [NOV].[FILES] ([ID])
GO
ALTER TABLE [NOV].[FILES_OWNERS]  WITH CHECK ADD FOREIGN KEY([UserID])
REFERENCES [NOV].[USERS] ([ID])
GO
ALTER TABLE [NOV].[FILES_USERS]  WITH CHECK ADD  CONSTRAINT [FK__FILES_USE__FILE___60A75C0F] FOREIGN KEY([FILE_ID])
REFERENCES [NOV].[FILES] ([ID])
GO
ALTER TABLE [NOV].[FILES_USERS] CHECK CONSTRAINT [FK__FILES_USE__FILE___60A75C0F]
GO
ALTER TABLE [NOV].[FILES_USERS]  WITH CHECK ADD  CONSTRAINT [FK__FILES_USE__USER___619B8048] FOREIGN KEY([USER_ID])
REFERENCES [NOV].[USERS] ([ID])
GO
ALTER TABLE [NOV].[FILES_USERS] CHECK CONSTRAINT [FK__FILES_USE__USER___619B8048]
GO
ALTER TABLE [NOV].[USERS_ROLES]  WITH CHECK ADD  CONSTRAINT [FK__USERS_ROL__ROLE___5812160E] FOREIGN KEY([ROLE_ID])
REFERENCES [NOV].[ROLES] ([ID])
GO
ALTER TABLE [NOV].[USERS_ROLES] CHECK CONSTRAINT [FK__USERS_ROL__ROLE___5812160E]
GO
ALTER TABLE [NOV].[USERS_ROLES]  WITH CHECK ADD  CONSTRAINT [FK__USERS_ROL__USER___571DF1D5] FOREIGN KEY([USER_ID])
REFERENCES [NOV].[USERS] ([ID])
GO
ALTER TABLE [NOV].[USERS_ROLES] CHECK CONSTRAINT [FK__USERS_ROL__USER___571DF1D5]
GO
/****** Object:  StoredProcedure [dbo].[AddNode]    Script Date: 5/11/2023 8:33:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[AddNode]
	-- Add the parameters for the stored procedure here
	@Name nvarchar(50),
	@Dir nvarchar(MAX),
	@isFolder bit
AS
BEGIN
	declare @return int
	declare @id int
	declare @newDir nvarchar(MAX)
	begin tran t;
		INSERT INTO NOV.FILES VALUES (@Name, cast('/' as hierarchyid), @isFolder)
		select @id = SCOPE_IDENTITY()
		select @newDir = CONCAT(@Dir,CAST( @id AS varchar),'/')
		Update Nov.Files
		set DIR = cast(@newDir as hierarchyid)
		where ID = @id
		select @return = @id
	commit tran t;
	return @return

END
GO
/****** Object:  StoredProcedure [dbo].[ChangePerm]    Script Date: 5/11/2023 8:33:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[ChangePerm]
	-- Add the parameters for the stored procedure here
	@UsrId int,
	@FileId int,
	@Perm int
AS
BEGIN
	if exists(select * from NOV.FILES_USERS where USER_ID = @usrId AND FILE_ID = @FileId)
	BEGIN
    UPDATE NOV.FILES_USERS Set PERM = @perm WHERE USER_ID = @usrId AND FILE_ID = @FileId
	END
	else
	BEGIN
		declare @hirid HIERARCHYID
		select @hirid = NOv.FILES.DIR from NOV.FILES where NOV.FILES.ID = @FileId
		insert into NOV.FILES_USERS VALUES( @FileId, @usrId, @perm, @hirid)
	END
END
GO
/****** Object:  StoredProcedure [dbo].[PermitNode]    Script Date: 5/11/2023 8:33:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[PermitNode] 
	-- Add the parameters for the stored procedure here
	@id int,
	@FileId nvarchar(50),
	@perm bit = null
AS
BEGIN
	declare @hir hierarchyid
	select @hir = Dir from NOv.Files where Files.ID = @FileId
	
	declare @userid table(
		theid int
	)
	insert into @userid
	select users.ID from NOV.USERS 
	
	
	INSERT INTO NOV.FILES_USERS values (@FileId, @id, 1)--cast('/' as hierarchyid))


	IF @perm is not null
	begin
		INSERT INTO NOV.FILES_USERS 
		select @FileId, theid, @perm
		from @userid
		where [@userid].theid != @id
	end
	
END
GO
