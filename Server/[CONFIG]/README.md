# How to setup the project environment

## Configure the server

### setup the database

you'll need to have sql server installed on your machine, you can download it from [here](https://www.microsoft.com/en-us/sql-server/sql-server-downloads).
and then you need to run the **[script]\Database\create.sql** included in this folder on your sql server. this will create the database, the tables and insert sample data in it which is required for the project to work.

### Setupenv.bat

run setupenv.bat in any directory **(preferably empty directory)** and follow the instructions it prints when running MinIO and ElasticSearch. this directory will contain the folder in which MinIO is gonna store the files so make sure you have enough empty space in that directory.

setupenv is gonna download all the project dependencies and configure them to be ready to work with the project.
it will create:

- a new json file ```credentials.json``` containing the MinIO and ElasticSearch credentials as json objects that you will need to put in your appsettings.json.
- a new folder named **Storage** that will contain the MinIO files.
- a new folder named **bin** that will contain some generated bat files.
  
in **bin** you'll find startenv.bat, this starts the required tools automatically, with the right configuration. the **bin** folder is added to your PATH environment variable so you can ```startenv``` directly from the cmd/powershell.

all other generated files/folders are not of importance to you but are dependencies of the project and **should not be modified** unless it's a compressed file like elasticsearch.zip and openssl, you can delete those.

### Startenv.bat

you can just type ```startenv``` in the cmd/powershell to start the required tools.

this will start:

- MinIO
- ElasticSearch
(elasticsearch might take a while to start so be patient, it prints a lot of garbage in the process but it's normal)

### appsettings.json

your's should look like the [template](https://github.com/P0TAT037/Nova-DMS/Server/[CONFIG]/appsettingsTemplate.json)included in this folder.
you'll need to :

- fill in your connection string.
- MinIO and ElasticSearch data and credentials (you can get them from the credentials.json that setupenv generates).
  
**you can now run the server and it should work**

## Configure the client

==mo2taman's part.==
