#!/bin/sh

source .env

# Check if ALLOW_MIGRATION_DATA_LOSS is set to YES
if [ "$ALLOW_MIGRATION_DATA_LOSS" = "YES" ]; then
    npx --yes prisma db push --skip-generate --accept-data-loss
else
    npx --yes prisma db push --skip-generate
fi

node server.js