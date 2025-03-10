import { build } from "esbuild";
import esbuildPluginNodeProtocolImports from "esbuild-plugin-node-protocol-imports";
import fs from "node:fs/promises";
import { builtinModules } from "node:module";

const MINIFY = process.env.MINIFY === "false" ? false : true;

const allBuiltinModules = [
  ...builtinModules,
  ...builtinModules.map((builtinModule) => `node:${builtinModule}`),
];

await fs.rm("dist", {
  recursive: true,
  force: true,
});

await build({
  banner: {
    js: 'import * as process from "node:process";import { Buffer } from "node:buffer";globalThis.process ??= process;globalThis.Buffer ??= Buffer;globalThis.global ??= globalThis;',
  },
  bundle: true,
  define: { "process.env.NODE_ENV": '"production"' },
  entryPoints: ["src/handler.ts"],
  external: allBuiltinModules,
  format: "esm",
  keepNames: !MINIFY,
  minify: MINIFY,
  outfile: "dist/script.js",
  packages: "bundle",
  platform: "node",
  sourcemap: !MINIFY,
  target: "node20.17.0",
  plugins: [esbuildPluginNodeProtocolImports],
});
