-- CREATE DATABASE [NOVA]

USE [NOVA]
GO
/****** Object:  Schema [NOV]    Script Date: 3/19/2023 6:56:33 PM ******/
CREATE SCHEMA [NOV]
GO
/****** Object:  UserDefinedFunction [dbo].[getName]    Script Date: 3/19/2023 6:56:33 PM ******/
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
/****** Object:  UserDefinedFunction [NOV].[GetNodes]    Script Date: 3/19/2023 6:56:33 PM ******/
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

CREATE   FUNCTION [NOV].[GetNodes]
(
	@UsrId int,
	@DirId hierarchyid
)
RETURNS @returntable TABLE
(
	Name nvarchar(50),
	HID varchar(5000)
)
AS
BEGIN

	declare @hids table(
	hid hierarchyid
)
	
	insert @hids
	SELECT HIR_ID
	from [NOVA].[NOV].[FILES_USERS]
	where USER_ID = @usrId

	insert @returntable
	select distinct NOV.FILes.Name, FILES.Dir.ToString()
	from [NOVA].NOV.FILES join @hids on hid.IsDescendantOf(Dir) = 1
	where Dir.IsDescendantOf(@DirId) = 1 and Dir.GetLevel()= @DirId.GetLevel()+1

	RETURN
END
GO
/****** Object:  Table [NOV].[USERS]    Script Date: 3/19/2023 6:56:33 PM ******/
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
/****** Object:  UserDefinedFunction [NOV].[GetUser]    Script Date: 3/19/2023 6:56:33 PM ******/
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
	@username varchar(50),
	@password varchar(255)
)
RETURNS TABLE
RETURN(
	SELECT USERS.NAME FROM NOV.USERS WHERE USERNAME = @username AND PASSWORD = @password
);

GO
/****** Object:  Table [NOV].[FILES]    Script Date: 3/19/2023 6:56:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [NOV].[FILES](
	[ID] [int] IDENTITY(0,1) NOT NULL,
	[NAME] [nvarchar](50) NOT NULL,
	[DIR] [hierarchyid] NOT NULL,
 CONSTRAINT [PK__FILES__3214EC27C06D9000] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [NOV].[FILES_USERS]    Script Date: 3/19/2023 6:56:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [NOV].[FILES_USERS](
	[FILE_ID] [int] NOT NULL,
	[USER_ID] [int] NOT NULL,
	[PERM] [bit] NOT NULL,
	[HIR_ID] [hierarchyid] NOT NULL,
 CONSTRAINT [PK__FILES_US__A6FBA2C55A880350] PRIMARY KEY CLUSTERED 
(
	[FILE_ID] ASC,
	[USER_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [NOV].[ROLES]    Script Date: 3/19/2023 6:56:33 PM ******/
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
/****** Object:  Table [NOV].[USERS_ROLES]    Script Date: 3/19/2023 6:56:33 PM ******/
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
INSERT [NOV].[FILES] ([ID], [NAME], [DIR]) VALUES (6, N'folder', N'/6/')
GO
INSERT [NOV].[FILES] ([ID], [NAME], [DIR]) VALUES (7, N'folder2', N'/7/')
GO
INSERT [NOV].[FILES] ([ID], [NAME], [DIR]) VALUES (9, N'file1', N'/6/9/')
GO
INSERT [NOV].[FILES] ([ID], [NAME], [DIR]) VALUES (10, N'file2', N'/7/10/')
GO
INSERT [NOV].[FILES] ([ID], [NAME], [DIR]) VALUES (11, N'folder3', N'/6/11/')
GO
INSERT [NOV].[FILES] ([ID], [NAME], [DIR]) VALUES (12, N'file3', N'/6/11/12/')
GO
INSERT [NOV].[FILES] ([ID], [NAME], [DIR]) VALUES (14, N'folder4', N'/6/11/14/')
GO
INSERT [NOV].[FILES] ([ID], [NAME], [DIR]) VALUES (15, N'file4', N'/6/11/14/15/')
GO
INSERT [NOV].[FILES] ([ID], [NAME], [DIR]) VALUES (17, N'folder5', N'/6/11/17/')
GO
INSERT [NOV].[FILES] ([ID], [NAME], [DIR]) VALUES (21, N'file5', N'/6/11/17/21/')
GO
INSERT [NOV].[FILES] ([ID], [NAME], [DIR]) VALUES (32, N'test', N'/32/')
GO
INSERT [NOV].[FILES] ([ID], [NAME], [DIR]) VALUES (33, N'test', N'/33/')
GO
INSERT [NOV].[FILES] ([ID], [NAME], [DIR]) VALUES (43, N'scsdlc', N'/43/')
GO
INSERT [NOV].[FILES] ([ID], [NAME], [DIR]) VALUES (52, N'ggggg', N'/52/')
GO
INSERT [NOV].[FILES] ([ID], [NAME], [DIR]) VALUES (54, N'ggggg', N'/54/')
GO
INSERT [NOV].[FILES] ([ID], [NAME], [DIR]) VALUES (59, N'adf', N'/59/')
GO
INSERT [NOV].[FILES] ([ID], [NAME], [DIR]) VALUES (60, N'adf', N'/60/')
GO
INSERT [NOV].[FILES] ([ID], [NAME], [DIR]) VALUES (61, N'ybi', N'/61/')
GO
INSERT [NOV].[FILES] ([ID], [NAME], [DIR]) VALUES (64, N'adf', N'/64/')
GO
INSERT [NOV].[FILES] ([ID], [NAME], [DIR]) VALUES (71, N'wswswsw', N'/71/')
GO
INSERT [NOV].[FILES] ([ID], [NAME], [DIR]) VALUES (76, N'7amada', N'/76/')
GO
INSERT [NOV].[FILES] ([ID], [NAME], [DIR]) VALUES (77, N'testFolder', N'/77/')
GO
INSERT [NOV].[FILES] ([ID], [NAME], [DIR]) VALUES (79, N'testFile', N'/79/')
GO
INSERT [NOV].[FILES] ([ID], [NAME], [DIR]) VALUES (80, N'testFile2', N'/80/')
GO
INSERT [NOV].[FILES] ([ID], [NAME], [DIR]) VALUES (81, N'testFile3', N'/81/')
GO
INSERT [NOV].[FILES] ([ID], [NAME], [DIR]) VALUES (82, N'testFile4', N'/82/')
GO
INSERT [NOV].[FILES] ([ID], [NAME], [DIR]) VALUES (83, N'testFile4', N'/83/')
GO
INSERT [NOV].[FILES] ([ID], [NAME], [DIR]) VALUES (85, N'potatoTest', N'/85/')
GO
INSERT [NOV].[FILES] ([ID], [NAME], [DIR]) VALUES (86, N'potatoTest', N'/86/')
GO
INSERT [NOV].[FILES] ([ID], [NAME], [DIR]) VALUES (87, N'potatoTest', N'/87/')
GO
INSERT [NOV].[FILES] ([ID], [NAME], [DIR]) VALUES (88, N'adsfadf', N'/88/')
GO
INSERT [NOV].[FILES] ([ID], [NAME], [DIR]) VALUES (89, N'adffd', N'/89/')
GO
INSERT [NOV].[FILES] ([ID], [NAME], [DIR]) VALUES (91, N'adffd', N'/91/')
GO
INSERT [NOV].[FILES] ([ID], [NAME], [DIR]) VALUES (92, N'fffffff', N'/92/')
GO
INSERT [NOV].[FILES] ([ID], [NAME], [DIR]) VALUES (93, N'fffffff', N'/93/')
GO
INSERT [NOV].[FILES] ([ID], [NAME], [DIR]) VALUES (94, N'fffffff', N'/94/')
GO
SET IDENTITY_INSERT [NOV].[FILES] OFF
GO
INSERT [NOV].[FILES_USERS] ([FILE_ID], [USER_ID], [PERM], [HIR_ID]) VALUES (12, 0, 1, N'/6/11/12/')
GO
INSERT [NOV].[FILES_USERS] ([FILE_ID], [USER_ID], [PERM], [HIR_ID]) VALUES (15, 0, 1, N'/6/11/14/15/')
GO
INSERT [NOV].[FILES_USERS] ([FILE_ID], [USER_ID], [PERM], [HIR_ID]) VALUES (21, 0, 1, N'/6/11/17/21/')
GO
INSERT [NOV].[FILES_USERS] ([FILE_ID], [USER_ID], [PERM], [HIR_ID]) VALUES (71, 0, 1, N'/71/')
GO
INSERT [NOV].[FILES_USERS] ([FILE_ID], [USER_ID], [PERM], [HIR_ID]) VALUES (76, 0, 0, N'/76/')
GO
INSERT [NOV].[FILES_USERS] ([FILE_ID], [USER_ID], [PERM], [HIR_ID]) VALUES (76, 1, 0, N'/76/')
GO
INSERT [NOV].[FILES_USERS] ([FILE_ID], [USER_ID], [PERM], [HIR_ID]) VALUES (76, 2, 0, N'/76/')
GO
INSERT [NOV].[FILES_USERS] ([FILE_ID], [USER_ID], [PERM], [HIR_ID]) VALUES (76, 3, 0, N'/76/')
GO
INSERT [NOV].[FILES_USERS] ([FILE_ID], [USER_ID], [PERM], [HIR_ID]) VALUES (76, 6, 0, N'/76/')
GO
INSERT [NOV].[FILES_USERS] ([FILE_ID], [USER_ID], [PERM], [HIR_ID]) VALUES (76, 7, 0, N'/76/')
GO
INSERT [NOV].[FILES_USERS] ([FILE_ID], [USER_ID], [PERM], [HIR_ID]) VALUES (76, 9, 0, N'/76/')
GO
INSERT [NOV].[FILES_USERS] ([FILE_ID], [USER_ID], [PERM], [HIR_ID]) VALUES (79, 0, 1, N'/79/')
GO
INSERT [NOV].[FILES_USERS] ([FILE_ID], [USER_ID], [PERM], [HIR_ID]) VALUES (80, 0, 1, N'/80/')
GO
INSERT [NOV].[FILES_USERS] ([FILE_ID], [USER_ID], [PERM], [HIR_ID]) VALUES (81, 0, 1, N'/81/')
GO
INSERT [NOV].[FILES_USERS] ([FILE_ID], [USER_ID], [PERM], [HIR_ID]) VALUES (82, 0, 1, N'/82/')
GO
INSERT [NOV].[FILES_USERS] ([FILE_ID], [USER_ID], [PERM], [HIR_ID]) VALUES (83, 0, 1, N'/83/')
GO
INSERT [NOV].[FILES_USERS] ([FILE_ID], [USER_ID], [PERM], [HIR_ID]) VALUES (85, 0, 1, N'/85/')
GO
INSERT [NOV].[FILES_USERS] ([FILE_ID], [USER_ID], [PERM], [HIR_ID]) VALUES (86, 0, 1, N'/86/')
GO
INSERT [NOV].[FILES_USERS] ([FILE_ID], [USER_ID], [PERM], [HIR_ID]) VALUES (87, 0, 1, N'/87/')
GO
INSERT [NOV].[FILES_USERS] ([FILE_ID], [USER_ID], [PERM], [HIR_ID]) VALUES (88, 0, 1, N'/88/')
GO
INSERT [NOV].[FILES_USERS] ([FILE_ID], [USER_ID], [PERM], [HIR_ID]) VALUES (89, 0, 1, N'/89/')
GO
INSERT [NOV].[FILES_USERS] ([FILE_ID], [USER_ID], [PERM], [HIR_ID]) VALUES (91, 0, 1, N'/91/')
GO
INSERT [NOV].[FILES_USERS] ([FILE_ID], [USER_ID], [PERM], [HIR_ID]) VALUES (91, 1, 1, N'/91/')
GO
INSERT [NOV].[FILES_USERS] ([FILE_ID], [USER_ID], [PERM], [HIR_ID]) VALUES (91, 2, 1, N'/91/')
GO
INSERT [NOV].[FILES_USERS] ([FILE_ID], [USER_ID], [PERM], [HIR_ID]) VALUES (91, 3, 1, N'/91/')
GO
INSERT [NOV].[FILES_USERS] ([FILE_ID], [USER_ID], [PERM], [HIR_ID]) VALUES (91, 6, 1, N'/91/')
GO
INSERT [NOV].[FILES_USERS] ([FILE_ID], [USER_ID], [PERM], [HIR_ID]) VALUES (91, 7, 1, N'/91/')
GO
INSERT [NOV].[FILES_USERS] ([FILE_ID], [USER_ID], [PERM], [HIR_ID]) VALUES (91, 9, 1, N'/91/')
GO
INSERT [NOV].[FILES_USERS] ([FILE_ID], [USER_ID], [PERM], [HIR_ID]) VALUES (92, 0, 1, N'/92/')
GO
INSERT [NOV].[FILES_USERS] ([FILE_ID], [USER_ID], [PERM], [HIR_ID]) VALUES (93, 0, 1, N'/93/')
GO
INSERT [NOV].[FILES_USERS] ([FILE_ID], [USER_ID], [PERM], [HIR_ID]) VALUES (93, 1, 0, N'/93/')
GO
INSERT [NOV].[FILES_USERS] ([FILE_ID], [USER_ID], [PERM], [HIR_ID]) VALUES (93, 2, 0, N'/93/')
GO
INSERT [NOV].[FILES_USERS] ([FILE_ID], [USER_ID], [PERM], [HIR_ID]) VALUES (93, 3, 0, N'/93/')
GO
INSERT [NOV].[FILES_USERS] ([FILE_ID], [USER_ID], [PERM], [HIR_ID]) VALUES (93, 6, 0, N'/93/')
GO
INSERT [NOV].[FILES_USERS] ([FILE_ID], [USER_ID], [PERM], [HIR_ID]) VALUES (93, 7, 0, N'/93/')
GO
INSERT [NOV].[FILES_USERS] ([FILE_ID], [USER_ID], [PERM], [HIR_ID]) VALUES (93, 9, 0, N'/93/')
GO
INSERT [NOV].[FILES_USERS] ([FILE_ID], [USER_ID], [PERM], [HIR_ID]) VALUES (94, 0, 1, N'/94/')
GO
INSERT [NOV].[FILES_USERS] ([FILE_ID], [USER_ID], [PERM], [HIR_ID]) VALUES (94, 1, 1, N'/94/')
GO
INSERT [NOV].[FILES_USERS] ([FILE_ID], [USER_ID], [PERM], [HIR_ID]) VALUES (94, 2, 1, N'/94/')
GO
INSERT [NOV].[FILES_USERS] ([FILE_ID], [USER_ID], [PERM], [HIR_ID]) VALUES (94, 3, 1, N'/94/')
GO
INSERT [NOV].[FILES_USERS] ([FILE_ID], [USER_ID], [PERM], [HIR_ID]) VALUES (94, 6, 1, N'/94/')
GO
INSERT [NOV].[FILES_USERS] ([FILE_ID], [USER_ID], [PERM], [HIR_ID]) VALUES (94, 7, 1, N'/94/')
GO
INSERT [NOV].[FILES_USERS] ([FILE_ID], [USER_ID], [PERM], [HIR_ID]) VALUES (94, 9, 1, N'/94/')
GO
SET IDENTITY_INSERT [NOV].[USERS] ON 
GO
INSERT [NOV].[USERS] ([ID], [NAME], [USERNAME], [PASSWORD], [LEVEL]) VALUES (0, N'Admin', N'admin', N'admin', 2)
GO
INSERT [NOV].[USERS] ([ID], [NAME], [USERNAME], [PASSWORD], [LEVEL]) VALUES (1, N'Repo Admin', N'repo-admin', N'repo', 1)
GO
INSERT [NOV].[USERS] ([ID], [NAME], [USERNAME], [PASSWORD], [LEVEL]) VALUES (2, N'User', N'user', N'user', 0)
GO
INSERT [NOV].[USERS] ([ID], [NAME], [USERNAME], [PASSWORD], [LEVEL]) VALUES (3, N'Test', N'test', N'test', 0)
GO
INSERT [NOV].[USERS] ([ID], [NAME], [USERNAME], [PASSWORD], [LEVEL]) VALUES (6, N'asdf', N'asdff', N'asdf', 0)
GO
INSERT [NOV].[USERS] ([ID], [NAME], [USERNAME], [PASSWORD], [LEVEL]) VALUES (7, N'asdf', N'asdfff', N'asdf', 0)
GO
INSERT [NOV].[USERS] ([ID], [NAME], [USERNAME], [PASSWORD], [LEVEL]) VALUES (9, N'T', N't', N't', 0)
GO
SET IDENTITY_INSERT [NOV].[USERS] OFF
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__USERS__B15BE12E7C3A3DE7]    Script Date: 3/19/2023 6:56:33 PM ******/
ALTER TABLE [NOV].[USERS] ADD  CONSTRAINT [UQ__USERS__B15BE12E7C3A3DE7] UNIQUE NONCLUSTERED 
(
	[USERNAME] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
ALTER TABLE [NOV].[USERS] ADD  CONSTRAINT [DF__USERS__LEVEL__4AB81AF0]  DEFAULT ((0)) FOR [LEVEL]
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
/****** Object:  StoredProcedure [dbo].[AddNode]    Script Date: 3/19/2023 6:56:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[AddNode]
	-- Add the parameters for the stored procedure here
	@Name nvarchar(50),
	@Dir varchar
AS
BEGIN
	declare @return int
	begin tran t;
		INSERT INTO NOV.FILES VALUES (@Name, cast('/' as hierarchyid))
		Update Nov.Files 
		set DIR = cast(@Dir+CAST(SCOPE_IDENTITY() AS varchar)+'/' as hierarchyid)
		where ID = CAST(SCOPE_IDENTITY() AS INT)
		select @return = CAST(SCOPE_IDENTITY() AS INT)
	commit tran t;
	return @return

END
GO
/****** Object:  StoredProcedure [dbo].[PermitNode]    Script Date: 3/19/2023 6:56:33 PM ******/
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
	
	
	INSERT INTO NOV.FILES_USERS values (@FileId, @id, 1, @hir)--cast('/' as hierarchyid))


	IF @perm is not null
	begin
		INSERT INTO NOV.FILES_USERS 
		select @FileId, theid, @perm, @hir
		from @userid
		where [@userid].theid != @id
	end
	
END
GO
