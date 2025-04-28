declare module "@env" {
  export const ENVIRONMENT: "development" | "production";
  export const MONGODB_URI: string;
  export const PORT: string | undefined;
}
