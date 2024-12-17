import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectDB from "@/libs/connectdb";
import User from "@/models/User";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
        type : {label:"login", type:"text"},
        name: { label: "Name", type: "text", optional: true },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const { email, password, role, name, type } = credentials;
        await connectDB();
        let user = await User.findOne({ email });
      
        if (type === "register") {
          if (user) {
            throw new Error("A user with this email already exists.");
          }
      
          if (!name || name.trim() === "") {
            throw new Error("Name is required for registration.");
          }
      
          // Hash password and create a new user
          const hashedPassword = await bcrypt.hash(password, 10);
      
          try {
            user = new User({
              name: name.trim(),
              email,
              password: hashedPassword,
              role,
            });
            await user.save(); // Save the new user
          } catch (error: any) {
            if (error.code === 11000) {
              throw new Error("A user with this email already exists.");
            }
            throw new Error("Failed to register user.");
          }
        } else {
          // Handle Login Logic
          if (!user) {
            throw new Error("User not found. Please register.");
          }
      
          // Validate Password
          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (!isPasswordValid) {
            throw new Error("Invalid credentials.");
          }
      
          // Validate Role
          if (user.role !== role) {
            throw new Error("Invalid role specified.");
          }
        }
      
        // Return user data on successful login or registration
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      }
      
      
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async session({ session, token }: any) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
