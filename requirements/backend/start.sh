#!/bin/sh

#Exit upon cmd failure
set -e

echo "Running Prisma migrations..."
npx prisma migrate deploy

echo "Starting NestJs server..."

exec node dist/main.js