const express = require('express');
const cors = require('cors');
require('dotenv').config();
const setupSwagger = require('../config/swagger');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.middlewares();
        this.routes();
        this.swagger();
    }

    middlewares() {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.static('public'));
    }

    routes() {
        this.app.use('/api/usuarios', require('../routes/usuarios'));
    }

    swagger() {
        setupSwagger(this.app);
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`> Server ejecutándose en el puerto: ${this.port}`);
            console.log(`> Documentación Swagger disponible en http://localhost:${this.port}/api-docs`);
        });
    }
}

module.exports = Server;
