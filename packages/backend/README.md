# StockeChecker backend

## File structure

```
.
├── prisma - contains schema for setting up database with Prisma
└── src
    ├── auth - contains code for checking each rerquests's tokens
    ├── controllers
    ├── db - contain database connection client
    ├── routes
    └── services
```

## Local setup

You will need to `cd` into this folder and tun the following command:

```
npm i
```

You will need the following lines in the `.env` file:

```
PORT=
DATABASE_URL=
CLERK_SECRET_KEY=
CLERK_JWT_VERIFICATION_KEY=
ORIGIN_URL=
```

Clerk info can be found on your Clerk dashboard after a project has been set up:
https://clerk.com/

For verification key, please remove `-----BEGIN PUBLIC KEY-----` and `-----END PUBLIC KEY-----` and keep the main string in the middle as a big string.

The database URL has to be from a PostGreSQL database and formatted in the following:

```
postgresql://[user[:password]@][netloc][:port][/dbname][?param1=value1&...]
```

Continue and run the following command to set up the database:

```
npx prisma db push
npx prisma migrate dev
```

You can now run the API with

```
npm run dev
```
