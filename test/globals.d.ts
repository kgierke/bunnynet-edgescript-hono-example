import type { StartedTestContainer } from "testcontainers";

declare global {
  // eslint-disable-next-line no-var
  var containers: StartedTestContainer[];
}
