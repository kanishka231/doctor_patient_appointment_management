
# Doctor-Patient Appointment Management Platform

## Authentication Module

This project is a Doctor-Patient Appointment Management Platform. The current implementation includes the **authentication module**, which provides user registration and sign-in functionality using **NextAuth** and **MongoDB**.

---

## Thought Process

### Key Goals:
1. **User Authentication:**
   - Allow users to register with their email, password, role (e.g., Doctor or Patient), and name.
   - Validate user credentials during sign-in.

2. **Tech Stack and Tools:**
   - **Next.js (App Directory):** For building a modern, server-rendered React application.
   - **NextAuth:** To simplify the implementation of authentication.
   - **MongoDB:** To store user information securely.
   - **bcryptjs:** To securely hash and compare passwords.

3. **Secure Practices:**
   - Hash passwords before storing them.
   - Use environment variables for sensitive data like database credentials and secret keys.

---

## Features

- **Registration:**
  - Users can register with their email, password, role, and name.
  - Passwords are hashed before being stored in the database.

- **Sign-In:**
  - Validates user credentials against the database.
  - Issues a session token on successful login.

- **Role-Based Authentication:**
  - Users are categorized by roles, which can later be utilized for authorization purposes.

- **Secure Callbacks:**
  - Custom callbacks to manage session and JWT tokens for adding user information to the session object.

---

## Installation Guide

### Prerequisites:
1. **Node.js** (version 16+ recommended)
2. **MongoDB Atlas or Local MongoDB Instance**
3. **Environment Setup:**
   - Create a `.env.local` file at the root of the project and add the following:
     ```env
     NEXTAUTH_SECRET=your_secret_key
     MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/yourdb
     ```

### Steps:

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd doctor-patient-appointment
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`.

---

## Folder Structure

```
project-root/
├── app/
│   ├── api/
│   │   └── auth/
│   │       ├── [...nextauth]/
│   │       │   └── route.ts
│   │       └── authOptions.ts
├── libs/
│   └── connectdb.ts
├── models/
│   └── User.ts
├── .env.local
```

### Explanation:
- **`app/api/auth/[...nextauth]/route.ts`**:
  - Configures the NextAuth handler for authentication routes.
  - Exports the handler for both `GET` and `POST` methods.

- **`app/api/auth/authOptions.ts`**:
  - Defines the authentication options using `NextAuth`.
  - Uses `CredentialsProvider` to authenticate users via email, password, and role.

- **`libs/connectdb.ts`**:
  - Establishes a connection to the MongoDB database.

- **`models/User.ts`**:
  - Defines the Mongoose schema and model for storing user information.

---

## Detailed Explanation of Code

1. **User Registration and Login Logic:**
   - In the `authorize` function of `CredentialsProvider`, the system checks if a user exists based on the provided email and role.
   - If the user does not exist, it validates the name field and creates a new user with a hashed password.
   - If the user exists, it validates the provided password using `bcrypt.compare`.

2. **Session and JWT Callbacks:**
   - The `session` callback adds `user.id` and `user.role` to the session object.
   - The `jwt` callback includes the user's ID and role in the token for subsequent requests.

3. **Security Measures:**
   - **Password Hashing:** All passwords are hashed using `bcrypt` to ensure they are stored securely in the database.
   - **Secret Key:** The `NEXTAUTH_SECRET` environment variable is used to sign and encrypt tokens.

---

## Running the Application

1. **Start Development Server:**
   ```bash
   npm run dev
   ```

2. **Test API Routes:**
   - **Sign-In:** Navigate to `http://localhost:3000/api/auth/signin`.
   - **Session:** Test the session by inspecting the `req.session` object.

3. **Debugging:**
   - Check for connection errors to MongoDB in the terminal.
   - Validate `.env.local` variables for correctness.

---

## Future Plans

- Add Role-Based Access Control (RBAC) to restrict features based on user roles.
- Integrate social authentication providers (e.g., Google, Facebook).
- Add unit tests for the authentication module.
- Enhance error handling and logging for production readiness.

---

Feel free to reach out for any questions or contributions!