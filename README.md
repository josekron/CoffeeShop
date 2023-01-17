### Description

Test Assessment for a Senior Backend role in a tech start-up company.

The assessment consists of designing and implementing an API to order coffee, including minimal testing. 

The API should support the following entities: Ingredients, Recipes, Orders and Baristas.

The required technologies are NodeJs and MongoDB.

Time spent is about 3 hours.

### Technologies

* Node.js
* Express
* MongoDB
* Jest: testing and mocking the database in the tests

### Running locally

* `cd src`
* `npm install`
* `node index.js`

It requires a MongoDB database running locally. Modify the configuration `database.mongoDBConfigLocal` in `src/config/appconfig.js`

It will populate the MongoDB database with the ingredients, recipes and baristas on the start of the application.

### Running locally with Docker compose

* It requires to change `database.mongoDBConfigLocal` to `database.mongoDBConfigDockerCompose` in the instance of `DatabaseManager` in the `index.js` (line 21 and 29).
* `docker compose up -d --build`
* `docker compose down`

It will populate the MongoDB database with the ingredients, recipes and baristas on the start of the application.

### Running the tests

* `cd src`
* `npm test`

Running the test do not require a locally MongoDB database because the database is mocked with Jest.

### API

* Added an endpoint to create an order:

`curl -L -d '{"clientName":"John", "orderRecipes": [{"name": "Americano", "quantity": 2}]}' -H "Content-Type: application/json" -X POST http://localhost:3000/order`

Response:

`{
    "clientName": "John",
    "barista": "Jose",
    "orderID": "rjz51_Jose_2022103",
    "orderRecipes": [
        {
            "name": "Americano",
            "quantity": 2
        }
    ],
    "totalTime": "3:30"
}`

### Design Approach

I decided to follow a DDD (Domain Driven Design) approach and design the system based on the business logic. Therefore, we have the following packages for the models and services:

* barista: contains the logic for managing the baristas
* recipe: contains the logic for recipes and also ingredients, as both are related.
* order: contains the logic for processing orders. The `OrderService` contains the logic for this Test Assessment.

Advantages:

* Easy to understand and easy to extend
* Easy to take apart some logic (for example baristas or recipes) and move them to a new service

### Issues and Improvements

List of improvements I'd have liked to do if I had more time:

* Tests for all the models and services, and not only the minimum required tests for this Test Assessment.
* Better handling of the errors.
* Evaluate if it's worth adding some indexes in MongoDB.
* As I need to populate the database everytime I run the app or the tests, I decided to search recipes and ingredients by `name` instead of `id` in the database.



