import {
    pgTable,
    uuid,
    text,
    numeric,
    timestamp,
    index,
} from "drizzle-orm/pg-core";

export const products = pgTable(
    "products",
    {
        id: uuid("id").defaultRandom().primaryKey(),

        name: text("name").notNull(),

        category: text("category").notNull(),

        price: numeric("price", {
            precision: 10,
            scale: 2,
        }).notNull(),

        createdAt: timestamp("created_at", {
            withTimezone: true,
        }).notNull(),

        updatedAt: timestamp("updated_at", {
            withTimezone: true,
        }).notNull(),
    },
    (table) => ({
        browseIdx: index("idx_products_browse").on(table.updatedAt, table.id),

        categoryBrowseIdx: index("idx_products_category_browse").on(
            table.category,
            table.updatedAt,
            table.id,
        ),
    }),
);
