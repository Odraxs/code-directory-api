## Description

**Code-Directory-API** is a simple API that allows registered users to store and execute single file programs, returning its result, in case the program has some errors the API will return the reason.

#### To create this API we use:

- [Nest](https://github.com/nestjs/nest).
- [Prisma](https://www.prisma.io).
- [Postgresql](https://www.postgresql.org).

## Installation

```bash
$ npm install
```

## Database setup

This project uses `Postgresql` and `Prisma` to manage persistence

1. Install `Postgresql` if you don't already have it.
2. Create a new database called `code-directory-api`.
3. Run `npx prisma migrate deploy`.

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Endpoints

### User signup (POST):

- Params:

  - `name`: The name of the user, should be less than 120 characters.
  - `email`: The email of the user.
  - `passwordHash`: The password of the user, should have at least 8 characters.

- Request body:

  ```json
  {
    "name": "John",
    "email": "john_doe@email.com",
    "passwordHash": "secret-password"
  }
  ```

- Example:

  ```bash
  curl -X POST http://localhost:3000/auth/signup -H "Content-Type: application/json" --data '{"name": "John", "email": "john_doe@email.com", "passwordHash": "secret-password"}'
  ```

### User auth/login (POST):

- Params:

  - `email`: The email of the already registered user.
  - `password`: The password of the user already registered user.

- Request body:

  ```json
  {
    "email": "john_doe@email.com",
    "password": "secret-password"
  }
  ```

- Example:

  - ```bash
    curl -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" --data '{"email": "john_doe@email.com", "password": "secret-password"}'
    ```

  - Response:

    ```bash
    {"token":"JWTAuthenticator"}
    ```

### Search a User by Id (GET):

> **Note!** to perform this operation the `JWT` is required.

`http://localhost:3000/user/{Id}`

- Param:

  - `Id`: Identifier of an already registered User in `Uuid` format.

- Example:

  - ```bash
    curl -X GET http://localhost:3000/user/c0c14376-9faf-4d9b-818b-132405a45628 -H "Authorization: Bearer JWTAuthenticator"
    ```

  - Response:

    ```bash
    {"email": "john_doe@email.com","name":"John"}
    ```

### Send a program to the API and store it (POST):

> **Note!** to perform this operation the `JWT` is required.

- Params:

  - `userId`: The identifier of the already authenticated user.
  - `name`: The desired name of the file that will be stored.
  - `executable`: Base64 string, e.g. the string `Y29uc3Qgc3VtID0gMSArIDE7DQpjb25zb2xlLmxvZyhzdW0pOw==` is the base64 of the following `javascript` code:
    ```js
    const sum = 1 + 1;
    console.log(sum);
    ```
  - `language`: An available programming language (only `javascript` for the moment).

- Request body:

  ```json
  {
    "userId": "c0c14376-9faf-4d9b-818b-132405a45627",
    "name": "sum",
    "executable": "Y29uc3Qgc3VtID0gMSArIDE7DQpjb25zb2xlLmxvZyhzdW0pOw==",
    "language": "javascript"
  }
  ```

- Example:

  - ```bash
    curl -X POST  http://localhost:3000/user/program \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer JWTAuthenticator" \
      --data '{"userId": "c0c14376-9faf-4d9b-818b-132405a45627", "name": "sum", "executable": "Y29uc3Qgc3VtID0gMSArIDE7DQpjb25zb2xlLmxvZyhzdW0pOw==", "language": "javascript"}'
    ```

  - Response:

    ```bash
    {"programName":"sum","language":"javascript","result":"2"}
    ```

## Future implementations

- Allow users to execute already stored programs.
- Dockerize the project.
- Add support to more programming languages:

  - [ ] Python.
  - [ ] Elixir.
  - [ ] Rust. 🤔

- Store the users program files in AWS S3. 🫣

#### To see more projects that I have created or contributed you can check my github profile [Odraxs](https://github.com/Odraxs).
