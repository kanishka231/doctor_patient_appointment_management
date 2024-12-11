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
        name: { label: "Name", type: "text", optional: true },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const { email, password, role, name } = credentials;

        await connectDB();

        let user = await User.findOne({ email, role });

        if (!user) {
          if (!name || name.trim() === "") {
            throw new Error("Name is required for registration.");
          }

          const hashedPassword = await bcrypt.hash(password, 10);
          user = new User({
            name: name.trim(),
            email,
            password: hashedPassword,
            role,
          });

          await user.save();
        } else {
          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (!isPasswordValid) {
            throw new Error("Invalid credentials.");
          }
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
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
