/**
 * Barista: class that represent a barista that will make the coffee.
 */
module.exports = class Barista {
    constructor(id, name, isBusy) {
        this.id = id
        this.name = name
        this.isBusy = isBusy ? isBusy : false
    }

    getIsBusy() {
        return this.isBusy
    }

    setIsBusy(isBusy) {
        this.isBusy = isBusy
    }
}