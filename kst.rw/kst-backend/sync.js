const { sequelize } = require('./src/models');

const syncDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');

        // Sync all models
        // alter: true will check current state of table and perform necessary changes to match model
        // force: true will drop tables and recreate them (Use with caution!)
        await sequelize.sync({ alter: true });

        console.log('All models were synchronized successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Unable to connect to the database or sync models:', error);
        process.exit(1);
    }
};

syncDatabase();
