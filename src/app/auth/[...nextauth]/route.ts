import NextAuth, { NextAuthOptions, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // 1. Check if credentials were provided
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // 2. Get admin credentials from environment variables
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

        // 3. Make sure environment variables are set
        if (!adminEmail || !adminPasswordHash) {
          console.error('Missing admin credentials in environment');
          return null;
        }

        // 4. Check if the email matches
        if (credentials.email !== adminEmail) {
          return null;
        }

        // 5. Check if the password is correct
        const passwordValid = await bcrypt.compare(
          credentials.password,
          adminPasswordHash
        );

        if (!passwordValid) {
          return null;
        }

        // 6. If everything checks out, return the user
        return {
          id: "admin",
          email: adminEmail,
          name: "Admin"
        };
      }
    })
  ],
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };