import { MongoClient, ObjectId } from "mongodb";

const PORT = process.env.PORT || 3000;
const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://dodowenzel:MBSKOnW8UipvlYYH@cursos-online.oz1cz2p.mongodb.net/cursosdb?retryWrites=true&w=majority";

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
