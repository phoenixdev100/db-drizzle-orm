import * as dotenv from "dotenv";
dotenv.config();

const url = process.env.DATABASE_URL ?? "";

function getDialect(): "postgresql" | "mysql" | "sqlite" | "neon" {
    if (url.startsWith("postgresql://") || url.startsWith("postgres://")) {
        // Neon URLs contain .neon.tech
        if (url.includes(".neon.tech")) return "neon";
        return "postgresql";
    }
    if (url.startsWith("mysql://") || url.startsWith("mysql2://")) return "mysql";
    // SQLite: a file path like ./dev.db or file:./dev.db or just a filename
    return "sqlite";
}

export const dialect = getDialect();

// ── PostgreSQL (pg / node-postgres) ──────────────────────────────────────────
async function buildPostgres() {
    const { Pool } = await import("pg");
    const { drizzle } = await import("drizzle-orm/node-postgres");
    const pool = new Pool({ connectionString: url });
    return { db: drizzle(pool), close: () => pool.end() };
}

// ── Neon serverless ───────────────────────────────────────────────────────────
async function buildNeon() {
    const { neon } = await import("@neondatabase/serverless");
    const { drizzle } = await import("drizzle-orm/neon-http");
    const sql = neon(url);
    const db = drizzle(sql);
    return { db, close: async () => {} };
}

// ── MySQL (mysql2) ────────────────────────────────────────────────────────────
async function buildMysql() {
    const mysql = await import("mysql2/promise");
    const { drizzle } = await import("drizzle-orm/mysql2");
    const pool = mysql.createPool(url);
    return { db: drizzle(pool), close: () => pool.end() };
}

// ── SQLite (better-sqlite3) ───────────────────────────────────────────────────
async function buildSqlite() {
    const Database = (await import("better-sqlite3")).default;
    const { drizzle } = await import("drizzle-orm/better-sqlite3");
    const sqlite = new Database(url.replace(/^file:/, ""));
    const db = drizzle(sqlite);
    return { db, close: () => sqlite.close() };
}

let _instance: { db: any; close: () => any } | null = null;

export async function getDb() {
    if (_instance) return _instance;
    switch (dialect) {
        case "neon":         _instance = await buildNeon();     break;
        case "postgresql":   _instance = await buildPostgres(); break;
        case "mysql":        _instance = await buildMysql();    break;
        case "sqlite":       _instance = await buildSqlite();   break;
    }
    return _instance!;
}