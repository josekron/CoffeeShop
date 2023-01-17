const Barista = require("../../model/barista/barista");

/**
 * BaristaService: service in charge of managing the baristas 
 */
module.exports = class BaristaService {
    constructor(dbManager){
        this.dbManager = dbManager
    }

    async getAvailableBarista() {
        const conn = await this.dbManager.getConnection()
        const db = conn.db()

        let baristas = await db.collection('baristas').find({'isBusy': false}).toArray()

        if(!baristas.length) {
            throw new Error('No barista available at this moment')
        }

        let chosenBarista = baristas[Math.floor(Math.random() * baristas.length)];

        await db.collection('baristas').updateOne({_id: chosenBarista._id}, {$set: {isBusy: true}})
        chosenBarista = await this._findBaristaByID(chosenBarista._id)
        return new Barista(chosenBarista._id, chosenBarista.name, chosenBarista.isBusy)
    }

    async releaseBarista(id) {
        const conn = await this.dbManager.getConnection()
        const db = conn.db()

        await db.collection('baristas').updateOne({_id: id}, {$set: {isBusy: false}})
        let barista = await this._findBaristaByID(id)
        return new Barista(barista._id, barista.name, barista.isBusy)
    }

    async _findBaristaByID(id) {
        const conn = await this.dbManager.getConnection()
        const db = conn.db()

        return await db.collection('baristas').findOne({_id: id})
    }
}