const { Client } = require("pg");
const { argv } = require("node:process");
require("dotenv/config");

async function main() {
  console.log("seeding...");
  console.log(process.env.DATABASE_URL);
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });
  await client.connect();
  await client.query(`
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  categoryName VARCHAR ( 255 )
)`);
  await client.query(`CREATE TABLE IF NOT EXISTS items(id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,itemName VARCHAR (255),quantity INT,price NUMERIC(10,2), category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL);
`);
  await client.end();
  console.log("done");
}

main();
