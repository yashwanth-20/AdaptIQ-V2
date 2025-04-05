import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./configs/schema.js",
  dbCredentials:{
    url:'postgresql://neondb_owner:npg_Ym3oirCAW4vO@ep-green-heart-a8q3busa-pooler.eastus2.azure.neon.tech/neondb?sslmode=require'
  }
});