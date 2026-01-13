# CorrlangUI

Graphic Interface for Corrlang – a lightweight semantic intergration tool

### Start server

From the root folder

- `./corrlang-1.0-snapshot/bin/corrlang-service`

From the `/frontend` folder

- `npm run grcp`. The command runs the scripts to add the schemas to the server.

#### Frontend

`npm run dev` on [localhost:3000](http://localhost:3000)

#### Backend

##### Prisma

- `npx prisma init`
- `npx prisma dev` to start local prisma postgres server
- `npx prisma migrate dev` to migrate to database
  - `npx prisma migrate dev --name <name>`
- `npx prisma generate` generate updated client
  - `npx prisma generate --no-engine`
