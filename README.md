# Stathub

A real-time sports match tracking application with a Node.js/Express server and PostgreSQL database.

## Features

- **Match Management**: Create and list sports matches.
- **Real-time Updates**: WebSocket integration to broadcast new match creation events to connected clients.
- **Data Validation**: Robust input validation using Zod.
- **Database**: PostgreSQL with Drizzle ORM for schema management and type safety.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL, Drizzle ORM
- **Language**: JavaScript (ESM)
- **Real-time**: `ws` (WebSocket)
- **Package Manager**: pnpm

## Setup Instructions

### Prerequisites

- Node.js (v18+ recommended)
- pnpm (`npm install -g pnpm`)
- PostgreSQL database

### Installation

1.  Clone the repository.
2.  Install dependencies:

    ```bash
    pnpm install
    # Or specifically in the server directory
    cd server && pnpm install
    ```

### Environment Configuration

Create a `.env` file in the `server` directory with the following variables:

```env
PORT=8000
HOST=0.0.0.0
DATABASE_URL=postgres://user:password@localhost:5432/stathub
```

### Database Setup

Initialize the database using Drizzle Kit:

```bash
cd server
pnpm db:generate
pnpm db:migrate
```

### Running the Server

Start the development server with watch mode:

```bash
cd server
pnpm dev
```

The server will be running at `http://localhost:8000`.
The WebSocket server will be available at `ws://localhost:8000/ws`.

## API Endpoints

### Matches

- **GET `/matches`**
    - Fetches a list of matches.
    - **Query Params**:
        - `limit` (optional): Number of matches to return (default: 50, max: 100).

- **POST `/matches`**
    - Creates a new match.
    - **Body**:
        ```json
        {
          "sport": "Basketball",
          "homeTeam": "Lakers",
          "awayTeam": "Warriors",
          "startTime": "2023-10-25T19:00:00Z",
          "endTime": "2023-10-25T21:30:00Z",
          "homeScore": 0,
          "awayScore": 0
        }
        ```
    - **Response**: Returns the created match object and triggers a `match_created` WebSocket event.

## WebSocket Events

Connect to `ws://localhost:8000/ws` to receive real-time updates.

- **Event: `match_created`**
    - Triggered when a new match is successfully created via the API.
    - **Payload**:
        ```json
        {
          "type": "match_created",
          "data": { ...matchData }
        }
        ```