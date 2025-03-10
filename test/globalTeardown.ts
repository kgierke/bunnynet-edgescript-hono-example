import timeSpan from "time-span";

export async function teardown() {
  const end = timeSpan();
  console.log("\n[Teardown] Stopping containers...");

  await Promise.all(global.containers.map((container) => container.stop({ timeout: 10000 })));

  if (global.network) {
    await global.network.stop();
  }

  console.log(`[Teardown] Containers stopped. (${end.seconds().toPrecision(2)}s)`);
}
