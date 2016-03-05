# FixYourStreet
COMEM Web Services 2016 Project
[https://github.com/SoftEng-HEIGVD/Teaching-HEIGVD-CM_WEBS-2016](https://github.com/SoftEng-HEIGVD/Teaching-HEIGVD-CM_WEBS-2016)

http://www.iflux.io/use-case/2015/02/03/citizen-engagement.html

Please **REWRITE** this README.
It should include a brief explanation of the purpose of your API and instructions on how to run it locally.

## Requirements

### Node.js and npm
For installation, follow the instructions here : https://nodejs.org/

### MongoDB
For installation, follow precisely the instructions here : https://docs.mongodb.org/manual/administration/install-community/

## API Documentation

/public/apidoc

run nodejs server and go to root url: localhost:3000

Case sensitive

## Run the api REST

### Run the mongoDB database
Run the executable file **mongod** (mongod.exe on windows) which is contained in your mongodb install directory

### Run the node.js server
Go into the project folder with your terminal and run:

```
grunt
```

### Add basic dataset
Run these command from the project folder
```
mongoimport --db project1-development --collection users --file basicDataset/users.json
mongoimport --db project1-development --collection issuetypes --file basicDataset/issuestypes.json
mongoimport --db project1-development --collection issues --file basicDataset/issues.json
```
**Note** if you are using babun on windows the path should be like (if it's not in your path) : "/c/MongoDB/Server/3.2/bin/mongoimport"

## Example of queries
### Get the list of staff

```http
GET  /api/v1/users?role=staff HTTP/1.1
```
### Get the list of issues raised by a particular user
```http
GET  /api/v1/issues?author=milou HTTP/1.1
```
### Get the list of issues of a certain type
```http
GET  /api/v1/issues?type=streetlight HTTP/1.1
```
### Get the list of issues in a particular region
```http
GET  /api/v1/issues?near=8.946594,45.989298&distance=2000 HTTP/1.1
```
### Get the list of issues solved between two dates
```http
GET  /api/v1/issues?dateStatusIs=solved&dateSince=2016-01-01&dateUntil=2016-01-31 HTTP/1.1
```
### Get the list of issues created between two dates that are still unresolved.
```http
GET  /api/v1/issues?statusIsNot=solved&dateStatusIs=created&dateSince=2016-01-01&dateUntil=2016-01-31 HTTP/1.1
```
### Get the history of an issue (list of actions taken on the issue).
```http
GET  /api/v1/issues/:id/actions HTTP/1.1
```
### Get the comments history of an issue
```http
GET  /api/v1/issues/:id/actions/comments HTTP/1.1
```
### Get the statusChanges history of an issue
```http
GET  /api/v1/issues/:id/actions/statusChanges HTTP/1.1
```
### Get the list of users who have created most issues.
```http
GET  /api/v1/users?issueStatusIs=created HTTP/1.
```
Note: The order mostFirst is by default
### Get the list of users who have solved most issues.
```http
GET  /api/v1/users?issueStatusIs=solved HTTP/1.1
```
### Get the list of users who have the least assigned issues not yet solved or rejected.
```http
GET   /api/v1/users?issueStatusIsNot=solved,rejected&assignedStaff=true&order=leastFirst HTTP/1.1
```
