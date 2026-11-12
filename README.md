# MyLibrary — Personal Book Collection Manager

MyLibrary is a simple full-stack web application for managing a personal collection of books.

## Technologies Used

- **Frontend:** React + Vite
- **Backend:** ASP.NET Core Web API (.NET 9)
- **Database:** SQLite
- **ORM:** Entity Framework Core

## Features

- Add books to a personal collection
- View all saved books
- Edit book information
- Delete books
- Track books that have been read
- View basic reading statistics
- Save book information permanently using SQLite

## How to Run

### Backend

Open a terminal in `api/MyLibrary.API` and run:

```bash
dotnet restore
dotnet ef database update
dotnet run
```

### Frontend

Open another terminal in `client` and run:

```bash
npm install
npm run dev
```

Open the local URL displayed by Vite in your browser.

The frontend expects the API at `http://localhost:5269`.

## Project Structure

- `api/` — ASP.NET Core backend and database configuration
- `client/` — React frontend

## Purpose

This project was developed to practise full-stack application development, REST APIs, CRUD operations and database integration.
