# User Check-In System

A Java Spring Boot application that manages user check-ins and events with role-based access control.

## Features

- User registration and authentication
- Role-based access control (Manager and User roles)
- Location management
- Event scheduling and management
- User check-in tracking
- Event attendance tracking

## Technologies Used

- Java 21
- Spring Boot 3.2.0
- Spring Security with JWT
- Spring Data JPA
- SQL Server (via Docker)
- Maven
- Lombok

## Prerequisites

- Java 21
- Docker
- Maven

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/user-checkin-system.git
cd user-checkin-system
```

2. Start SQL Server in Docker:
```bash
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=YourStrong@Passw0rd" \
   -p 1433:1433 --name sqlserver --hostname sqlserver \
   -d mcr.microsoft.com/mssql/server:2019-latest
```

3. Build and run the application:
```bash
./mvnw spring-boot:run
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - User login
- POST `/api/auth/checkin` - User check-in

### Manager Operations
- POST `/api/manager/users` - Create a new user
- GET `/api/manager/users` - Get managed users
- POST `/api/manager/events` - Create an event
- GET `/api/manager/events/location/{locationId}` - Get events by location
- POST `/api/manager/locations` - Create a location

## Database Schema

The application uses the following main entities:
- User
- Location
- Event
- EventAttendance
- Checkin

## Security

The application implements role-based access control:
- Regular users can only access basic features
- Managers have additional privileges for user and event management

## Contributing

Feel free to submit issues and enhancement requests!
