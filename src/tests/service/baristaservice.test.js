const {MongoClient} = require('mongodb');
const BaristaService = require("../../service/barista/baristaService")
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

  it('should find a barista', async () => {
    baristaService = new BaristaService(mockDBManager)
    const barista = await baristaService.getAvailableBarista()
    expect(barista).not.toBeNull()
    expect(barista.name).not.toBeNull()
    expect(barista.isBusy).toEqual(true)
  })

  it('release a barista', async () => {
    baristaService = new BaristaService(mockDBManager)
    let barista = await baristaService.getAvailableBarista()
    expect(barista).not.toBeNull()
    expect(barista.name).not.toBeNull()
    expect(barista.isBusy).toEqual(true)

    barista = await baristaService.releaseBarista(barista.id)
    expect(barista).not.toBeNull()
    expect(barista.name).not.toBeNull()
    expect(barista.isBusy).toEqual(false)
  })

  
})