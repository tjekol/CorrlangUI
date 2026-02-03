# CorrlangUI

Graphic Interface for Corrlang – a lightweight semantic intergration tool.

### Start server

##### 1. From the root folder, unzip `corrlang-1.0-snapshot.zip`

- Start server with `./corrlang-1.0-snapshot/bin/corrlang-service`.

##### 2. Create an `.env` file with the following content

- `DATABASE_URL="file:./prisma/dev.db"`.

##### 3. In another terminal from the `/frontend` folder

- Install dependencies `npm install`.
- Run `npm run db:up` to set up database file, generate client files and add data to server.

##### 4. Run frontend

- `npm run dev` starts server on [localhost:3000](http://localhost:3000)
