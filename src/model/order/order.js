/**
 * Order: class that represent an order made by a client
 */
module.exports = class Order {

    static statusOrderType = {
        PENDING: 'pending',
        IN_PROCESS: 'in process',
        DONE: 'done'
    }
    
    constructor(clientName, orderID, recipesOrder, baristaID) {
        this.clientName = clientName
        this.orderID = orderID
        this.recipesOrder = recipesOrder
        this.baristaID = baristaID
        this.statusOrder = statusOrderType.PENDING
    }

    setStatusOrderToInProcess() {
        this.statusOrder = statusOrderType.IN_PROCESS
    }

    setStatusOrderToDONE() {
        this.statusOrder = statusOrderType.DONE
    }
}