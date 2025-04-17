import { Sequelize } from 'sequelize';

// Create Sequelize instance using environment variables
const sequelize = new Sequelize(
	process.env.POSTGRES_DB,
	process.env.POSTGRES_USER,
	process.env.POSTGRES_PASSWORD,
	{
		host: process.env.PGHOST,
		port: process.env.POSTGRES_PORT || 5432,
		dialect: 'postgres',
		logging: false,
	}
);

const initialize = async () => {
	try {
		// Test connection
		await sequelize.authenticate();
		await sequelize.sync();
		console.log('PostgreSQL database connected via Sequelize');
		return sequelize;
	} catch (error) {
		console.error('Unable to connect to the database:', error);
		throw error;
	}
};
export { sequelize, initialize };
