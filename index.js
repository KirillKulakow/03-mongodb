require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config');
const { ContactRouter, AuthRouter, UsersRouter } = require('./router');
const { Authorize } = require('./middlewares/authorize');
const { connection } = require('./database');

const app = express();

async function main() {
    await connection.init();
    
    app.use(morgan('combined'));
    
    app.use(cors());

    app.use((err, req, res, next) => {
        if (!err) return next();
      
        console.error(err);
      
        res.status(500).send({ message: err.message });
    });
    
    app.use(express.json());
    app.use(express.static('public'));
    app.use('/contacts', Authorize, ContactRouter);
    app.use('/auth', AuthRouter);
    app.use('/users', Authorize, UsersRouter)

    app.use((req, res) => {
        res.status(404).send({ message: 'Page not found' });
    });
    
    app.listen(config.server.port, err => err ? console.error(err) : console.info('Started at port ' + config.server.port));
};

main().catch(console.error)
