# Employee Management System

A full-stack **Employee Management System** built using **Spring Boot (Backend)** and **React (Frontend)** with **JWT-based authentication** and **role-based access control**.

This project demonstrates clean architecture, secure authentication, and real-world CRUD operations suitable for enterprise-level applications.

---

## 🚀 Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (`ADMIN`, `EMPLOYEE`)
- Secure API access using Spring Security

### 👤 User Roles
#### Admin
- Login
- Create employees
- Search employees
- Edit employee details
- Delete employees
- View admin profile

#### Employee
- Login
- View own profile
- Update own profile
- Access role-restricted routes

---

## 🛠 Tech Stack

### Backend
- Java 17
- Spring Boot
- Spring Security
- JWT (JSON Web Token)
- Spring Data JPA
- Hibernate
- Maven
- MySQL / H2 (configurable)

### Frontend
- React
- React Router
- Axios
- JWT token handling
- HTML / CSS

---

## 📁 Project Structure

employee-management-system/
│
├── employee-management-backend/
│ ├── src/
│ ├── .mvn/
│ ├── pom.xml
│ ├── compose.yaml
│ └── mvnw
│
├── employee-management-frontend/
│ ├── public/
│ ├── src/
│ ├── package.json
│ └── package-lock.json
│
└── README.md
