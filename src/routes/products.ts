import { Hono } from "hono";
import { z } from "zod";
import { browseProducts } from "../services/product.service";

const app = new Hono();
const schema = z.object({
    limit: z.coerce.number().min(1).max(100).default(20),
    cursor: z.string().optional(),
    snapshot: z.string().optional(),
    category: z.string().optional(),
});

app.get("/", async (c) => {
    const query = schema.parse(c.req.query());

    const snapshot = query.snapshot ?? new Date().toISOString();

    const result = await browseProducts({
        limit: query.limit,
        cursor: query.cursor,
        snapshot,
        category: query.category,
    });

    return c.json({
        snapshot,
        ...result,
    });
});

app.get("/update", async (c) => { 
	
})

export default app;
