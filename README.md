# 🌱 AgriTrade – Online Agricultural Marketplace

AgriTrade is a full-stack agricultural marketplace designed to connect farmers and buyers through a digital platform. Farmers can list their crops, while buyers can browse available products and place orders. The project aims to simplify agricultural trading through secure authentication, inventory management, and order processing.

## 📌 Project Overview

- **Project Name:** AgriTrade
- **Project Type:** Full-Stack Web Application
- **Domain:** Agriculture / E-Commerce
- **Target Users:** Farmers and Buyers
- **Backend:** Java, Spring Boot
- **Frontend:** React.js, Vite
- **Database:** MySQL

## ✨ Features

### Authentication and Security
- User registration and login.
- JWT-based authentication.
- Password hashing using BCrypt.
- Protected API endpoints.
- Role-based access control, where configured.

### Crop Management
- View available crops.
- Add, update, and delete crop listings, where supported by the current API.
- View crop descriptions, prices, and available quantities.
- Track inventory when orders are placed.

### Category Management
- View crop categories.
- Add and delete categories.
- Organize agricultural products by category.

### Order Management
- Place orders for available crops.
- Calculate order totals.
- Validate available stock before placing an order.
- View order details and status.
- Cancel eligible orders and restore stock.

### Frontend Experience
- Responsive React user interface.
- Crop marketplace with product cards.
- Shopping basket interface, if the current basket implementation is enabled.
- Login, registration, dashboard, and profile pages.
- Notifications and loading/error feedback.

### AI Farming Assistant
- Chat interface for farming-related questions, if the OpenAI integration is configured.
- Spring Boot backend integration with the OpenAI API.
- API key managed through environment variables.

### Developer Features
- RESTful APIs.
- Spring Data JPA for database access.
- Swagger/OpenAPI documentation, if enabled.
- Docker support for running the backend and database.
- Automated tests for supported services.

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| Java 17 | Backend programming |
| Spring Boot | Backend application framework |
| Spring Web | REST API development |
| Spring Security | Authentication and security |
| JWT | Token-based authentication |
| Spring Data JPA | Database operations |
| MySQL 8.4 | Relational database |
| Gradle | Dependency management and builds |
| React.js | Frontend development |
| Vite | Frontend development server and build |
| JavaScript | Frontend programming |
| Tailwind CSS | UI styling |
| Axios | HTTP requests |
| React Router | Frontend routing |
| Lucide React | Icons |
| Swagger/OpenAPI | API documentation |
| Docker Compose | Container orchestration |
| Git and GitHub | Version control |

## 🏗️ Architecture

AgriTrade follows a client-server architecture.

1. **Frontend:** React provides the user interface and sends HTTP requests through Axios.
2. **Backend:** Spring Boot exposes REST APIs, validates requests, and applies business rules.
3. **Security:** Spring Security and JWT protect authenticated endpoints.
4. **Persistence:** Spring Data JPA communicates with MySQL.
5. **Containerization:** Docker packages the backend and can run it with a MySQL container.

```text
AgriTrade/
├── src/
│   ├── main/
│   │   ├── java/com/agritrade/
│   │   │   ├── config/
│   │   │   ├── controller/
│   │   │   ├── dto/
│   │   │   ├── entity/
│   │   │   ├── exception/
│   │   │   ├── repository/
│   │   │   ├── security/
│   │   │   ├── service/
│   │   │   └── AgritradeApplication.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
├── Dockerfile
├── docker-compose.yml
├── build.gradle
├── .gitignore
├── .env.example
└── README.md
```

*Note: The structure above is representative. Adjust it to match the files and packages in your actual repository.*

## ⚙️ Prerequisites

Install the following before running the application locally:

- Java Development Kit (JDK) 17
- MySQL 8.4 or a compatible MySQL server
- Node.js and npm
- Git
- IntelliJ IDEA or another Java IDE
- Postman (optional, for API testing)
- Docker Desktop (optional, for containerized execution)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Saran316/AgriTrade.git
cd AgriTrade
```

### 2. Configure the Environment

Create a `.env` file in the project root for the secrets and configuration required by your local setup.

Example:

```dotenv
JWT_SECRET=replace_with_a_secure_base64_secret
OPENAI_API_KEY=replace_with_your_api_key
OPENAI_MODEL=gpt-4.1-mini
```

Generate a strong, random Base64-encoded JWT signing key suitable for HS256. Do not commit `.env` or paste real API keys into GitHub.

For the AI assistant, an OpenAI API key is needed only if that integration is implemented and enabled.

### 3. Configure MySQL

Create the application database:

```sql
CREATE DATABASE agritrade;
```

Configure the following environment variables for the Spring Boot application:

```text
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/agritrade
SPRING_DATASOURCE_USERNAME=your_mysql_username
SPRING_DATASOURCE_PASSWORD=your_mysql_password
JWT_SECRET=your_generated_jwt_secret
```

Ensure that `application.properties` reads these environment variables rather than containing real passwords or signing keys.

### 4. Run the Backend

From the project root on Windows:

```powershell
.\gradlew.bat clean build
```

Start the backend:

```powershell
.\gradlew.bat bootRun
```

The backend should be available at:

```text
http://localhost:8080
```

Keep the backend terminal open while testing the frontend.

### 5. Run the Frontend

Open a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open the URL printed by Vite, typically:

```text
http://localhost:5173
```

Ensure that the backend CORS configuration allows the frontend origin.

## 🔗 API Endpoints

The following table describes the API routes discussed during development. Verify each endpoint against the current controller implementation.

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Register a user |
| POST | `/api/auth/login` | Authenticate a user |
| GET | `/api/users/me` | Get the authenticated user's profile |
| GET | `/api/categories` | Retrieve categories |
| POST | `/api/categories` | Create a category |
| GET | `/api/crops` | Retrieve crop listings |
| GET | `/api/crops/{id}` | Retrieve a crop by ID |
| POST | `/api/orders` | Place an order |
| GET | `/api/orders` | Retrieve the current user's orders |
| GET | `/api/orders/{id}` | Retrieve order details |
| PUT | `/api/orders/{id}/status` | Update order status, subject to authorization |
| PUT | `/api/orders/{id}/cancel` | Cancel an eligible order |
| POST | `/api/chat` | Submit a message to the AI assistant, if configured |

Protected endpoints require a valid JWT in the request header:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

### API Documentation

If Swagger/OpenAPI is enabled, access the interactive documentation at:

```text
http://localhost:8080/swagger-ui/index.html
```

## 🐳 Run with Docker

If the project contains a working `docker-compose.yml`, configure its environment variables and start the containers:

```bash
docker compose up -d --build
```

Check the running containers:

```bash
docker compose ps
```

View backend logs:

```bash
docker compose logs -f backend
```

Stop the containers:

```bash
docker compose down
```

The named MySQL volume should be retained when stopping the application. Avoid `docker compose down -v` unless you intentionally want to remove the database volume.

Docker requires its own configuration: the backend container must connect to the database using the Compose service hostname, typically `mysql`, rather than `localhost`.

## 🧪 Testing

Run the backend tests:

```powershell
.\gradlew.bat test
```

Run a clean build:

```powershell
.\gradlew.bat clean build
```

Test the main workflows:

- User registration and login.
- Access to protected endpoints using JWT.
- Category retrieval and management.
- Crop listing and inventory validation.
- Order placement and total calculation.
- Order cancellation and stock restoration.
- Unauthorized requests and invalid input.
- Frontend API integration and error handling.

Use a separate test database for integration tests so test execution does not modify development data.

## 🔐 Security Considerations

- Store JWT secrets and API keys in environment variables.
- Never commit `.env` files or database passwords.
- Hash passwords using BCrypt.
- Validate incoming request data.
- Check resource ownership and user permissions on protected operations.
- Avoid exposing password hashes or sensitive entity fields in API responses.
- Use HTTPS and secure deployment configuration in production.
- Rotate any credentials that have accidentally been committed to a public repository.

## 📸 Screenshots

Add screenshots of the actual working application to a folder such as `docs/screenshots/`.

Suggested screenshots:

1. Login and registration pages.
2. Main dashboard.
3. Crop marketplace.
4. Category management.
5. Order history and order details.
6. AI farming assistant, if working.
7. Swagger API documentation.

Example Markdown after adding a screenshot:

```markdown
![AgriTrade Dashboard](docs/screenshots/dashboard.png)
```

## 🔮 Future Improvements

- Crop search, filtering, and pagination.
- Crop images and detailed product information.
- Farmer and buyer dashboards with complete role-based permissions.
- Payment gateway integration.
- Delivery tracking and order notifications.
- Agricultural price insights and analytics.
- AI-assisted crop recommendations.
- Automated CI/CD pipeline.
- Cloud deployment with production database configuration.

These are planned enhancements, not claims about currently implemented functionality.

## 👨‍💻 Author

**Saran Raj M**

B.Tech – Artificial Intelligence and Data Science

GitHub: [Saran316](https://github.com/Saran316)

## 📄 License

Choose and add an appropriate open-source license before allowing others to reuse or redistribute the project. Until a license is added, do not assume the repository grants general permission to reuse its code.
