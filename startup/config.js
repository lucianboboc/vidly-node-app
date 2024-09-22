const config = require('config');

module.exports = () => {
	if (!config.get("jwtPrivateKey")) {
		throw new Error('Missing JWT_SIGN_KEY');
	}
};
