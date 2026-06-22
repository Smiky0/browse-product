import { and, desc, eq, lt, or } from "drizzle-orm";

import { db } from "../db/client";
import { products } from "../db/schema";
import { encodeCursor, decodeCursor } from "../utils/cursor";

type BrowseParams = {
    limit: number;
    cursor?: string;
    snapshot: string;
    category?: string;
};

export async function browseProducts({
    limit,
    cursor,
    snapshot,
    category,
}: BrowseParams) {
    const conditions = [lt(products.updatedAt, new Date(snapshot))];
    // point cursor to avoid duplicate content
    if (cursor) {
        const decoded = decodeCursor(cursor);

        conditions.push(
            or(
                lt(products.updatedAt, new Date(decoded.updatedAt)),

                and(
                    eq(products.updatedAt, new Date(decoded.updatedAt)),

                    lt(products.id, decoded.id),
                ),
            )!,
        );
    }
    // if category exists, add it
    if (category) {
        conditions.push(eq(products.category, category));
    }
    // get the data from db
    const rows = await db
        .select()
        .from(products)
        .where(and(...conditions))
        .orderBy(desc(products.updatedAt), desc(products.id))
        .limit(limit + 1);

    // check if more content available (for pagination)
    const hasMore = rows.length > limit;
    const items = hasMore ? rows.slice(0, limit) : rows;

    let nextCursor: string | null = null;
	// if more data available
    if (hasMore) {
        const last = items.at(-1)!;
		// point cursor to the last element
        nextCursor = encodeCursor({
            updatedAt: last.updatedAt.toISOString(),
            id: last.id,
        });
    }
    return {
        items,
        nextCursor,
        hasMore,
    };
}