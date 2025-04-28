import { MongoClient } from "mongodb";
import { MONGODB_URI } from "./config";

let databaseConnection: any = null;

export async function getDatabaseConnection() {
  if (databaseConnection) {
    return databaseConnection;
  }
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  databaseConnection = client.db("cursos-online");
  return databaseConnection;
}
