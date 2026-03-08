#!/bin/sh

# Exit on error
set -e

echo "Starting database synchronization and seeding..."

# Run sync and seed
if [ "$NODE_ENV" = "production" ]; then
  echo "Production mode detected. Running safe sync (alter:true) and seeding..."
  npm run db:sync || echo "Sync failed, continuing..."
  node seed.js || echo "Seeding failed (user likely already exists), continuing..."
else
  echo "Development mode. Running full reset..."
  npm run db:reset
fi

echo "Database is ready. Starting server..."

# Execute the main command
exec "$@"
