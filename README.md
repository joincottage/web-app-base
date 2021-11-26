# Development

When working on this application it is important to only make changes to your local,
dockerized database environment. Changes will be automatically deployed to development
when merged.

## Running the local databases

A docker-compose.yml file is located in the root direcory that has all the config
needed to launch a local development database, plus a shadow database that is
necessary for Prisma to run migrations.

### Start up

1. Setup the environment variables to connect to the local database in your local env file
   1. ```
      DATABASE_URL="mysql://admin:mypassword@localhost:3307/cottage"
      SHADOW_DB_URL="mysql://shadowadmin:shadowpassword@localhost:3308/cottage"
      ```
2. Launch the databases in Docker
   1. `docker-compose up`
3. Push the current schema to the database
   1. `prisma db push`
4. Seed the database with data created for local development
   1. `npm run seed`

### Changing the data

If you modify the schema or make changes to the data and want to retain that for the
starting point for other developers you can use the dump script we added to dump all
the table data to json files that are used in the seed process.

1. Run the dump script
   1. `npm run dump`
   2. this will write to the json files in `/prisma/seed/data` directory

## Testing the payments flow with Stripe

Go to the [Stripe dashboard](https://dashboard.stripe.com/) and ensure that "Test mode" is enabled.

When making a payment via the Cottage UI, be sure to use a [test credit card number](https://stripe.com/docs/testing). Stripe provides [multiple test credit card numbers](https://stripe.com/docs/testing#regulatory-cards) that cover every possible use case.

# Resources

## Prisma

- [Prisma & Planetscale Issues](https://github.com/prisma/prisma/issues/7292)
- [Prisma Shadow Database](https://www.prisma.io/docs/concepts/components/prisma-migrate/shadow-database)
- [Deploying Prisma & Planetscale](https://davidparks.dev/blog/planetscale-deployment-with-prisma/)
- [Data Modeling](https://www.prisma.io/dataguide/datamodeling)

## Auth0

https://marketplace.auth0.com/integrations/google-social-connection

## Stripe

- [How to Test Payments Flow with Stripe](https://stripe.com/docs/testing)
- [Stripe Dashboard](https://dashboard.stripe.com/)
- [List of Regulatory Test Credit Cards](https://stripe.com/docs/testing#regulatory-cards)

# Next.js example

## How to use

Download the example [or clone the repo](https://github.com/mui-org/material-ui):

```sh
curl https://codeload.github.com/mui-org/material-ui/tar.gz/master | tar -xz --strip=2  material-ui-master/examples/nextjs
cd nextjs
```

Install it and run:

```sh
npm install
npm run dev
```

or:

[![Edit on CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/mui-org/material-ui/tree/master/examples/nextjs)

## The idea behind the example

[Next.js](https://github.com/zeit/next.js) is a framework for server-rendered React apps.
