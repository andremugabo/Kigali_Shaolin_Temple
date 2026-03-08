const Sequelize = require('sequelize');
const dotenv = require('dotenv');
const dns = require('dns');

// Force IPv4 as a priority (Fixes ENETUNREACH/ECONNREFUSED on Render/Supabase)
if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder('ipv4first');
}

dotenv.config();

const sequelize = process.env.DB_HOST
    ? (() => {
        console.log(`📡 [DB]: Connecting via individual settings to host: ${process.env.DB_HOST}`);
        return new Sequelize(
            process.env.DB_NAME || 'postgres',
            process.env.DB_USER || 'postgres',
            process.env.DB_PASS,
            {
                host: process.env.DB_HOST,
                port: process.env.DB_PORT || 5432,
                dialect: 'postgres',
                logging: false,
                dialectOptions: {
                    ssl: {
                        require: true,
                        rejectUnauthorized: false,
                    },
                },
            }
        );
    })()
    : process.env.DATABASE_URL
        ? (() => {
            const url = process.env.DATABASE_URL;
            const redactedUrl = url.replace(/:([^@]+)@/, ':****@');
            console.log(`📡 [DB]: Connecting via DATABASE_URL: ${redactedUrl}`);
            return new Sequelize(url, {
                dialect: 'postgres',
                logging: false,
                dialectOptions: {
                    ssl: {
                        require: true,
                        rejectUnauthorized: false,
                    },
                },
            });
        })()
        : (() => {
            console.warn('⚠️ [DB]: No production DB settings found. Defaulting to localhost (likely to fail on Render).');
            return new Sequelize(
                process.env.DB_NAME || 'kst_db',
                process.env.DB_USER || 'kst_admin',
                process.env.DB_PASS || 'password',
                {
                    host: process.env.DB_HOST || 'localhost',
                    dialect: 'postgres',
                    logging: false,
                }
            );
        })();

module.exports = sequelize;
