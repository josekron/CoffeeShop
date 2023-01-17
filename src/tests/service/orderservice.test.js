const {MongoClient} = require('mongodb');
const OrderRequest = require('../../model/order/orderRequest');
const OrderService = require("../../service/order/orderService")
const PopulateDBService = require("../../database/populateDBService")
const {ingredients, recipes, baristas} = require("../../config/appconfig")

describe('test orderService', () => {
  let connection
  let mockDBManager

  beforeAll(async () => {
    // We create a mock mongoDB and we populate it with ingredients, recipes and baristas
    connection = await MongoClient.connect(globalThis.__MONGO_URI__, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    mockDBManager = {
      connection: connection,
      getConnection: async function () {
        return connection
      }
    }

    populateDBService = new PopulateDBService(mockDBManager, 
      ingredients, recipes, baristas)
    await populateDBService.populateDatabase()

  });

  afterAll(async () => {
    await connection.close();
  })

  it('should return an error due to order request not valid', async () => {
    orderService = new OrderService(mockDBManager)

    // clientName is missing
    let orderRequestMock = new OrderRequest(
      null,
      [
        {
          name: 'Americano',
          quantity: 2
        }
      ]
    )

    try {
      await orderService.processOrder(orderRequestMock)
      fail('order request should have not been processed')

    }catch(error) {
      expect(error.message).toEqual('Client name and recipes can not be empty in an order request')
    }

    // recipe name is missing:
    orderRequestMock = new OrderRequest(
      'John',
      [
        {
          quantity: 2
        }
      ]
    )

    try {
      await orderService.processOrder(orderRequestMock)
      fail('order request should have not been processed')

    }catch(error) {
      expect(error.message).toEqual('A recipe in an order request has to contain the name and the quantity')
    }

    // recipe quantity is missing:
    orderRequestMock = new OrderRequest(
      'John',
      [
        {
          name: 'Americano'
        }
      ]
    )

    try {
      await orderService.processOrder(orderRequestMock)
      fail('order request should have not been processed')

    }catch(error) {
      expect(error.message).toEqual('A recipe in an order request has to contain the name and the quantity')
    }

  })

  it('should return an error due to recipe is not available in the database', async () => {
    orderService = new OrderService(mockDBManager)

    let orderRequestMock = new OrderRequest(
      'John',
      [
        {
          name: 'FakeCoffee',
          quantity: 2
        }
      ]
    )

    try {
      await orderService.processOrder(orderRequestMock)
      expect(true).toBe(false);

    }catch(error) {
      expect(error.message).toEqual(`Recipe ${orderRequestMock.orderRecipes[0].name} is not available`)
    }

  })

  it('should create a new order awith one recipe', async () => {
    orderService = new OrderService(mockDBManager)

    let orderRequestMock = new OrderRequest(
      'Andrea',
      [
        {
          name: 'Americano',
          quantity: 1
        }
      ]
    )
  
    let orderResponse = await orderService.processOrder(orderRequestMock)
    expect(orderResponse.clientName).toEqual(orderRequestMock.clientName)
    expect(orderResponse.orderID).not.toBeNull()
    expect(orderResponse.orderID.includes(orderRequestMock.clientName)).toBe(true);
    expect(orderResponse.barista).not.toBeNull()
    expect(orderResponse.orderRecipes.length).toEqual(orderRequestMock.orderRecipes.length)
    expect(orderResponse.orderRecipes[0].name).toEqual(orderRequestMock.orderRecipes[0].name)
    expect(orderResponse.orderRecipes[0].quantity).toEqual(orderRequestMock.orderRecipes[0].quantity)
    expect(orderResponse.totalTime).toEqual('1:30')

    orderRequestMock = new OrderRequest(
      'Andrea',
      [
        {
          name: 'Americano',
          quantity: 2
        }
      ]
    )
  
    orderResponse = await orderService.processOrder(orderRequestMock)
    expect(orderResponse.clientName).toEqual(orderRequestMock.clientName)
    expect(orderResponse.orderID).not.toBeNull()
    expect(orderResponse.orderID.includes(orderRequestMock.clientName)).toBe(true);
    expect(orderResponse.barista).not.toBeNull()
    expect(orderResponse.orderRecipes.length).toEqual(orderRequestMock.orderRecipes.length)
    expect(orderResponse.orderRecipes[0].name).toEqual(orderRequestMock.orderRecipes[0].name)
    expect(orderResponse.orderRecipes[0].quantity).toEqual(orderRequestMock.orderRecipes[0].quantity)
    expect(orderResponse.totalTime).toEqual('3:30')
  })

  it('should create a new order awith multiple recipes', async () => {
    orderService = new OrderService(mockDBManager)

    let orderRequestMock = new OrderRequest(
      'Andrea',
      [
        {
          name: 'Americano',
          quantity: 1
        },
        {
          name: 'Cappuccino',
          quantity: 1
        }
      ]
    )
  
    let orderResponse = await orderService.processOrder(orderRequestMock)
    expect(orderResponse.clientName).toEqual(orderRequestMock.clientName)
    expect(orderResponse.orderID).not.toBeNull()
    expect(orderResponse.orderID.includes(orderRequestMock.clientName)).toBe(true);
    expect(orderResponse.barista).not.toBeNull()
    expect(orderResponse.orderRecipes.length).toEqual(orderRequestMock.orderRecipes.length)
    expect(orderResponse.orderRecipes[0].name).toEqual(orderRequestMock.orderRecipes[0].name)
    expect(orderResponse.orderRecipes[0].quantity).toEqual(orderRequestMock.orderRecipes[0].quantity)
    expect(orderResponse.orderRecipes[1].name).toEqual(orderRequestMock.orderRecipes[1].name)
    expect(orderResponse.orderRecipes[1].quantity).toEqual(orderRequestMock.orderRecipes[1].quantity)
    expect(orderResponse.totalTime).toEqual('3:30')

    orderRequestMock = new OrderRequest(
      'Andrea',
      [
        {
          name: 'Americano',
          quantity: 3
        },
        {
          name: 'Cappuccino',
          quantity: 2
        }
      ]
    )
  
    orderResponse = await orderService.processOrder(orderRequestMock)
    expect(orderResponse.clientName).toEqual(orderRequestMock.clientName)
    expect(orderResponse.orderID).not.toBeNull()
    expect(orderResponse.orderID.includes(orderRequestMock.clientName)).toBe(true);
    expect(orderResponse.barista).not.toBeNull()
    expect(orderResponse.orderRecipes.length).toEqual(orderRequestMock.orderRecipes.length)
    expect(orderResponse.orderRecipes[0].name).toEqual(orderRequestMock.orderRecipes[0].name)
    expect(orderResponse.orderRecipes[0].quantity).toEqual(orderRequestMock.orderRecipes[0].quantity)
    expect(orderResponse.orderRecipes[1].name).toEqual(orderRequestMock.orderRecipes[1].name)
    expect(orderResponse.orderRecipes[1].quantity).toEqual(orderRequestMock.orderRecipes[1].quantity)
    expect(orderResponse.totalTime).toEqual('9:30')
  })
})