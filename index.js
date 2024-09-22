const winston = require('winston');
const express = require('express');
const app = express();

require('./startup/validation');
const registerLogger = require('./startup/logging');
const config = require('./startup/config');
const registerRoutes = require('./startup/routes');
const connectDB = require('./startup/db');

registerLogger();
config();
registerRoutes(app);
connectDB();

const port = process.env.PORT || 3000;
const server = app.listen(port, () => winston.info(`Listening on port ${port}...`));

module.exports = server;