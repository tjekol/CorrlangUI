# CorrlangUI

Graphic Interface for Corrlang – a lightweight semantic intergration tool

### Start server

#### Frontend

`npm run dev` on [localhost:3000](http://localhost:3000)

#### Backend

##### Prisma

- `npx prisma init`
- `npx prisma dev` to start local prisma postgres server
- `npx prisma migrate dev` to migrate to database
  - `npx prisma migrate dev --name init`
- `npx prisma generate` generate updated client
  - `npx prisma generate --no-engine`
-
