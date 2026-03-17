<h1 align="center">Master Database Architecture</h1>

<p align="center">
  <strong>A universal database adapter and schema manager powered by Drizzle ORM.</strong><br>
  <em>Designed for seamless switching between PostgreSQL, MySQL, Neon Serverless, and SQLite.</em>
</p>

---

<h2 align="center">🚀 Overview</h2>

This project is a centralized database layer that automatically detects your database provider from a single connection string and connects using the optimal runtime driver. It eliminates the need to rewrite database connection logic when switching from local development (SQLite) to production (Neon/Postgres).

### ✨ Features
- **Auto-Detection**: Dynamically switches database drivers based on your `.env` connection string.
- **Dialect-Aware Schemas**: Write your schema once; the system exports the correct dialect (Postgres, MySQL, SQLite) automatically.
- **Serverless Ready**: Native support for `@neondatabase/serverless` for cold-start optimized edge deployments.
- **Zero Config Type-Safety**: End-to-end TypeScript integration via `tsx`.
- **Master Studio**: Built-in visual dashboard for database management (powered by `drizzle-kit studio` under the hood).

---

<h2 align="center">📦 Getting Started</h2>

Follow these steps from scratch to get the Master Database running locally or on your VPS.

### 1. Clone the Repository
```bash
git clone https://github.com/phoenixdev100/db-drizzle-orm.git
cd db-drizzle-orm
```

### 2. Install Dependencies
Install all the required database drivers (Postgres, MySQL, SQLite, Neon) and developer tools.
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file at the root of the project:
```bash
## Linux / macOS
touch .env

## Windows
ni .env
```
Open `.env` and paste **ONE** of the following URLs. The application will automatically detect the database type based on the URL format.

```env
# Option A: NeonDB (Serverless Postgres) - Recommended for Cloud
DATABASE_URL=postgresql://user:pass@ep-hostname.aws.neon.tech/mydb?sslmode=require

# Option B: Standard PostgreSQL - For VPS / Local Docker
# DATABASE_URL=postgresql://user:password@localhost:5432/mydb

# Option C: MySQL / PlanetScale
# DATABASE_URL=mysql://user:password@localhost:3306/mydb

# Option D: SQLite (Local File) - Fastest for quick local testing
# DATABASE_URL=./dev.db
```

### 4. Define Your Database Schema
Open `src/schema.ts` and define your tables. The file is pre-configured to handle `pg`, `mysql`, and `sqlite` tables based on your `.env`.

**Example:**
```typescript
import { pgTable, serial, text } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    name: text("name"),
});
```

### 5. Push Schema to Database
Once your schema is written, apply the changes directly to your database:
```bash
npx drizzle-kit push
```
*Note: If your schema file is completely empty, it will drop/remove the tables and say "No changes applied" or "Changes applied".*

### 6. Run Your Queries
Open `src/index.ts` and write your application logic using the `getDb()` function, which automatically resolves the correct driver pool.
To execute it, run:
```bash
npm start
```

---

<h2 align="center">🎛️ Master Studio (GUI)</h2>

Need a graphical interface to view, edit, and manage the data in your database? The project comes with a built-in admin dashboard.

Start the UI Dashboard by running the following command in your terminal:
```bash
npx drizzle-kit studio
```
This will start a local server and automatically provide a link (usually `https://local.drizzle.studio`) for you to open in your browser. *Note: On remote VPS servers without a desktop environment, you must use SSH Port Forwarding or configure it to bind to `0.0.0.0` to access the studio.*

---

<h2 align="center">🏗️ Project Structure</h2>

```text
/
├── .env                  # Secrets and Database connection string
├── drizzle.config.ts     # Auto-detected ORM configuration for CLI actions
├── src/
│   ├── db.ts             # Connection pooler & dynamic driver loader
│   ├── schema.ts         # Database table definitions
│   └── index.ts          # Application entry point/test script
├── package.json          # Node dependencies (pg, mysql2, better-sqlite3)
└── LICENSE               # MIT License
```

---

<h2 align="center">📜 License</h2>

This project is licensed under the **MIT License** - see the `LICENSE` file for details.
<br>
**Copyright &copy; 2026 Deepak**
