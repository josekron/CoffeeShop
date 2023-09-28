/**
 * PopulateDBService: class to populate the MongoDB database.
 * 
 * It receives the config from src/config/appconfig.js
 */
module.exports = class PopulateDBService {

    constructor(dbManager, ingredients, recipes, baristas) {
        this.dbManager = dbManager
        this.ingredients = ingredients
        this.recipes = recipes
        this.baristas = baristas
    }

    /**
     * populateDatabase public function that will populate the MongoDB database by 
     * deleting the collections and populating them again
     */
    async populateDatabase() {
        const conn = await this.dbManager.getConnection()
        const db = conn.db()

        console.log('Populating database...')

        const insertedIngredients = await this._populateIngredients(db, this.ingredients)
        console.log('Inserted ingredients...')

        await this._populateRecipes(db, this.recipes, insertedIngredients)
        console.log('Inserted recipes...')

        await this._populateBaristas(db, this.baristas)
        console.log('Inserted baristas...')

        await this._cleanOrders(db)
        console.log('Cleaned orders...')

        console.log('Populating database finished')
    }

    async _populateIngredients(db, ingredients) {
        const insertedIngredients = []

        const collections = await db.listCollections().toArray()
        if (collections.map(x => x.name).includes('ingredients')) {
            await db.collection('ingredients').drop();
        }

        for(const ingredient of ingredients) {
            const insertedIngredient = await db.collection('ingredients').insertOne(ingredient)
            insertedIngredients.push({name: ingredient.name, ingredientID: insertedIngredient.insertedId})
        }

        return insertedIngredients
    }

    async _populateRecipes(db, recipes, ingredients) {
        const collections = await db.listCollections().toArray()
        if (collections.map(x => x.name).includes('recipes')) {
            await db.collection('recipes').drop();
        }

        for(const recipe of recipes) {
            for(const ingredient of recipe.ingredients) {
                ingredient.ingredientID = ingredients.filter(x => x.name === ingredient.name)[0].ingredientID
            }
            
            await db.collection('recipes').insertOne(recipe)
        }
    }

    async _populateBaristas(db, baristas) {
        const collections = await db.listCollections().toArray()
        if (collections.map(x => x.name).includes('baristas')) {
            await db.collection('baristas').drop();
        }

        for(const barista of baristas) {
            barista.isBusy = false
            await db.collection('baristas').insertOne(barista)
        }
    }

    async _cleanOrders(db) {
        const collections = await db.listCollections().toArray()
        if (collections.map(x => x.name).includes('orders')) {
            await db.collection('orders').drop();
        }
    }
}