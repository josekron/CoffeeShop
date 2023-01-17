/**
 * Recipe: class that represent a recipe (coffee)
 */
module.exports = class Recipe {

    constructor(name, ingredients, timeSec){
        this.name = name
        this.ingredients = ingredients
        this.timeSec = timeSec
    }
}