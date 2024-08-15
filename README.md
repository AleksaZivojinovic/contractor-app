# Contractor App Backend

Welcome to the Contractor App backend! This application is built using Node.js and Express.js, providing a RESTful API to manage contracts, jobs, and payments between clients and contractors, encapsulated by transactions.

## Overview

This app allows clients to create contracts with contractors, manage jobs within those contracts, and handle payments. Contractors can track their jobs and receive payments for completed work. The backend utilizes an SQLite database for data storage.

## Data models

 All models are defined in the 'src/models' directory.

#### Profile

- Profiles represent both clients and contractors.
- Clients create contracts with contractors, and contractors complete jobs for clients.
- Each profile has a balance property, which tracks the available funds for clients and contractors.

#### Contract

- Contracts represent an agreement between a client and a contractor.
- Contracts have three possible statuses: new, in_progress, and terminated.
- Only contracts with the status in_progress are considered active.
- Each contract can have multiple jobs associated with it.

#### Job

- Jobs are tasks that contractors complete under a specific contract.
- Clients pay contractors for jobs once they are completed.
- Jobs track details like payment status and the amount owed.

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/en) (LTS version recommended)

### Instalation

Clone the repository to your local machine.
```sh
git clone ...
```

Navigate to the root directory and run npm install to install all dependencies.
```sh
cd contractor-app && npm i
```

Run seed to populate the local SQLite database. Note: This will reset the database if it already exists.
```sh
npm run seed
```

Start the server in development mode with [Nodemon](https://nodemon.io)
```sh
npm run dev
```
The server will run on http://localhost:4000

#### Building for production

Compile TypeScript and build source code with configuration specified in the 'tsconfig.json' file
```sh
npm run build
```

Start server from compiled JavaScript folder

```sh
npm start
```
The server will run on http://localhost:4000

## API Endpoints

#### Contracts

- GET '/contracts/:id'
Retrieves a contract by ID, but only if it belongs to the authenticated profile.

- GET '/contracts'
Returns a list of non-terminated contracts belonging to the authenticated user (client or contractor).

#### Jobs

- GET '/jobs/unpaid'
Retrieves all unpaid jobs for the authenticated user, but only for active contracts.

- POST '/jobs/:job_id/pay'
Allows a client to pay for a job, provided their balance is sufficient. The payment amount is transferred from the client's balance to the contractor's balance.

#### Balances

- POST '/balances/deposit/:userId'
Deposits money into a client's balance. The deposit cannot exceed 25% of the total amount owed for jobs.

#### Admin

- GET '/admin/best-profession?start=<date>&end=<date>''
Returns the profession that earned the most money within the specified time range.

- GET '/admin/best-clients?start=<date>&end=<date>&limit=<integer>'
Returns the top clients who paid the most for jobs within the specified time period. The limit query parameter determines the number of clients returned (default is 2).

## Technical Notes

- The app uses [Sequelize](https://sequelize.org) as an ORM to interact with the SQLite database.
- User authentication is handled via the getProfile middleware located in src/middleware/getProfile.js. Users are authenticated using the profile_id in the request header.
- The development server is configured with [Nodemon](https://nodemon.io) for automatic restarts during development.
