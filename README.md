<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# Team Ops API

A NestJS REST API for customer management with JWT authentication, password hashing, and PostgreSQL via TypeORM.

## Features
- Customer registration and login (with JWT)
- Passwords hashed with bcrypt
- Customer CRUD (Create, Read, Update, Delete)
- Protected routes with JWT AuthGuard
- PostgreSQL database (TypeORM)
- Migration scripts for schema management

## Project Setup

```bash
npm install
```

## Environment Variables
Create a `.env` file in the project root with:
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=yourpassword
DB_NAME=team_ops
JWT_SECRET=your_jwt_secret
```

## Running the Project

```bash
# development
npm run start

# watch mode
yarn start:dev

# production
npm run start:prod
```

## Database Migrations

```bash
# Generate a migration after changing entities
yarn migration:generate -- <MigrationName>

# Run migrations
yarn migration:run

# Revert last migration
yarn migration:revert
```

## API Endpoints

### Auth
- `POST /customers` — Register a new customer
  - Body: `{ "email": string, "name": string, "password": string, "phone"?: string, "metadata"?: object }`
- `POST /customers/login` — Login
  - Body: `{ "email": string, "password": string }`
  - Returns: `{ "access_token": string }`

### Customers
- `GET /customers` — List all customers
- `GET /customers/:id` — Get customer by id (JWT required)
- `PATCH /customers/:id` — Update customer
- `DELETE /customers/:id` — Delete customer

## Auth Usage
- Pass JWT as a Bearer token in the `Authorization` header for protected routes.

## Password Security
- Passwords are hashed with bcrypt before storage.
- Passwords are never returned in API responses.

## Tech Stack
- [NestJS](https://nestjs.com/)
- [TypeORM](https://typeorm.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [bcrypt](https://www.npmjs.com/package/bcrypt)
- [JWT](https://jwt.io/)

## License
MIT
