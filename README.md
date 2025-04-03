# Text-to-Speech Converter

A web-based text-to-speech converter application built with React and Go.

## Technologies Used

### Frontend
- **React + TypeScript**: Provides type safety and better developer experience, at the cost of initial development speed.
- **Vite**: For development server speed and modern build tooling compared to Create React App.
- **Shadcn/ui (Tailwind CSS)**: 
  - Ensures consistent styling and responsiveness

### Backend
- **Gin Framework**: High performance and middleware support, though it has a steeper learning curve than simpler frameworks.
- **GORM**: 
  - Provides convenient database operations and migrations
  - Trade-off: Some performance overhead compared to raw SQL, but better developer productivity
- **JWT Authentication**: 
  - Stateless authentication for better scalability
  - Trade-off: Cannot invalidate individual tokens without additional complexity
- **PostgreSQL**: 
  - Strong reliability and ACID compliance
  - Rich feature set for future expansion
  - Trade-off: More complex setup compared to SQLite, but better for production use

## Features

- Text to speech conversion
- Voice parameter customization:
  - Voice selection
  - Speech rate
  - Pitch
  - Volume
- User membership management
- Conversion history

## System Requirements

- Node.js 20 or higher
- Go 1.23 or higher
- PostgreSQL

## Running the Application

### Frontend

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
pnpm install
```

3. Run the application in development mode:
```bash
pnpm run dev
```

The frontend application will run at `http://localhost:5173`

### Backend

1. Navigate to the backend directory:
```bash
cd backend
```

2. Copy `internal/configs/config-example.yaml`, rename it to `config.yaml` then add the configurations settings value

3. Install dependencies:
```bash
go mod tidy
```

4. Run the application:
```bash
make run
```

The backend server will run on the port configured in config.yaml by default was `http://localhost:8080`