import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema"

require('dotenv').config()

const pool = new Pool({
    connectionString: process.env.DATABASE_URL as string,
});

export const db = drizzle(pool, { schema });