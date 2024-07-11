import { MongoClient } from "mongodb";

const connectionString = process.env.MONGODB_URL;
const dbString = process.env.MONGODB_DB;

const prepareDb = async (db) => {
  await (
    await db.collection("songs")
  ).createIndex({ title: 1 }, { collation: { locale: "en", strength: 2 } });
};

if (!connectionString) {
  console.error('"MONGODB_URL" env var not found!');
}

if (!dbString) {
  console.error('"MONGODB_DB" env var not found!');
}

const client = new MongoClient(connectionString);

let conn;
try {
  conn = await client.connect();
} catch (e) {
  console.error(e);
}

const db = conn.db(dbString);

await prepareDb(db);

export default db;
