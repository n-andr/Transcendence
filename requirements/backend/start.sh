#!/bin/sh
set -e

echo "migration deploy"
set +e
attempt=1
max_attempts=10
while [ "$attempt" -le "$max_attempts" ]; do
	npx prisma migrate deploy && break
	echo "database not ready, retrying ($attempt/$max_attempts)..."
	attempt=$((attempt + 1))
	sleep 2
done

npx prisma db seed
set -e

npx prisma generate

# Run compiled JS instead of ts-node
exec node dist/src/main.js