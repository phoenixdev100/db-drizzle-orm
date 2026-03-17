import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config();

const url = process.env.DATABASE_URL ?? "";

function getDialect(): "postgresql" | "mysql" | "sqlite" {
    if (url.startsWith("mysql://") || url.startsWith("mysql2://")) return "mysql";
    if (url.startsWith("postgresql://") || url.startsWith("postgres://")) return "postgresql";
    return "sqlite";
}

export default {
    schema: "./src/schema.ts",
    out: "./drizzle",
    dialect: getDialect(),
    dbCredentials: {
        url,
    },
} satisfies Config;