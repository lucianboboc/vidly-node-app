// require('winston-mongodb');
require('express-async-errors');
const winston = require("winston");

module.exports = () => {
	winston.add(new winston.transports.File({filename: 'logfile.log', handleExceptions: true}));
	winston.add(new winston.transports.Console({colorize: true, prettyPrint: true}));

	process.on('uncaughtRejection', (err) => {
		process.env
		throw ex;
	})
	// winston.add(new winston.transports.MongoDB({db: 'mongodb://localhost:27017/vidly'}));
};
