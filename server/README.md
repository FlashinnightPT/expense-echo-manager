
# GFIN API (.NET Framework 4.8)

This is the backend API for the GFIN application implemented using .NET Framework 4.8.

## Prerequisites

- .NET Framework 4.8
- Visual Studio 2019 or later
- IIS 7.5 or later
- MariaDB/MySQL database server

## Setup

1. Open the solution in Visual Studio.
2. Restore NuGet packages.
3. Update Web.config with your database connection details.
4. Build the solution.

## Deployment

### Development

1. In Visual Studio, press F5 to start the application using IIS Express.
2. The API will be available at `http://localhost:5000/api`.

### Production

1. Publish the application to a folder.
2. Set up an IIS website pointing to the published folder.
3. Configure the application pool to use .NET Framework 4.8.
4. Make sure the application pool identity has appropriate permissions.
5. Set up the appropriate bindings for your domain/IP.

## API Endpoints

- GET /api/ping - Test if the server is running
- GET /api/categories - Get all categories
- POST /api/categories - Create a new category
- PUT /api/categories/{id} - Update a category
- DELETE /api/categories/{id} - Delete a category
- DELETE /api/categories/clear/non-root - Clear non-root categories
- GET /api/transactions - Get all transactions
- POST /api/transactions - Create a new transaction
- DELETE /api/transactions/{id} - Delete a transaction
- GET /api/users - Get all users
- GET /api/users/username/{username} - Get a user by username
- POST /api/users - Create a new user
- PUT /api/users/{id} - Update a user
- DELETE /api/users/{id} - Delete a user
- PUT /api/users/{id}/last-login - Update a user's last login timestamp
- POST /api/db-test - Test the database connection

## Frontend Integration

The React frontend expects the API to be available at the URL specified in the `.env` file. For local development, set `VITE_API_URL=http://localhost:5000/api` in the `.env` file.
