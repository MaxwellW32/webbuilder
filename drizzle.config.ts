import type { Config } from "drizzle-kit";
require('dotenv').config({ path: ".env.local" })

export default {
    schema: "./db/schema.ts",
    out: "./drizzle",
    driver: 'pg',
    dbCredentials: {
        connectionString: process.env.DATABASE_URL as string
    }
} satisfies Config;

