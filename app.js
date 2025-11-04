require('dotenv').config();
const sequelize = require('./models/database');
const Server = require('./models/server');

const server = new Server();

sequelize.sync()
    .then(() => {
        console.log('Conexión a la base de datos establecida');
        server.listen();
    })
    .catch((err) => console.log('Error al conectar a la base de datos:', err));

module.exports = server.app;