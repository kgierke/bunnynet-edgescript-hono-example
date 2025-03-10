import { Hono } from "hono";
import { prettyJSON } from "hono/pretty-json";
import api from "./api/index.js";

const app = new Hono<{ Bindings: HonoBindings }>();

app.use(prettyJSON());

app.get("/", (c) => {
  return c.json({
    message: "Hello, World Updated!",
    env: c.env.TEST || "No env found",
  });
});

app.route("/api", api);

export default app;
