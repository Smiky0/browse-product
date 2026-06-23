# Product Browser

A product browsing system built for the internship assignment.

The application supports:

* Browsing 200,000 products
* Filtering by category
* Fast pagination using cursor-based (keyset) pagination
* Consistent browsing sessions while data is changing
* Bulk database seeding
* Demonstration endpoint for simulating product updates

---

## Live Demo

Frontend:
[Live Link](https://browse-product-frontend.onrender.com)

---

## Tech Stack

### Backend

* Node.js
* TypeScript
* Hono
* Drizzle ORM
* PostgreSQL (Neon)

### Frontend

* Astro
* React (interactive components)

### Database

* PostgreSQL
* Composite indexes for efficient filtering and pagination

---

## Why Cursor Pagination?

A common approach to pagination is offset-based pagination:

```sql
SELECT *
FROM products
ORDER BY updated_at DESC
LIMIT 20 OFFSET 100;
```

This has two major problems:

### Performance

As offsets grow, PostgreSQL must scan and skip more rows before returning results.

Example:

```sql
OFFSET 100000
```

requires PostgreSQL to walk past 100,000 rows before returning the next page.

### Data Consistency

If products are inserted or updated while a user is browsing:

* Records can appear multiple times
* Records can be skipped entirely

For a dataset that changes while users are paging through it, offset pagination does not provide reliable results.

---

## Pagination Strategy

The application uses keyset (cursor) pagination.

Products are ordered by:

```sql
ORDER BY updated_at DESC, id DESC
```

The cursor contains:

```json
{
  "updatedAt": "...",
  "id": "..."
}
```

Subsequent pages fetch records after the last item from the previous page.

This approach:

* Avoids duplicates
* Avoids skipped records
* Performs efficiently even on large datasets

---

## Consistency While Data Changes

The assignment required:

> If 50 new products are added/updated while someone is browsing, they must not see the same product twice or miss one.

To satisfy this requirement, the application uses a snapshot-based browsing strategy.

When a browsing session begins:

```txt
snapshot = current_timestamp
```

Every subsequent request includes that snapshot.

Queries only return records whose:

```sql
updated_at <= snapshot
```

This effectively freezes the dataset for the duration of the browsing session.

As a result:

* New updates do not interfere with pagination
* Users never see duplicates
* Users never miss products
* The browsing experience remains deterministic

---

## Database Schema

```sql
products
```

| Column     | Type          |
| ---------- | ------------- |
| id         | UUID          |
| name       | TEXT          |
| category   | TEXT          |
| price      | NUMERIC(10,2) |
| created_at | TIMESTAMPTZ   |
| updated_at | TIMESTAMPTZ   |

---

## Indexing Strategy

### Browse Index

```sql
(updated_at DESC, id DESC)
```

Supports:

```sql
ORDER BY updated_at DESC, id DESC
```

### Category Browse Index

```sql
(category, updated_at DESC, id DESC)
```

Supports:

```sql
WHERE category = ?
ORDER BY updated_at DESC, id DESC
```

These indexes allow PostgreSQL to efficiently locate records without scanning the entire table.

---

## API Endpoints

### Get Products

```http
GET /products
```

Query Parameters:

| Parameter | Description                |
| --------- | -------------------------- |
| limit     | Page size                  |
| cursor    | Pagination cursor          |
| snapshot  | Session snapshot timestamp |
| category  | Optional category filter   |

Example:

```http
GET /products?limit=20
```

Response:

```json
{
  "snapshot": "...",
  "nextCursor": "...",
  "hasMore": true,
  "items": []
}
```

---

### Simulate Updates

Used to demonstrate consistency guarantees.

```http
POST /products/update
```

Randomly updates 50 products by modifying their `updated_at` timestamp.

This can be used while browsing to verify that pagination remains stable.

Response:

```json
{
  "success": true,
  "updated": 50
}
```

---

## Seeding

The repository contains a seed script that generates 200,000 products.

Instead of inserting rows individually, products are generated and inserted in batches.

Benefits:

* Fewer database round trips
* Faster execution
* Lower memory usage

Run:

```bash
pnpm seed
```

---

## Local Development

### Install

```bash
pnpm install
```

### Configure Environment

Create:

```env
DATABASE_URL=your_neon_connection_string
PORT=3000
```

### Run Backend

```bash
pnpm dev
```

### Seed Database

```bash
pnpm seed
```

### Run Frontend

```bash
pnpm dev
```

---

## What I Would Improve With More Time

* Automated integration tests covering pagination correctness.
* Signed cursors to prevent cursor tampering.
* Rate limiting and monitoring.
* Backend-for-frontend layer for centralized request handling.
* Docker support.
* CI/CD workflows.
* Benchmarking larger datasets and evaluating PostgreSQL COPY-based imports.

---

## AI Usage

AI was used as a development aid for:

* Discussing pagination strategies
* Exploring database indexing approaches
* Understanding unfamiliar tooling
* Reviewing architectural tradeoffs
* Accelerating implementation

All generated code and suggestions were reviewed, tested, and adjusted before use. Design decisions and debugging remained manual responsibilities throughout development.
