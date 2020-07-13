const mongoose = require('mongoose');
const config = require('../config')

class Connection {
    constructor () {
        this.connection = null
    }

    async init () {
        try {
            this.connection = await mongoose.connect(config.mongoose.connectionUrl, { 
                useUnifiedTopology: true,
                useNewUrlParser: true
            })
            console.info('Database connection successful')
        } catch (e) {
            console.error(e);
            process.exit(1);
        }
        
    }
}

exports.connection = new Connection();