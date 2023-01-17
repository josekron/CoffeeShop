const { TopologyDescriptionChangedEvent } = require("mongodb")
const { statusOrderType } = require("../../model/order/order")
const OrderResponse = require("../../model/order/orderResponse")
const {generateOrderID, secondsToMinutes} = require("../../util/orderutil")
const PrinterService = require("../../util/service/printerService")
const BaristaService = require("../barista/baristaService")
const RecipeService = require("../recipe/recipeService")

/**
 * OrderService: service in charge of process the orders
 */
module.exports = class OrderService {

    constructor(dbManager){
        this.dbManager = dbManager
        this.recipeService = new RecipeService(dbManager)
        this.baristaService = new BaristaService(dbManager)
        this.printerService = new PrinterService()
    }

    /**
     * processOrder: it will take an order request and will process it by:
     * 1 - Check the order request is valid
     * 2 - Create an order with an order status = 'pending'
     * 3 - Check ingredients in shop: I decided to let to create a new order even if there are not enough
     *     ingredients in the shop. If there are not enough ingredients, then it will return an exception 
     *     with the orderID and the client will have to come back to the shop and show the order ID 
     *     so a barista can finish the order.
     * 4 - Assign a barista, update order status = 'in process' and make the coffee
     * 5 - Update the order status = 'done' and 'release' barista
     * 
     * @param {*} orderRequest : class OrderRequest
     */
    async processOrder(orderRequest) {
        // Check the Order Request is valid:
        const availableRecipes = await this.recipeService.getAvailableRecipes()
        await this._validateOrderRequest(orderRequest, availableRecipes)

        // Create a new Order:
        let order = await this._createNewOrder(orderRequest)
        console.log('Order created: ', order)

        try {

            // Update ingredients in shop:
            await this.recipeService.updateIngredientsInShop(order.orderRecipes, availableRecipes)


            // Assign order to barista:
            let assignedBarista = await this.baristaService.getAvailableBarista()
            console.log(`Assigning barista ${assignedBarista.name} to order ${order.orderID}`)

            order = await this._updateOrderToInProgress(order.orderID, assignedBarista.name)

            // Make order:
            const totalTimeSec = await this._makeOrder(order, assignedBarista, availableRecipes)
            console.log(`Barista ${assignedBarista.name} is making the order ${order.orderID}`)

            // Update order to 'done':
            order = await this._updateOrderToDone(order.orderID)
            await this.baristaService.releaseBarista(assignedBarista.id)
            console.log(`The order ${order.orderID} is done`)

            return new OrderResponse(order.clientName, assignedBarista.name, order.orderID, order.orderRecipes, secondsToMinutes(totalTimeSec))

        } catch(error) {
            throw new Error(`An error occurred. Go to the shop and show your order ID ${order.orderID}`)
        }
    }

    /**
     * _makeOrder: the barista make the order, print it and return the total time in seconds
     * @param {*} order 
     * @param {*} barista 
     * @param {*} availableRecipes 
     * @returns totalTime in seconds
     */
    async _makeOrder(order, barista, availableRecipes) {

        let totalTime = 0
        for(let orderRecipe of order.orderRecipes) {
            totalTime += availableRecipes.filter((x => x.name))[0].timeSec * orderRecipe.quantity
        }
        
        let additionalTime = order.orderRecipes.map(x => x.quantity).reduce((o1, o2) => o1 + o2) - 1
        totalTime += (additionalTime * 30) //TODO:: 30 should be a constant in the app configuration

        this.printerService.printOrder(order, barista, totalTime)

        return totalTime
    }

    async _validateOrderRequest(orderRequest, availableRecipes) {
        let validationOrderRequest = orderRequest.isValidOrderRequest(availableRecipes.map(x => x['name']))
        if(!validationOrderRequest.isValid) {
            throw new Error(validationOrderRequest.errorDescription)
        }
    }

    async _updateOrderToDone(orderID) {
        const conn = await this.dbManager.getConnection()
        const db = conn.db()

        await db.collection('orders').updateOne({orderID: orderID}, {$set: {statusOrder: statusOrderType.DONE}})
        return await this._findOrderByOrderID(orderID)
    }

    async _updateOrderToInProgress(orderID, baristaName) {
        const conn = await this.dbManager.getConnection()
        const db = conn.db()

        await db.collection('orders').updateOne({orderID: orderID}, {$set: {barista: baristaName, statusOrder: statusOrderType.IN_PROCESS}})
        return await this._findOrderByOrderID(orderID)
    }

    async _createNewOrder(orderRequest){
        const conn = await this.dbManager.getConnection()
        const db = conn.db()

        orderRequest.statusOrder = statusOrderType.IN_PROCESS
        orderRequest.orderID = generateOrderID(orderRequest.clientName)

        let order = await db.collection('orders').insertOne(orderRequest)
        return await this._findOrderByID(order.insertedId)
    }

    async _findOrderByOrderID(id) {
        const conn = await this.dbManager.getConnection()
        const db = conn.db()

        return await db.collection('orders').findOne({orderID: id})
    }

    async _findOrderByID(id) {
        const conn = await this.dbManager.getConnection()
        const db = conn.db()

        return await db.collection('orders').findOne({_id: id})
    }

}