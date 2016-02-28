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


## Installation

```
grunt
```
## Example of queries
### Get the list of staff

```http
GET  /api/v1/users?role=staff HTTP/1.1
```

### Get the list of issues raised by a particular user
### Get the list of issues of a certain type
### Get the list of issues in a particular region
### Get the list of issues solved between two dates
### Get the list of issues created between two dates that are still unresolved.

### Get the history of an issue (list of actions taken on the issue).
### Get the comments history of an issue
### Get the statusChanges history of an issue

### Get the list of users who have created most issues.

### Get the list of users who have solved most issues.
### Get the list of users who have the least assigned issues not yet solved or rejected.
