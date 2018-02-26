# Schedule API

A schedule manager used for workers to interact with data related to their work shifts. This RESTful API was built to be used with a web or mobile application interfacing with it. Data can be accessed by following specifications laid out within the OpenAPI based documentation that can be found here: [API Specifications](https://schedule-api-196500.appspot.com/)

## Details
Users in the system have the role of either 'manager' or 'employee'. Managers have access to all paths specified within the documentation as well as write access. Employees only have read access. Data is returned in json format.

The basic structure of the API is as follows.
1. User makes a call to the endpoint.
2. Based on the call, the express application routes the call to the relevant controller function.
3. The controller function manages the flow of logic. Starting with role verification, database calls and any other additional logic that is necessary.
4. Once the data in retrieved, the controller sends the data back to the user in json format.
5. If an error is thrown, a 400 status error message is sent to the user.

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

### Connecting to MongoDB

To connect to the database remotely, you will need to install mongoDB on your device. Once installed, Use your credentials with the following commands.

To connect using the mongo shell: ```mongo ds247698.mlab.com:47698/schedule-api-db -u <dbuser> -p <dbpassword> ```


## Running the tests

To run unit tests, you will need to install project dependencies using ```npm install```

Once the mocha node_module is installed, you can run the unit tests by running
```node_modules/mocha/bin/mocha test```


## Built With

* [node.js](https://nodejs.org) - Runtime Engine
* [express.js](https://expressjs.com/) - Web and API framework
* [Swagger](https://swagger.io/) - API specification framework
* [MongoDB](https://www.mongodb.com/) - Document oriented database

## Deployed With

* [Google App Engine](https://cloud.google.com/appengine/) - Application Hosting Platform
* [mLab](https://mlab.com) - Database Hosting Platform
