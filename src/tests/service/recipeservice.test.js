const {MongoClient} = require('mongodb');
const RecipeService = require("../../service/recipe/recipeService")
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

  it('should return all available recipes', async () => {
    recipeService = new RecipeService(mockDBManager)
    let availableRecipes = await recipeService.getAvailableRecipes()
    expect(availableRecipes).not.toBeNull()
    expect(availableRecipes.length > 0).toEqual(true)
  })

  it('substract a quantity of an ingredient', async () => {
    recipeService = new RecipeService(mockDBManager)
    let ingredients = await recipeService._getAllIngredients()
    expect(ingredients).not.toBeNull()
    expect(ingredients.length > 0).toEqual(true)

    let orderRecipes = [
        {
            name: 'Americano',
            quantity: 1
        }
    ]

    await recipeService.updateIngredientsInShop(orderRecipes)
    let updatedIngredients = await recipeService._getAllIngredients()

    let oldWater = ingredients.filter(x => x.name == 'water')[0]
    let updatedWater = updatedIngredients.filter(x => x.name == 'water')[0]
    expect(updatedWater.quantity).toEqual(oldWater.quantity - 100)

    let oldCoffee = ingredients.filter(x => x.name == 'coffee')[0]
    let updatedCoffee = updatedIngredients.filter(x => x.name == 'coffee')[0]
    expect(updatedCoffee.quantity).toEqual(oldCoffee.quantity - 7)
  })


  
})