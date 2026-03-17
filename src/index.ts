import { getDb } from "./db";

async function main() {
    const { db, close } = await getDb();

    console.log("Connected to the database!");
    
    // Add your database queries here

    await close();
}

main();