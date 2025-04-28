import { ENVIRONMENT, MONGODB_URI, PORT } from "@env";

export default {
  ENVIRONMENT: ENVIRONMENT || "development",
  MONGODB_URI:
    MONGODB_URI ||
    "mongodb+srv://dodowenzel:MBSKOnW8UipvlYYH@cursos-online.oz1cz2p.mongodb.net/cursosdb?retryWrites=true&w=majority",
  PORT: PORT || "3000",
};
