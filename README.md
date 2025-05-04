# Backend-MS-Base

[![codecov](https://codecov.io/gh/Practica-Supervisada-UCR-2025/Backend-MS-Base/graph/badge.svg?token=M29OG2XDU6)](https://codecov.io/gh/Practica-Supervisada-UCR-2025/Backend-MS-Base)

## Project Overview
Backend-MS-Base is a foundational backend service built with Node.js and TypeScript. It provides a modular structure for managing features like user authentication, database interactions, and API routing.

## Prerequisites

### Install Node.js
1. Download the MSI installer from [Node.js Downloads](https://nodejs.org/en/download/).

2. Verify the installation by running the following command in the terminal:
   ```
   node -v
   ```
3. Open PowerShell as an administrator and execute:
   ```
   Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
   ```
4. Verify npm installation:
   ```
   npm -v
   ```

### Install TypeScript and Dependencies
Run the following commands:
```
npm install -g typescript ts-node nodemon
npm install express body-parser cookie-parser compression cors
npm install -g @types/express @types/body-parser @types/cookie-parser @types/compression @types/cors
npm install --save-dev @types/supertest jest ts-jest @types/jest
npm install --save-dev @types/uuid
```

### Install PostgreSQL
Run the following command:
```
npm install pg @types/pg dotenv
```

### Install Knex.js
Run the following command:
```
npm install express knex pg dotenv
npm install --save-dev nodemon
```

## Folder Structure
- `src/`: Contains the application source code.
   - `features/users/`: Includes controllers, DTOs, middleware, routes, and services for user-related functionality.
- `tests/`: Contains unit and integration tests.
- `docs/`: Documentation files, including the [ER Diagram](docs/ER_Diagram3.md).

## Usage
Currently, the application does not have defined scripts for running the server or tests. Please update the `package.json` file with appropriate commands, such as:
- Start the server: `"start": "npx ts-node src/app"`
- Run tests: `"test": "npx jest"`

## Using Migrations with Knex
### Creating a Migration
To create a new migration file, use the following command:
```bash
npx knex migrate:make migration_name
```
Replace `migration_name` with a descriptive name for your migration. This migrations will be created in `/src/bd/migrations/`.

### Writing a Migration
In the generated migration file, you will find two functions: `up` and `down`. Use the `up` function to define the changes to apply to the database (e.g., creating tables, adding columns). Use the `down` function to define how to revert those changes.

Example:
```javascript
exports.up = function(knex) {
  return knex.schema.createTable('users', function(table) {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('email').unique().notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};
```

### Running Migrations
To apply all pending migrations, run:
```bash
npx knex migrate:latest
```

### Rolling Back Migrations
To rollback the last batch of migrations, use:
```bash
npx knex migrate:rollback
```

## Example of .env
```
DB_HOST=host
DB_USER=user
DB_PASS=password
DB_NAME=name
DB_PORT=port
```
## Documentation
Refer to the [ER Diagram](docs/ER_Diagram3.md) for the database schema.
