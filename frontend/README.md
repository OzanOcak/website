## Running the app

make sure the postgres port is not used by another app or running on localhost, since we need to use the port in docker container

```bash
brew services list
brew services stop postgresql@14
```

```bash
docker compose up -d
cd backend
npm run db:generate
npm run db:push
npm run dev
cd frontend
npm run dev
```

- any blog post of front matter might cause error
