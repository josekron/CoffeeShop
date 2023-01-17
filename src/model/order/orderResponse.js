/**
 * OrderResponse: class that represent a response from the OrderService to return to the client
 * 
 * We return a new OrderResponse instead of a Order because we should not return internal attributes 
 * like '_id' or 'statusOrder' to the client.
 */
module.exports = class OrderResponse {
    constructor(clientName, barista, orderID, orderRecipes, totalTime) {
        this.clientName = clientName
        this.barista = barista
        this.orderID = orderID
        this.orderRecipes = orderRecipes
        this.totalTime = totalTime
    }
}