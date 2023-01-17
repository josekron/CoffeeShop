const Recipe = require("../../model/recipe/recipe")
const Ingredient = require("../../model/recipe/ingredient")

/**
 * RecipeService: service in charge of managing the available recipes
 * and also the ingredients in the shop
 */
module.exports = class RecipeService {

    constructor(dbManager){
        this.dbManager = dbManager
    }

    //
    // Recipes:
    //

    async getAvailableRecipes() {
        const conn = await this.dbManager.getConnection()
        const db = conn.db()

        let results = await db.collection('recipes').find({}).toArray()
        return results.map(x => new Recipe(x.name, x.ingredients, x.timeSec))
    }

    //
    // Ingredients:
    //

    /**
     * updateIngredientsInShop: update the quantity of the ingredients in the shop by 
     * substracting the quantity required by a order recipes.
     * 
     * @param {*} orderRecipes 
     * @param {*} availableRecipes 
     */
    async updateIngredientsInShop(orderRecipes, availableRecipes) {
        if(!availableRecipes) {
            availableRecipes = await this.getAvailableRecipes()
        }

        // return a map <ingredient name, quantity required>
        let ingredientsMap = this._getIngredientsFromOrder(orderRecipes, availableRecipes)
        
        for( const [name, quantity] of ingredientsMap) {
            await this._updateIngredientQuantityByName(name, quantity)
        }
    }

    async _getAllIngredients() {
        const conn = await this.dbManager.getConnection()
        const db = conn.db()

        let results = await db.collection('ingredients').find({}).toArray()
        return results.map(x => new Ingredient(x.name, x.description, x.quantity, x.measure))
    }

    async _updateIngredientQuantityByName(name, quantity) {
        let ingredient = await this._findIngredientByName(name)

        if(ingredient.quantity < quantity) {
            throw new Error(`ingredient ${name} quantity ${quantity} not enough in shop`)
        }

        const conn = await this.dbManager.getConnection()
        const db = conn.db()

        await db.collection('ingredients').updateOne({_id: ingredient._id}, {$set: {quantity: (ingredient.quantity - quantity)}})
    }

    async _findIngredientByName(name) {
        const conn = await this.dbManager.getConnection()
        const db = conn.db()

        return await db.collection('ingredients').findOne({name: name})
    }

    _getIngredientsFromOrder(orderRecipes, availableRecipes) {
        let ingredientsMap = new Map()

        for(let orderRecipe of orderRecipes){
            let recipe = availableRecipes.filter(x => x.name == orderRecipe.name)[0]
            for(let ingredient of recipe.ingredients){
                if(!ingredientsMap.has(ingredient.name)){
                    ingredientsMap.set(ingredient.name, (ingredient.quantity * orderRecipe.quantity))
                }
                else{
                    ingredientsMap.set(ingredient.name, ingredientsMap.get(ingredient.name) + (ingredient.quantity * orderRecipe.quantity))
                }
            }
        }

        return ingredientsMap
    }
}
