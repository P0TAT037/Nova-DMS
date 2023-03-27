CREATE DATABASE NOVA
GO
USE [NOVA]
GO
/****** Object:  Schema [NOV]    Script Date: 3/11/2023 11:45:50 PM ******/
CREATE SCHEMA [NOV]
GO
/****** Object:  UserDefinedFunction [NOV].[GetNodes]    Script Date: 3/11/2023 11:45:50 PM ******/
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
	@repoId int,
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
	SELECT FILES.Dir.ToString()
	from [NOVA].[NOV].[FILES] join [NOVA].[NOV].[FILES_USERS] on ID = FILE_ID
	where Dir.IsDescendantOf(@DirId) = 1 and USER_ID = @usrId and REPO_ID = @repoId

	insert @returntable
	select distinct NOV.FILes.Name, FILES.Dir.ToString()
	from [NOVA].NOV.FILES full join @hids on FILES.id = FILES.id
	where Dir.IsDescendantOf(@DirId) = 1 and Dir.GetLevel()= @DirId.GetLevel()+1 and REPO_ID = @repoId

	RETURN
END
GO
/****** Object:  Table [NOV].[USERS]    Script Date: 3/11/2023 11:45:50 PM ******/
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
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UQ__USERS__B15BE12E7C3A3DE7] UNIQUE NONCLUSTERED 
(
	[USERNAME] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  UserDefinedFunction [NOV].[GetUser]    Script Date: 3/11/2023 11:45:50 PM ******/
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
/****** Object:  Table [NOV].[FILES]    Script Date: 3/11/2023 11:45:50 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [NOV].[FILES](
	[ID] [int] IDENTITY(0,1) NOT NULL,
	[REPO_ID] [int] NOT NULL,
	[NAME] [nvarchar](50) NOT NULL,
	[DIR] [hierarchyid] NOT NULL,
 CONSTRAINT [PK__FILES__3214EC27C06D9000] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [NOV].[FILES_USERS]    Script Date: 3/11/2023 11:45:50 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [NOV].[FILES_USERS](
	[FILE_ID] [int] NOT NULL,
	[USER_ID] [int] NOT NULL,
	[PERM] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[FILE_ID] ASC,
	[USER_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [NOV].[REPOS]    Script Date: 3/11/2023 11:45:50 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [NOV].[REPOS](
	[ID] [int] IDENTITY(0,1) NOT NULL,
	[ADMIN_ID] [int] NOT NULL,
	[NAME] [nvarchar](50) NOT NULL,
 CONSTRAINT [PK__REPOS__3214EC2748B28C93] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [NOV].[REPOS_USERS]    Script Date: 3/11/2023 11:45:50 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [NOV].[REPOS_USERS](
	[REPO_ID] [int] NOT NULL,
	[USER_ID] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[REPO_ID] ASC,
	[USER_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [NOV].[ROLES]    Script Date: 3/11/2023 11:45:50 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [NOV].[ROLES](
	[ID] [int] IDENTITY(0,1) NOT NULL,
	[NAME] [varchar](50) NOT NULL,
	[REPO_ID] [int] NOT NULL,
 CONSTRAINT [PK__ROLES__3214EC27D27E53BB] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [NOV].[USERS_ROLES]    Script Date: 3/11/2023 11:45:50 PM ******/
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
ALTER TABLE [NOV].[REPOS]  WITH CHECK ADD  CONSTRAINT [FK__REPOS__ADMIN_ID__4D94879B] FOREIGN KEY([ADMIN_ID])
REFERENCES [NOV].[USERS] ([ID])
GO
ALTER TABLE [NOV].[REPOS] CHECK CONSTRAINT [FK__REPOS__ADMIN_ID__4D94879B]
GO
ALTER TABLE [NOV].[REPOS_USERS]  WITH CHECK ADD  CONSTRAINT [FK__REPOS_USE__REPO___5070F446] FOREIGN KEY([REPO_ID])
REFERENCES [NOV].[REPOS] ([ID])
GO
ALTER TABLE [NOV].[REPOS_USERS] CHECK CONSTRAINT [FK__REPOS_USE__REPO___5070F446]
GO
ALTER TABLE [NOV].[REPOS_USERS]  WITH CHECK ADD  CONSTRAINT [FK__REPOS_USE__USER___5165187F] FOREIGN KEY([USER_ID])
REFERENCES [NOV].[USERS] ([ID])
GO
ALTER TABLE [NOV].[REPOS_USERS] CHECK CONSTRAINT [FK__REPOS_USE__USER___5165187F]
GO
ALTER TABLE [NOV].[ROLES]  WITH CHECK ADD  CONSTRAINT [FK__ROLES__REPO_ID__5441852A] FOREIGN KEY([REPO_ID])
REFERENCES [NOV].[REPOS] ([ID])
GO
ALTER TABLE [NOV].[ROLES] CHECK CONSTRAINT [FK__ROLES__REPO_ID__5441852A]
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

