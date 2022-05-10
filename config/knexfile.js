module.exports = {
	client: 'pg',
	connection: {
		host : process.env.DB_HOST,
		user : process.env.DB_USER,
		password : process.env.DB_PASSWORD,
		database : process.env.DB_NAME,
		port: process.env.DB_PORT | 5432,
		application_name: 'Tomo-Api'
	},
	pool: {
		min: 2,
		max: parseInt(process.env.DB_MAX_POOL, 10),
		propagateCreateError: false
	}
};