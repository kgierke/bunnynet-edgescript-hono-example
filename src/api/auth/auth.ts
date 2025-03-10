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
  (c) => authService(c).authClient.handler(c.req.raw),
);

export default app;
