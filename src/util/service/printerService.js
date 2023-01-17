const {secondsToMinutes} = require("../../util/orderutil")

/**
 * PrinterService: service in charge of printing the order
 * 
 * If I had more time, this service will load a template and fill the fields with the order
 */
module.exports = class PrinterService {

    constructor() {}

    printOrder(order, barista, timeSec) {
        let print = `\n----------------------\n`
        print += `client: ${order.clientName} \n`
        print += `barista: ${barista.name} \n`
        print += '\norder:\n\n'

        for(let orderRecipe of order.orderRecipes) {
            print += `${orderRecipe.name} x ${orderRecipe.quantity} \n`
        }

        print += `\n----------------------\n`
        print += `\nTotal time: ${secondsToMinutes(timeSec)}`

        print += `\n\nThank you for your visit!\n`

        console.log(print)
    }
}