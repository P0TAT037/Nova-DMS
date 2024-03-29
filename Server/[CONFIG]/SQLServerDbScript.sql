CREATE DATABASE NOVA
GO

USE [NOVA]
GO
/****** Object:  Schema [NOV]    Script Date: 5/20/2023 4:19:48 AM ******/
CREATE SCHEMA [NOV]
GO
/****** Object:  UserDefinedFunction [dbo].[getName]    Script Date: 5/20/2023 4:19:48 AM ******/
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
/****** Object:  UserDefinedFunction [NOV].[GetNodes]    Script Date: 5/20/2023 4:19:48 AM ******/
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
	select FILES_USERS.FILE_ID, FILES_USERS.HID
	From FILES_USERS
	Where FILES_USERS.USER_ID= @UsrId 
	And FILES_Users.HID.IsDescendantOf(@DirID) = 1
	And FILES_Users.HID.GetLevel() = @DirId.GetLevel()+1
	
	insert @names
	select Distinct Files.id, FILES.NAME
	From FILES

	insert @returntable
	select [@names].id, [@names].name, [@hids].hid.ToString()
	from @hids join @names on ([@hids].id = [@names].id)
	return
END
GO
/****** Object:  Table [NOV].[USERS]    Script Date: 5/20/2023 4:19:48 AM ******/
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
/****** Object:  UserDefinedFunction [NOV].[GetUser]    Script Date: 5/20/2023 4:19:48 AM ******/
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
/****** Object:  Table [NOV].[FILES]    Script Date: 5/20/2023 4:19:48 AM ******/
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
/****** Object:  Table [NOV].[FILES_OWNERS]    Script Date: 5/20/2023 4:19:48 AM ******/
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
/****** Object:  Table [NOV].[FILES_USERS]    Script Date: 5/20/2023 4:19:48 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [NOV].[FILES_USERS](
	[FILE_ID] [int] NOT NULL,
	[USER_ID] [int] NOT NULL,
	[PERM] [bit] NOT NULL,
	[HID] [hierarchyid] NULL,
 CONSTRAINT [PK__FILES_US__A6FBA2C55A880350] PRIMARY KEY CLUSTERED 
(
	[FILE_ID] ASC,
	[USER_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [NOV].[REFRESH_TOKENS]    Script Date: 5/20/2023 4:19:48 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [NOV].[REFRESH_TOKENS](
	[token] [uniqueidentifier] NOT NULL,
	[expires] [datetime] NOT NULL,
 CONSTRAINT [PK_REFRESH_TOKENS] PRIMARY KEY CLUSTERED 
(
	[token] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [NOV].[ROLES]    Script Date: 5/20/2023 4:19:48 AM ******/
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
/****** Object:  Table [NOV].[USERS_ROLES]    Script Date: 5/20/2023 4:19:48 AM ******/
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
INSERT [NOV].[FILES] ([ID], [NAME], [DIR], [IsFolder]) VALUES (9, N'Folder1', N'/9/', 1)
GO
INSERT [NOV].[FILES] ([ID], [NAME], [DIR], [IsFolder]) VALUES (10, N'sqllol', N'/', 0)
GO
INSERT [NOV].[FILES] ([ID], [NAME], [DIR], [IsFolder]) VALUES (11, N'Folder2', N'/11/', 1)
GO
INSERT [NOV].[FILES] ([ID], [NAME], [DIR], [IsFolder]) VALUES (12, N'dfs', N'/12/', 0)
GO
SET IDENTITY_INSERT [NOV].[FILES] OFF
GO
INSERT [NOV].[FILES_OWNERS] ([FileID], [UserID]) VALUES (9, 0)
GO
INSERT [NOV].[FILES_OWNERS] ([FileID], [UserID]) VALUES (10, 0)
GO
INSERT [NOV].[FILES_OWNERS] ([FileID], [UserID]) VALUES (11, 0)
GO
INSERT [NOV].[FILES_OWNERS] ([FileID], [UserID]) VALUES (12, 0)
GO
INSERT [NOV].[FILES_USERS] ([FILE_ID], [USER_ID], [PERM], [HID]) VALUES (9, 0, 1, N'/9/')
GO
INSERT [NOV].[FILES_USERS] ([FILE_ID], [USER_ID], [PERM], [HID]) VALUES (9, 1, 1, N'/9/')
GO
INSERT [NOV].[FILES_USERS] ([FILE_ID], [USER_ID], [PERM], [HID]) VALUES (9, 2, 1, N'/9/')
GO
INSERT [NOV].[FILES_USERS] ([FILE_ID], [USER_ID], [PERM], [HID]) VALUES (9, 3, 1, N'/9/')
GO
INSERT [NOV].[FILES_USERS] ([FILE_ID], [USER_ID], [PERM], [HID]) VALUES (10, 0, 1, N'/')
GO
INSERT [NOV].[FILES_USERS] ([FILE_ID], [USER_ID], [PERM], [HID]) VALUES (10, 1, 1, N'/')
GO
INSERT [NOV].[FILES_USERS] ([FILE_ID], [USER_ID], [PERM], [HID]) VALUES (10, 2, 1, N'/')
GO
INSERT [NOV].[FILES_USERS] ([FILE_ID], [USER_ID], [PERM], [HID]) VALUES (10, 3, 1, N'/')
GO
INSERT [NOV].[FILES_USERS] ([FILE_ID], [USER_ID], [PERM], [HID]) VALUES (11, 0, 1, N'/11/')
GO
INSERT [NOV].[FILES_USERS] ([FILE_ID], [USER_ID], [PERM], [HID]) VALUES (11, 1, 1, N'/11/')
GO
INSERT [NOV].[FILES_USERS] ([FILE_ID], [USER_ID], [PERM], [HID]) VALUES (11, 2, 1, N'/11/')
GO
INSERT [NOV].[FILES_USERS] ([FILE_ID], [USER_ID], [PERM], [HID]) VALUES (11, 3, 1, N'/11/')
GO
INSERT [NOV].[FILES_USERS] ([FILE_ID], [USER_ID], [PERM], [HID]) VALUES (12, 0, 1, N'/12/')
GO
INSERT [NOV].[FILES_USERS] ([FILE_ID], [USER_ID], [PERM], [HID]) VALUES (12, 1, 1, N'/12/')
GO
INSERT [NOV].[FILES_USERS] ([FILE_ID], [USER_ID], [PERM], [HID]) VALUES (12, 2, 1, N'/12/')
GO
INSERT [NOV].[FILES_USERS] ([FILE_ID], [USER_ID], [PERM], [HID]) VALUES (12, 3, 1, N'/12/')
GO
INSERT [NOV].[REFRESH_TOKENS] ([token], [expires]) VALUES (N'b3587dcf-6139-4962-b346-015fd72bb3ef', CAST(N'2023-05-24T00:39:00.237' AS DateTime))
GO
INSERT [NOV].[REFRESH_TOKENS] ([token], [expires]) VALUES (N'fd052aef-49ae-4fd0-aa43-14c1d518a589', CAST(N'2023-05-27T01:01:58.270' AS DateTime))
GO
INSERT [NOV].[REFRESH_TOKENS] ([token], [expires]) VALUES (N'96813c89-12df-4244-a0b0-16cd8955d485', CAST(N'2023-05-24T00:39:00.993' AS DateTime))
GO
INSERT [NOV].[REFRESH_TOKENS] ([token], [expires]) VALUES (N'c788e618-c53a-4f4d-aba4-2e53353ade50', CAST(N'2023-05-24T00:39:01.003' AS DateTime))
GO
INSERT [NOV].[REFRESH_TOKENS] ([token], [expires]) VALUES (N'f961aa10-4aba-4556-9490-34c7ac8013f4', CAST(N'2023-05-23T23:40:03.133' AS DateTime))
GO
INSERT [NOV].[REFRESH_TOKENS] ([token], [expires]) VALUES (N'5082091b-7635-40af-8995-34fa049db6de', CAST(N'2023-05-27T02:14:46.083' AS DateTime))
GO
INSERT [NOV].[REFRESH_TOKENS] ([token], [expires]) VALUES (N'a39fe6c5-0fd4-436b-9b39-35d49f880a55', CAST(N'2023-05-26T17:29:44.003' AS DateTime))
GO
INSERT [NOV].[REFRESH_TOKENS] ([token], [expires]) VALUES (N'0fd1b54c-e785-491d-a5ff-361668dadb07', CAST(N'2023-05-24T00:39:00.183' AS DateTime))
GO
INSERT [NOV].[REFRESH_TOKENS] ([token], [expires]) VALUES (N'd08a02b6-19d0-4fcf-bbd9-3c826184ec72', CAST(N'2023-05-24T00:39:00.983' AS DateTime))
GO
INSERT [NOV].[REFRESH_TOKENS] ([token], [expires]) VALUES (N'99f549f4-dbbf-4ae3-9fc2-46777b5331f8', CAST(N'2023-05-24T01:06:32.987' AS DateTime))
GO
INSERT [NOV].[REFRESH_TOKENS] ([token], [expires]) VALUES (N'8250130d-f8f5-49b1-97d2-52b2006d881c', CAST(N'2023-05-24T00:39:00.183' AS DateTime))
GO
INSERT [NOV].[REFRESH_TOKENS] ([token], [expires]) VALUES (N'ea28ed25-97bc-4812-b655-5618b80c61f9', CAST(N'2023-05-23T23:40:03.133' AS DateTime))
GO
INSERT [NOV].[REFRESH_TOKENS] ([token], [expires]) VALUES (N'dcfd31fd-f541-42a4-a3ed-5cce7d526f0d', CAST(N'2023-05-24T00:47:22.703' AS DateTime))
GO
INSERT [NOV].[REFRESH_TOKENS] ([token], [expires]) VALUES (N'9ea4d2d7-cd2d-46a2-81c1-60272bda54ee', CAST(N'2023-05-23T20:33:10.700' AS DateTime))
GO
INSERT [NOV].[REFRESH_TOKENS] ([token], [expires]) VALUES (N'671319d4-8788-47e9-bf17-614e6910ad4f', CAST(N'2023-05-24T00:39:00.183' AS DateTime))
GO
INSERT [NOV].[REFRESH_TOKENS] ([token], [expires]) VALUES (N'850eda75-85b2-4d24-bf5a-64e484beb0c2', CAST(N'2023-05-27T00:56:52.803' AS DateTime))
GO
INSERT [NOV].[REFRESH_TOKENS] ([token], [expires]) VALUES (N'90635d8c-6932-4033-9b16-660bca2c7f96', CAST(N'2023-05-24T00:39:00.983' AS DateTime))
GO
INSERT [NOV].[REFRESH_TOKENS] ([token], [expires]) VALUES (N'bc88ec9e-6712-4353-808c-6979c21d1180', CAST(N'2023-05-23T23:44:55.577' AS DateTime))
GO
INSERT [NOV].[REFRESH_TOKENS] ([token], [expires]) VALUES (N'a06a6975-587e-4b77-9f6b-6b88843e5675', CAST(N'2023-05-24T00:39:00.983' AS DateTime))
GO
INSERT [NOV].[REFRESH_TOKENS] ([token], [expires]) VALUES (N'ae5eb6bf-e37c-49a3-a8a3-72ab62531131', CAST(N'2023-05-24T00:39:00.183' AS DateTime))
GO
INSERT [NOV].[REFRESH_TOKENS] ([token], [expires]) VALUES (N'87d13763-42b2-4130-959f-77ff6321fb48', CAST(N'2023-05-23T22:22:38.597' AS DateTime))
GO
INSERT [NOV].[REFRESH_TOKENS] ([token], [expires]) VALUES (N'a58ee12e-a722-42a0-9051-7939b2196708', CAST(N'2023-05-24T00:39:00.183' AS DateTime))
GO
INSERT [NOV].[REFRESH_TOKENS] ([token], [expires]) VALUES (N'3a6fd3f6-f608-468e-aaaf-793aab5ec242', CAST(N'2023-05-24T00:39:00.897' AS DateTime))
GO
INSERT [NOV].[REFRESH_TOKENS] ([token], [expires]) VALUES (N'f752af2f-9068-440d-b11c-7f00c1b753d4', CAST(N'2023-05-26T17:29:44.003' AS DateTime))
GO
INSERT [NOV].[REFRESH_TOKENS] ([token], [expires]) VALUES (N'a26ac0c3-a070-43fe-8199-8360cb9c00f5', CAST(N'2023-05-23T21:14:49.140' AS DateTime))
GO
INSERT [NOV].[REFRESH_TOKENS] ([token], [expires]) VALUES (N'ab7820f1-20c4-43a5-9881-87b2f14f067f', CAST(N'2023-05-27T03:49:27.977' AS DateTime))
GO
INSERT [NOV].[REFRESH_TOKENS] ([token], [expires]) VALUES (N'4e47509f-7138-4b78-b814-9082ea3ed922', CAST(N'2023-05-24T00:39:00.183' AS DateTime))
GO
INSERT [NOV].[REFRESH_TOKENS] ([token], [expires]) VALUES (N'28d3392e-0926-4527-a323-9c49f8e6e15d', CAST(N'2023-05-24T00:39:00.983' AS DateTime))
GO
INSERT [NOV].[REFRESH_TOKENS] ([token], [expires]) VALUES (N'416bffaa-6fc9-48f9-bff6-9dd6881d2957', CAST(N'2023-05-27T01:23:39.577' AS DateTime))
GO
INSERT [NOV].[REFRESH_TOKENS] ([token], [expires]) VALUES (N'0384fe9d-7f4a-43b8-b316-a9983c2e3199', CAST(N'2023-05-24T00:39:00.877' AS DateTime))
GO
INSERT [NOV].[REFRESH_TOKENS] ([token], [expires]) VALUES (N'ea13fa71-649d-4657-947b-ad884020b1c5', CAST(N'2023-05-24T00:39:00.183' AS DateTime))
GO
INSERT [NOV].[REFRESH_TOKENS] ([token], [expires]) VALUES (N'09077da4-3bdc-42d1-97b1-af37e38b53cc', CAST(N'2023-05-24T00:39:00.943' AS DateTime))
GO
INSERT [NOV].[REFRESH_TOKENS] ([token], [expires]) VALUES (N'b8c63968-ec2d-48a0-949d-b136bd91ae94', CAST(N'2023-05-27T02:54:06.530' AS DateTime))
GO
INSERT [NOV].[REFRESH_TOKENS] ([token], [expires]) VALUES (N'f1d29f22-59cf-48df-82f7-b559b883d50d', CAST(N'2023-05-26T17:31:04.523' AS DateTime))
GO
INSERT [NOV].[REFRESH_TOKENS] ([token], [expires]) VALUES (N'834a33a2-067e-4829-8727-b83759d97690', CAST(N'2023-05-24T00:39:00.183' AS DateTime))
GO
INSERT [NOV].[REFRESH_TOKENS] ([token], [expires]) VALUES (N'5add4a27-7d20-4cce-a9fa-bb6d48927959', CAST(N'2023-05-24T00:39:00.967' AS DateTime))
GO
INSERT [NOV].[REFRESH_TOKENS] ([token], [expires]) VALUES (N'c7c7ea35-7aff-4cda-9026-bbf958a57041', CAST(N'2023-05-27T03:42:09.637' AS DateTime))
GO
INSERT [NOV].[REFRESH_TOKENS] ([token], [expires]) VALUES (N'854555e5-bb9f-4a32-8192-bcfaf19e622d', CAST(N'2023-05-24T00:39:00.183' AS DateTime))
GO
INSERT [NOV].[REFRESH_TOKENS] ([token], [expires]) VALUES (N'3a150500-1208-4cca-918a-c2378474555b', CAST(N'2023-05-24T00:39:00.183' AS DateTime))
GO
INSERT [NOV].[REFRESH_TOKENS] ([token], [expires]) VALUES (N'e949eaf1-3284-4eb1-a17c-d36b188e1240', CAST(N'2023-05-23T22:21:47.110' AS DateTime))
GO
INSERT [NOV].[REFRESH_TOKENS] ([token], [expires]) VALUES (N'ab53227b-27ef-4602-98d6-dc5c4a414ff4', CAST(N'2023-05-24T00:39:00.183' AS DateTime))
GO
INSERT [NOV].[REFRESH_TOKENS] ([token], [expires]) VALUES (N'70b3e602-5d77-4255-a353-dcb1eecf0eca', CAST(N'2023-05-24T00:39:00.897' AS DateTime))
GO
INSERT [NOV].[REFRESH_TOKENS] ([token], [expires]) VALUES (N'3d2e931f-39dc-4603-a2a1-f9fdb51ae88c', CAST(N'2023-05-24T00:39:00.183' AS DateTime))
GO
INSERT [NOV].[REFRESH_TOKENS] ([token], [expires]) VALUES (N'49d6b4f6-0656-4605-a9f1-fb5133f4f68b', CAST(N'2023-05-24T00:39:01.000' AS DateTime))
GO
INSERT [NOV].[REFRESH_TOKENS] ([token], [expires]) VALUES (N'fba1090e-641f-4a0a-b1b6-fe2ed4c78cbc', CAST(N'2023-05-24T01:45:33.693' AS DateTime))
GO
SET IDENTITY_INSERT [NOV].[ROLES] ON 
GO
INSERT [NOV].[ROLES] ([ID], [NAME]) VALUES (0, N'Role 1')
GO
SET IDENTITY_INSERT [NOV].[ROLES] OFF
GO
SET IDENTITY_INSERT [NOV].[USERS] ON 
GO
INSERT [NOV].[USERS] ([ID], [NAME], [USERNAME], [PASSWORD], [LEVEL]) VALUES (0, N'Admin', N'admin', N'$2a$11$TfLYqA27sfQN8of93AH9zee3o8T00IRDLzibOxrqX0P/lbMpj9Tve', 2)
GO
INSERT [NOV].[USERS] ([ID], [NAME], [USERNAME], [PASSWORD], [LEVEL]) VALUES (1, N'User', N'user', N'$2a$11$uAWh.ay0wYYbt8c0ZHUs9OQ1.RMenEulrMWFu11CJfh8jGRw4W2IS', 0)
GO
INSERT [NOV].[USERS] ([ID], [NAME], [USERNAME], [PASSWORD], [LEVEL]) VALUES (2, N'roleuser1', N'roleuser1', N'$2a$11$XnGo333Qxf.zN3Q3V6CGmeWv0gcLzJRDfLNsYJtZDiNuatM.lXIqi', 0)
GO
INSERT [NOV].[USERS] ([ID], [NAME], [USERNAME], [PASSWORD], [LEVEL]) VALUES (3, N'roleuser2', N'roleuser2', N'$2a$11$PQW9KKcbCWIDsNYFslC6s.FELTzckLWpFQtVUr.I81aMsqObf3usa', 0)
GO
SET IDENTITY_INSERT [NOV].[USERS] OFF
GO
INSERT [NOV].[USERS_ROLES] ([USER_ID], [ROLE_ID]) VALUES (2, 0)
GO
INSERT [NOV].[USERS_ROLES] ([USER_ID], [ROLE_ID]) VALUES (3, 0)
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ_NAME]    Script Date: 5/20/2023 4:19:48 AM ******/
ALTER TABLE [NOV].[ROLES] ADD  CONSTRAINT [UQ_NAME] UNIQUE NONCLUSTERED 
(
	[NAME] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__USERS__B15BE12E7C3A3DE7]    Script Date: 5/20/2023 4:19:48 AM ******/
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
/****** Object:  StoredProcedure [dbo].[AddNode]    Script Date: 5/20/2023 4:19:48 AM ******/
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
/****** Object:  StoredProcedure [dbo].[ChangePerm]    Script Date: 5/20/2023 4:19:48 AM ******/
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
/****** Object:  StoredProcedure [dbo].[ChangePermByRole]    Script Date: 5/20/2023 4:19:48 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[ChangePermByRole]
	-- Add the parameters for the stored procedure here
	@RoleId int,
	@FileId int,
	@Perm int
AS
BEGIN
DECLARE @user_id TABLE (id INT);
DECLARE @hid hierarchyid;

INSERT @user_id 
SELECT USER_ID
FROM NOV.USERS_ROLES
WHERE ROLE_ID = @RoleId;

SELECT @hid = DIR 
FROM NOV.FILES
WHERE @FileId = NOV.FILES.ID;
Declare @p bit
Select @p = @Perm
Select @Perm = 0
MERGE INTO Nov.FILES_USERS
USING @user_id AS u
ON Nov.FILES_USERS.FILE_ID = @FileId
    AND Nov.FILES_USERS.USER_ID = u.id
WHEN MATCHED AND @p IS NULL THEN
	DELETE
--WHEN NOT MATCHED BY SOURCE AND @p IS NULL THEN
	--DELETE 
WHEN MATCHED THEN
    UPDATE SET PERM = CASE
        WHEN @P IS NULL THEN @Perm
        ELSE @P
    END

WHEN NOT MATCHED THEN
    INSERT (FILE_ID, USER_ID, PERM,HID)
    VALUES (@FileId, u.id, @p,@hid);

END
GO
/****** Object:  StoredProcedure [dbo].[MoveNode]    Script Date: 5/20/2023 4:19:48 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[MoveNode]
	-- Add the parameters for the stored procedure here
	@nodeId int,
	@newDir varchar
AS
BEGIN
	begin tran t;
		
		declare @isFolder bit
		select @isFolder = (SELECT NOV.FILES.IsFolder from NOV.FILES where NOV.FILES.ID = @NodeId)
		
		IF @isFolder = 1
		BEGIN
			declare @oldDir hierarchyid 
			Select @oldDir = (Select NOV.FILES.DIR from NOV.FILES where NOV.FILES.ID = @NodeId)
			
			Update Nov.FILES 
			set DIR = Cast(CONCAT(@newDir,NOV.FILES.ID,'/') as hierarchyid)
			where FILES.DIR.IsDescendantOf(@oldDir) = 1

			Update Nov.FILES_USERS 
			set HID = Cast(CONCAT(@newDir,NOV.FILES_USERS.FILE_ID,'/') as hierarchyid) 
			where FILES_USERS.HID.IsDescendantOf(@oldDir) = 1
		END
		
		Update Nov.FILES 
		set DIR = Cast(CONCAT(@newDir,@nodeID,'/') as hierarchyid) 
		where ID = @NodeId

		Update Nov.FILES_USERS 
		set HID = Cast(CONCAT(@newDir,@nodeID,'/') as hierarchyid) 
		where FILE_ID = @NodeId
			
	commit tran t;
END
GO
/****** Object:  StoredProcedure [dbo].[PermitNode]    Script Date: 5/20/2023 4:19:48 AM ******/
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
