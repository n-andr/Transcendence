import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: 'dist/prisma/schema.prisma',
  seed: {
    run: 'node dist/prisma/seed.js',
  },
})