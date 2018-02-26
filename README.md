# Schedule API

A schedule manager used for workers to interact with data related to their work shifts. This RESTful API was built to be used with a web or mobile application interfacing with it. Data can be accessed by following specifications laid out within the OpenAPI based documentation that can be found here: [API Specifications](https://schedule-api-196500.appspot.com/)

## Details
Users in the system have the role of either 'manager' or 'employee'. Managers have access to all paths specified within the documentation as well as write access. Employees only have read access. Data is returned in json format.

### Making a Call

Calls to add or retrieve data can be made by sending a REST call in whatever method you choose.

Retrieving all employee data can be done by either navigating to [this URL](https://schedule-api-196500.appspot.com/employee) or by running this simple CURL command
```
curl https://schedule-api-196500.appspot.com/employee
```

Keep in mind, to do more complicated calls, you need to include the user_id field within the path to verify what type of user you are. If you are a manager and want to create a user within the system, you would run something like this:
```
curl -H "Content-Type: application/json" -X POST -d '{"name":"userName","role":"employee", "email" : "user@email.com"}' https://schedule-api-196500.appspot.com/{user_id}/employee
```
This call is only successful when the the user_id correlates with a manager


## Running the tests

Explain how to run the automated tests for this system

### Break down into end to end tests

Explain what these tests test and why

```
Give an example
```


## Built With

* [node.js](https://nodejs.org) - Runtime Engine
* [express.js](https://expressjs.com/) - Web and API framework
* [Swagger](https://swagger.io/) - API specification framework
* [MongoDB](https://www.mongodb.com/) - Document oriented database

## Deployed With

* [Google App Engine](https://cloud.google.com/appengine/) - Application Hosting Platform
* [mLab](https://mlab.com) - Database Hosting Platform
