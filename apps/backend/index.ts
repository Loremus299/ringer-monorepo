import { serve } from "@hono/node-server";
import { Hono } from "hono/tiny";

const app = new Hono();

app.get("/", (c) => c.text("Hi"));

serve({ fetch: app.fetch, port: 8080 });
