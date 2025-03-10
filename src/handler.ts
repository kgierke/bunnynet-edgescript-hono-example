import * as BunnySDK from "@bunny.net/edgescript-sdk";
import process from "node:process";
import app from "./index.js";

const { HOST = "0.0.0.0", PORT = "7000" } = process.env;

console.log("Starting server...");
console.log(`Listening on ${HOST}:${PORT}`);

BunnySDK.net.http.serve(
  {
    hostname: HOST,
    port: parseInt(PORT),
  },
  async (req) =>
    await app.fetch(req, {
      ...process.env,
      request: req,
    }),
);
