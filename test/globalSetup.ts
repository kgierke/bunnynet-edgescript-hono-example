import { GenericContainer } from "testcontainers";
import timeSpan from "time-span";
import { type } from "node:os";

global.containers = [];
global.network = null;

export async function setup() {
  console.log("\n[Setup] Starting containers...");
  const end = timeSpan();

  const postgresContainer = await initPostgres();
  global.containers.push(postgresContainer);

  console.log(`[Setup] Containers started. (${end.seconds().toPrecision(2)}s)`);
}

async function initPostgres() {
  const POSTGRES_USER = "admin";
  const POSTGRES_PASSWORD = "postgres";
  const POSTGRES_DB = "default";

  const container = new GenericContainer("postgres:17-alpine")
    .withExposedPorts(5432)
    .withEnvironment({
      POSTGRES_USER,
      POSTGRES_PASSWORD,
      POSTGRES_DB,
    });

  if (type() === "Linux") {
    console.log("Running on Linux, using tmpFs for Postgres data");
    container.withTmpFs({ "/var/lib/postgresql/data": "" });
  }

  const startedContainer = await container.start();

  process.env.DATABASE_URL = `postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:${startedContainer.getMappedPort(5432)}/${POSTGRES_DB}`;

  return startedContainer;
}
