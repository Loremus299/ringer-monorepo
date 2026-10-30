import { drizzle } from "drizzle-orm/postgres";

const db = drizzle(process.env.DATABASE_URL!);
export default db;
