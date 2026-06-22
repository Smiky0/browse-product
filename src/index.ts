import { Hono } from "hono";
import { serve } from "@hono/node-server";

import products from "./routes/products";

const app = new Hono();

app.route("/products", products);

serve({
    fetch: app.fetch,
    port: Number(process.env.PORT) || 3000,
});

console.log("server running");
