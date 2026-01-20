const { User } = require('./src/models');
const sequelize = require('./db');

const fixUserSchema = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        // Update User table structure
        await User.sync({ alter: true });

        console.log('User table synced successfully.');
    } catch (error) {
        console.error('Error syncing User:', error);
    } finally {
        await sequelize.close();
    }
};

fixUserSchema();
