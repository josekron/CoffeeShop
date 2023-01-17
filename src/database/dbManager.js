const { MongoClient } = require('mongodb');

module.exports = class DatabaseManager {

    constructor(dbConfig) {
        this.dbConfig = dbConfig
        this._connection = null
    }

    async getConnection() {
        if(!this._connection) {
            let url = this.dbConfig.host + ":" + this.dbConfig.port + "/" + this.dbConfig.database
            this._connection = await MongoClient.connect(url, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
              })
        }

        return this._connection
    }

}