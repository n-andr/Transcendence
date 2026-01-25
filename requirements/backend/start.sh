#!/bin/sh
set -e

echo "migration deploy"
npx prisma migrate deploy

npx prisma generate

exec npm run start:dev