# Database-Migration

> [!NOTE]
> Based on [postgres-migrations](https://www.npmjs.com/package/postgres-migrations)

## Setup

1. Clone the repository

   ```bash
   git clone git@github.com:BudgetBuddyDE/Database-Migration.git
   ```

2. Install the dependencies

   ```bash
   npm install
   ```

3. Set all required environment-variables as defined in the `.env.example`
4. Start your migration

   ```bash
   npm run dev
   # or start the
   npm run start
   ```

## How to run

> [!NOTE]
> When executed for the first time, a table `migrations` is created, which stores information about the executed migrations. For more information about the design-decisions read [this article](https://www.npmjs.com/package/postgres-migrations#design-decisions).

### Local

1. Clone and setup the repository as defined [here](#setup)
2. Start the migration using `npm start`

### Using Docker

> [!IMPORTANT]
> Make sure to mount your migration files and point onto your internal mounted path

```bash
# In this example the `MIGRATIONS_PATH` environment-variabel should be `./migrations`
docker run --env-file .env -v ./temp/database/migrations:/usr/src/app/migrations ghcr.io/budgetbuddyde/database-migration:latest
```

## Migration

> Copied from [here](https://www.npmjs.com/package/postgres-migrations#migration-rules)

**Make migrations idempotent**

Migrations should only be run once, but this is a good principle to follow regardless.

**Migrations are immutable**

Once applied (to production), a migration cannot be changed.

This is enforced by storing a hash of the file contents for each migration in the migrations table.

These hashes are checked when running migrations.

**Migrations should be backwards compatible**

Backwards incompatible changes can usually be made in a few stages.

For an example, see [this blog post](http://www.brunton-spall.co.uk/post/2014/05/06/database-migrations-done-right/).

**File name**

A migration file must match the following pattern:

`[id][separator][name][extension]`

| Section   | Accepted Values                   | Description                                                                                                                      |
| --------- | --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| id        | Any integer or left zero integers | **Consecutive integer ID.** <br />Must start from 1 and be consecutive, e.g. if you have migrations 1-4, the next one must be 5. |
| seperator | `_` or `-` or nothing             |                                                                                                                                  |
| name      | Any length text                   |                                                                                                                                  |
| extension | `.sql` or `.js`                   | File extensions supported. **Case insensitive.**                                                                                 |

Example:

```
migrations
├ 1_create-initial-tables.sql
├ 2-alter-initial-tables.SQL
└ 3-alter-initial-tables-again.js
```

Or, if you want better ordering in your filesystem:

```
migrations
├ 00001_create-initial-tables.sql
├ 00002-alter-initial-tables.sql
└ 00003_alter-initial-tables-again.js
```

Migrations will be performed in the order of the ids. If ids are not consecutive or if multiple migrations have the same id, the migration run will fail.

Note that file names cannot be changed later.

**Javascript Migrations**

By using `.js` extension on your migration file you gain access to all NodeJS features and only need to export a method called `generateSql` that returns a `string` literal like:

```js
// ./migrations/helpers/create-main-table.js
module.exports = `
CREATE TABLE main (
    id int primary key
);`;

// ./migrations/helpers/create-secondary-table.js
module.exports = `
CREATE TABLE secondary (
    id int primary key
);`;

// ./migrations/1-init.js
const createMainTable = require('./create-main-table');
const createSecondaryTable = require('./create-secondary-table');

module.exports.generateSql = () => `${createMainTable}
${createSecondaryTable}`;
```
