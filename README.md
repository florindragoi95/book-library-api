# book-library-api
This project is a backend API for managing a book library, implemented in **TypeScript** using **NestJS**.

--------
# Features

*   CRUD operations for **Books** (Add/Edit/Delete/List/View)

*   CRUD operations for **Categories** (Add/Edit/Delete/List/View)

*   Unique name validation for both Books and Categories

*   Nested Categories (expandable to infinite depth)

*   Breadcrumb generation for Books

*   Automatic deletion of Books when their Category is removed

*   Unit tests for core functionality

------------

# Installation

## Prerequisites

*   **Node.js** (v20+ recommended)

*   **PostgreSQL** (configurable via environment variables)


## Steps

```bash
# Clone the repository
git clone https://github.com/florindragoi95/book-library-api.git
cd book-library-api

# Install dependencies
pnpm install

# Configure environment variables
cp .env.example .env  # Update database credentials in .env

# Option 1: Run SQL seed file via command line
Run the seed.sql file to populate the database
psql -U $DATABASE_USER -d $DATABASE_NAME -h $DATABASE_HOST -p $DATABASE_PORT -a -f seed.sql

# Option 2: Manually run the SQL in pgAdmin4
1. Open pgAdmin4 and connect to your database.
2. Open a query window.
3. Copy the contents of seed.sql file.
4. Paste and execute the queries in the query window.

# Option 3: Use Migrations (Planned with Prisma)
Migrations with Prisma are a potential future option for managing the database schema. If Prisma migrations are implemented, the `seed.sql` file may no longer be required for database population, as migrations would handle the schema changes and data seeding.

# Start the server
pnpm start
```

## Run tests

```bash
# unit tests
$ pnpm run test

# test coverage
$ pnpm run test:cov
```

---------------------
# Swagger Documentation

Swagger UI is available at:

```bash
http://localhost:3000/api
```

-------
# License

This project is licensed under the MIT License.
