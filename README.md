
# Doctor-Patient Appointment Management Platform

## Overview

The **Doctor-Patient Appointment Management Platform** is a comprehensive web application that streamlines the process of appointment scheduling and management between doctors and patients. It includes **user authentication**, role-based access control, and a dedicated **help and support** system. This platform is built with **Next.js**, **MongoDB**, and **NextAuth** to ensure a modern, secure, and efficient user experience.

The application supports the following roles:

- **Doctors**: Manage their own appointments, including creating, updating, and deleting appointments.
- **Patients**: View and manage their scheduled appointments.
- **Admins**: Oversee all appointments and manage them for organizational purposes.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation Guide](#installation-guide)
- [Folder Structure](#folder-structure)
- [Authentication Module](#authentication-module)
- [Appointment Management](#appointment-management)
- [Help and Support](#help-and-support)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Future Plans](#future-plans)
- [Contributing](#contributing)
- [License](#license)
- [Demo Video](#demo-video)
- [Live Link](#live-link)

---

## Features

### 1. **User Authentication**
   - **Role-Based Access Control**: Supports doctors, patients, and admins with customized functionalities.
   - **Secure Login and Registration**: Authentication with hashed passwords using **NextAuth**.
   - **Session Management**: Secure session handling for persistent logins.

### 2. **Appointment Management**
   - **Doctors**: 
     - Create, view, update, and delete appointments.
   - **Patients**:
     - View their appointments with detailed information.
   - **Admins**:
     - Manage all appointments across the platform.
   - **Details Tracked**:
     - Patient Name
     - Age and Gender
     - Doctor Assigned
     - Date, Time, and Type of Appointment (In-Person or Virtual)
     - Optional Notes for additional context.

### 3. **Help and Support**
   - Frequently Asked Questions (FAQs) section to guide users.
   - **Support Ticket Submission**: Users can raise tickets for technical or non-technical queries.

### 4. **Security**
   - **Password Hashing**: Ensures secure password storage using modern cryptographic standards.
   - **Environment Variables**: Sensitive data like database URLs and secret keys are stored securely in `.env` files.

---

## Tech Stack

### **Frontend**
- [Next.js](https://nextjs.org/) (React framework with server-side rendering)
- [Ant Design](https://ant.design/) (UI component library for polished user interfaces)

### **Backend**
- **Node.js** (Runtime for server-side code)
- **MongoDB** (NoSQL database to store user and appointment data)
- **NextAuth** (Authentication for session management)

### **Development Tools**
- **Jest**: Testing framework for unit testing.
- **Axios**: For HTTP client requests.

---

## Installation Guide

### Prerequisites

1. Install **Node.js** (v16+ recommended) - [Download Node.js](https://nodejs.org/)
2. Set up **MongoDB**:
   - Use MongoDB Atlas (cloud-based) or a local MongoDB instance.

### Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/kanishka231/doctor_patient_appointment_management.git
   cd doctor-patient-appointment-management
   ```

2. **Install project dependencies**:
   ```bash
   npm install
   ```

3. **Setup Environment Variables**:
   Create a `.env.local` file at the project root and add the following:
   ```env
   NEXTAUTH_SECRET=your_secret_key
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/yourdb
   NEXTAUTH_URL='http://localhost:3000'
   ```

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```

5. Open the application in your browser at `http://localhost:3000`.

---

## Folder Structure

Here’s an overview of the project structure:

```plaintext
project-root/
├── app/                # Core application folder
│   ├── api/
│   │   ├── auth/       # NextAuth API routes
│   │   │   └── [...nextauth]/route.ts
│   │   └── doctor/     # Doctor-related API endpoints
│   ├── components/     # Reusable components
│   ├── context/        # React context for global states
│   ├── libs/           # Utility functions
│   ├── models/         # Mongoose models (User, Appointment)
│   ├── pages/          # Pages directory for Next.js routing
│   │   ├── index.tsx   # Main Dashboard Page
│   │   ├── auth/       # Authentication pages
│   ├── layout.tsx      # Global layout component
├── .env.local          # Environment variables
├── package.json        # Dependencies and scripts
├── jest.config.js      # Jest configuration
└── README.md           # Project documentation
```

---

## Environment Variables

The following environment variables are required for the application:

| Key               | Description                           |
|-------------------|---------------------------------------|
| `NEXTAUTH_SECRET` | Secret key for NextAuth encryption.   |
| `MONGODB_URI`     | MongoDB connection string.           |
| `NEXTAUTH_URL`    | Application URL (e.g., localhost).   |

---

## Running the Application

To run the app locally:

1. Ensure MongoDB is running.
2. Run the development server:
   ```bash
   npm run dev
   ```
3. Access the app at `http://localhost:3000`.

---

## Testing

To run the test suite using **Jest**:

```bash
npm test
```

This will run all unit and integration tests to validate the app’s components and functionality.

---

## Future Plans

- **Mobile Responsiveness**: Enhance the UI to work seamlessly across mobile devices.
- **Notifications**: Implement email or SMS reminders for upcoming appointments.
- **Performance Optimization**: Improve database queries and loading times.
- **User Analytics**: Add an analytics dashboard for doctors/admins to view appointment trends.

---

## Contributing

Contributions are welcome! Follow these steps:

1. Fork the repository.
2. Create a new branch for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your message here"
   ```
4. Push your branch and open a Pull Request.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Demo Video

Watch the demo video here:  
[**Demo Video**](https://www.loom.com/share/8b9bffca610e4daf899ecf2f0a60b461?sid=1f08a998-7daf-489c-9538-ad33e8caec5b)

---

## Live Link

Access the live application here:  
[**Live Application**](https://doctor-patient-appointment-management.vercel.app/)
