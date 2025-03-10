import { Hono } from "hono";
import { cors } from "hono/cors";
import { authService } from "../../services/auth.js";

const app = new Hono<{ Bindings: HonoBindings }>();

app.on(
  ["POST", "GET", "OPTIONS"],
  "/*",
  cors({
    origin: (origin, c) => authService(c).trustedOrigins.find((tO) => origin === tO),
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  }),
  // Make sure the PullZone doesn't cache the response
  async (c, next) => {
    await next();

    c.header("Cache-Control", "no-cache, no-store, must-revalidate");
    c.header("Pragma", "no-cache");
    c.header("Expires", "0");
  },
  (c) => authService(c).authClient.handler(c.req.raw),
);

export default app;
