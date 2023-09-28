/**
 * OrderRequest: class that represent a request coming from the client (API)
 */
module.exports = class OrderRequest {

    constructor (clientName, orderRecipes) {
        this.clientName = clientName
        this.orderRecipes = orderRecipes
    }

    /**
     * isValidOrderRequest: check if the request is valid. To be valid:
     * - clientName is mandatory
     * - Each recipe should contain a name and a quantity
     * - Each recipe should be available (in the database)
     * 
     * @param {*} availableRecipes 
     * @returns 
     */
    isValidOrderRequest(availableRecipes) {
        const validation = {
            isValid: true,
            errorDescription: false
        }
        if (!this.clientName || !this.orderRecipes) {
           validation.isValid = false
           validation.errorDescription = 'Client name and recipes can not be empty in an order request'
        }

        if(validation.isValid) {
            for(let recipe of this.orderRecipes) {
                if(!recipe.name || !recipe.quantity) {
                    validation.isValid = false
                    validation.errorDescription = 'A recipe in an order request has to contain the name and the quantity'
                    break;
                }
                else if(!availableRecipes.includes(recipe.name)) {
                    validation.isValid = false
                    validation.errorDescription = `Recipe ${recipe.name} is not available`
                    break;
                }
            }
        }

        return validation
    }
}