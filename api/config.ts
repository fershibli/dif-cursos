import {
  ENVIRONMENT as ENVIRONMENT_ENV,
  MONGODB_URI as MONGODB_URI_ENV,
  PORT as PORT_ENV,
} from "@env";

export const ENVIRONMENT = ENVIRONMENT_ENV || "development";
export const MONGODB_URI =
  MONGODB_URI_ENV ||
  "mongodb+srv://dodowenzel:MBSKOnW8UipvlYYH@cursos-online.oz1cz2p.mongodb.net/cursosdb?retryWrites=true&w=majority";
export const PORT = PORT_ENV || "3000";
