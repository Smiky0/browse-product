import "dotenv/config";

import { db } from "../src/db/client";
import { products } from "../src/db/schema";

const TOTAL_PRODUCTS = 200_000;
const BATCH_SIZE = 5_000;

const CATEGORIES = [
    "Books",
    "Electronics",
    "Sports",
    "Gaming",
    "Fashion",
    "Home",
    "Health",
    "Beauty",
    "Automotive",
    "Toys",
];

function randomDateWithinLastYear(): Date {
    const now = Date.now();
    const oneYearAgo = now - 365 * 24 * 60 * 60 * 1000;
    return new Date(oneYearAgo + Math.random() * (now - oneYearAgo));
}

async function seed() {
    console.log("Seeding database...");
    const start = Date.now();

    for (let offset = 0; offset < TOTAL_PRODUCTS; offset += BATCH_SIZE) {
        const batch = Array.from(
            { length: Math.min(BATCH_SIZE, TOTAL_PRODUCTS - offset) },
            (_, index) => {
                const createdAt = randomDateWithinLastYear();

                const updatedAt = new Date(
                    createdAt.getTime() +
                        Math.random() * (Date.now() - createdAt.getTime()),
                );

                return {
                    name: `Product ${offset + index + 1}`,

                    category:
                        CATEGORIES[
                            Math.floor(Math.random() * CATEGORIES.length)
                        ],

                    price: (Math.random() * 5000 + 10).toFixed(2),

                    createdAt,
                    updatedAt,
                };
            },
        );

        await db.insert(products).values(batch);

        console.log(
            `Inserted ${Math.min(
                offset + BATCH_SIZE,
                TOTAL_PRODUCTS,
            )} / ${TOTAL_PRODUCTS}`,
        );
    }
    const duration = ((Date.now() - start) / 1000).toFixed(2);

    console.log(`Seeding completed in ${duration}s`);
    process.exit(0);
}

seed().catch((err) => {
    console.error(err);
    process.exit(1);
});
