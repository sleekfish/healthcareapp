import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
// In Deno, you MUST use the extension, but typically .ts for logic
// Ensure this file exists as kv_store.tsx or .ts
import * as kv from "./kv_store.tsx";

const app = new Hono();

app.use('*', logger());

app.use(
    "/*",
    cors({
        origin: "*",
        allowHeaders: ["Content-Type", "Authorization"],
        allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        exposeHeaders: ["Content-Length"],
        maxAge: 600,
    }),
);

// Fix TS7006: Add the Context type or let Deno infer it
app.get("/make-server-e9999d5f/health", (c) => {
    return c.json({ status: "ok" });
});

// @ts-ignore: Deno.serve is available at runtime in Deno environments
Deno.serve(app.fetch);