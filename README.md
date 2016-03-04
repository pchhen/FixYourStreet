# FixYourStreet
COMEM Web Services 2016 Project
[https://github.com/SoftEng-HEIGVD/Teaching-HEIGVD-CM_WEBS-2016](https://github.com/SoftEng-HEIGVD/Teaching-HEIGVD-CM_WEBS-2016)

http://www.iflux.io/use-case/2015/02/03/citizen-engagement.html

Please **REWRITE** this README.
It should include a brief explanation of the purpose of your API and instructions on how to run it locally.

## Requirements

## API Documentation

/public/apidoc

run nodejs server and go to root url: localhost:3000

Case sensitive
## Installation

mongoimport --db test --collection issues --file default_example_issues.json
mongoimport --db test --collection issueTypes --file default_example_issueTypes.json
mongoimport --db test --collection users --file default_example_users.json

```
grunt
```
## Example of queries
### Get the list of staff

```http
GET  /api/v1/users?role=staff HTTP/1.1
```
### Get the list of issues raised by a particular user
```http
GET  /api/v1/issues?author=joe HTTP/1.1
```
### Get the list of issues of a certain type
```http
GET  /api/v1/issues?type=street HTTP/1.1
```
### Get the list of issues in a particular region
```http
GET  /api/v1/issues?near=6.5,46.58&distance=2000 HTTP/1.1
```
### Get the list of issues solved between two dates
```http
GET  /api/v1/issues?dateStatusIs=solved&dateSince=:since&dateUntil=:until HTTP/1.1
```
### Get the list of issues created between two dates that are still unresolved.
```http
GET  /api/v1/issues?statusIsNot=solved&dateStatusIs=created&dateSince=:since&dateUntil=:until HTTP/1.1
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
GET  /api/v1/users?issueStatusIs=created&order=mostFirst&limit=10 HTTP/1.
```
### Get the list of users who have solved most issues.
```http
GET  /api/v1/users?issueStatusIs=solved&limit=10 HTTP/1.1
```
### Get the list of users who have the least assigned issues not yet solved or rejected.
```http
GET   /api/v1/users?issueStatusIsNot=(solved|rejected)&order=leastFirst&limit=10 HTTP/1.1
```
