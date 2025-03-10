import { drizzle as neonDrizzle } from "drizzle-orm/neon-http";
import { drizzle as postgresDrizzle } from "drizzle-orm/node-postgres";
import { helpers } from "../../helpers.js";
import * as schema from "./schema.js";

export const dbService = (context?: HonoContext) => {
  const { getEnv } = helpers(context);
  let dbClient;

  if (process.env.NODE_ENV === "production") {
    dbClient = neonDrizzle(getEnv("DATABASE_URL"), { schema });
  } else {
    dbClient = postgresDrizzle(getEnv("DATABASE_URL"), { schema });
  }

  return {
    schema,
    dbClient,
  };
};
