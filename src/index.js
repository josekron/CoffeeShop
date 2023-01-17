const express = require('express');
const bodyParser = require('body-parser');

const {database, ingredients, recipes, baristas} = require("./config/appconfig")
const DatabaseManager = require("./database/dbManager")
const PopulateDBService = require("./database/populateDBService")
const OrderService = require("./service/order/orderService");
const OrderRequest = require('./model/order/orderRequest');


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.post('/order', async (req, res) => {

  let request = req.body
  let orderRequest = new OrderRequest(request['clientName'], request['orderRecipes'])

  let orderService = new OrderService(new DatabaseManager(database.mongoDBConfigLocal))
  let orderResponse = await orderService.processOrder(orderRequest)
  res.send(orderResponse);

});


app.listen(process.env.port || 3000, async function() {
  populateDBService = new PopulateDBService(new DatabaseManager(database.mongoDBConfigLocal), 
    ingredients, recipes, baristas)
  await populateDBService.populateDatabase()

});
console.log('Web Server is listening at port '+ (process.env.port || 3000));