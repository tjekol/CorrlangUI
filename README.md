# CorrlangUI

Graphic Interface for Corrlang – a lightweight semantic intergration tool

### Start server

Unzip `corrlang-1.0-snapshot.zip`. From the root folder

- Start server with `./corrlang-1.0-snapshot/bin/corrlang-service`

From the `/frontend` folder

- Run `npm run grcp`. The command runs the scripts to add the schemas to the server.

#### Frontend

`npm run dev` starts server on [localhost:3000](http://localhost:3000)

##### Prisma

- Create an `.env` file with `DATABASE_URL="file:./prisma/dev.db"`

- `npm run prisma`. Sets up local database `dev.db`, generates prisma client and seeds database.
- `npm run studio` to see visual editor of the database.

Other commands:

- `npx prisma init`
- `npx prisma dev` to start local prisma postgres server
- `npx prisma migrate dev` to migrate to database
  - `npx prisma migrate dev --name <name>`
- `npx prisma generate` generate updated client
  - `npx prisma generate --no-engine`
