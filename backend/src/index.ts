import { Hono } from "hono";
import { serve } from "@hono/node-server";

import products from "./routes/products";
import { cors } from "hono/cors";

const app = new Hono();

app.use(
    "*",
    cors({
        origin: ["http://localhost:4321", process.env.FRONTEND_CORS!],
    }),
);

app.route("/products", products);

serve({
    fetch: app.fetch,
    port: Number(process.env.PORT) || 3000,
});

console.log("server running");
