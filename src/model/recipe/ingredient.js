/**
 * Ingredient: class that represent an existing ingredient in our shop
 */
module.exports = class Ingredient {

    constructor(name, description, quantity, measure) {
        this.name = name
        this.description = description
        this.quantity = quantity
        this.measure = measure
    }
}