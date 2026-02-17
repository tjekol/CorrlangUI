# CorrlangUI

Graphic Interface for Corrlang – a lightweight semantic intergration tool.

### Start server

Clone the repository to use the interface.

##### 1. Use corrlang-cli to start server

- Download corrlang-cli [here](https://github.com/webminz/corrlang-cli?tab=readme-ov-file).

- Make sure that corrlang-cli is installed and works with this [guide](https://github.com/webminz/corrlang-experiments?tab=readme-ov-file).
- Continue to the next step if `./run.sh` works as expected.

##### 2. Create an `.env` file in the `/frontend` folder with the following content

- `DATABASE_URL="file:./prisma/dev.db"`.

##### 3. From the `/frontend` folder

- Install dependencies with `npm install`.
- Run `npm run db:setup` to set up database file and generate client files.

##### 3. Run frontend

- `npm run dev` starts server on [localhost:3000](http://localhost:3000)

### Issues?

Make sure everything with the corrlang service works by running the `run.sh` script and receiving the output:

```
INFO: Started CorrLang core service process
Wrote schema to ... using 'PUML'.
Wrote schema to ... using 'PUML'.
Wrote schema to ... using 'PUML'.
```

If you don't receive `Wrote schema to…` three times, an error has happened with the server. Before running the graphic interface (this application), the problem needs to be resolved.

If you had any problems with the corrlang-service before you started the application you need to wipe the database and run the frontend again with:

- `npm run restart`

Still have issues?

- Delete the `dev.db` file in `/frontend/prisma` and run `npm run db:setup` again.
