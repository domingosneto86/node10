const connection = {
	host : process.env.DB_HOST,
	user : process.env.DB_USER,
	password : process.env.DB_PASSWORD,
	database : process.env.DB_NAME,
	port: process.env.DB_PORT | 5432,
	application_name: 'Tomo-Api'
}

console.log('conn', connection);
console.log('db_max_pool', process.env.DB_MAX_POOL);

module.exports = {
	client: 'pg',
	connection: connection,
	pool: {
		min: 2,
		max: parseInt(process.env.DB_MAX_POOL, 10),
		propagateCreateError: false
	}
};