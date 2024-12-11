import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import connectDB from '@/libs/connectdb';
import User from '@/models/User';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        role: { label: 'Role', type: 'text' },
        name: { label: 'Name', type: 'text', optional: true },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const { email, password, role, name } = credentials;

        await connectDB();

        // Check if user exists
        let user = await User.findOne({ email, role });

        if (!user) {
          // User not found - attempt registration
          if (!name || name.trim() === '') {
            throw new Error("Name is required for registration.");
          }

          const hashedPassword = await bcrypt.hash(password, 10);
          
          user = new User({
            name: name.trim(), // Trim any whitespace
            email,
            password: hashedPassword,
            role,
          });

          await user.save();
        } else {
          // User exists, verify password
          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (!isPasswordValid) {
            throw new Error("Invalid credentials.");
          }
        }

        // Return the user object
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
    signIn: '/auth/signin',
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

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };