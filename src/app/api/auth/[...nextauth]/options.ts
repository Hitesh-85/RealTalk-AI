import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(
        credentials: Record<string, string> | undefined,
      ): Promise<import("next-auth").User | null> {
        await dbConnect();
        try {
          if (!credentials) {
            throw new Error("Missing credentials");
          }

          // Instant Guest Login handler for testing
          if (
            (credentials.identifier === "guest" || credentials.identifier === "guest@realtalk.ai") &&
            credentials.password === "guest123"
          ) {
            let guestUser = await UserModel.findOne({ username: "guest" });
            if (!guestUser) {
              const hashedPassword = await bcrypt.hash("guest123", 10);
              guestUser = await UserModel.create({
                username: "guest",
                email: "guest@realtalk.ai",
                password: hashedPassword,
                verifyCode: "000000",
                verifyCodeExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
                isVerified: true,
                isAcceptingMessage: true,
                messages: [
                  {
                    content: "Welcome to RealTalk AI! This is a pre-loaded test message in your guest inbox.",
                    createdAt: new Date(),
                  },
                ],
              });
            }
            return guestUser as unknown as import("next-auth").User;
          }

          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });
          if (!user) {
            throw new Error("No user found with this email");
          }
          if (!user.isVerified) {
            throw new Error("Please verify your account before login");
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password,
          );
          if (isPasswordCorrect) {
            return user as unknown as import("next-auth").User;
          } else {
            throw new Error("Incorrect password");
          }
        } catch (err: unknown) {
          throw new Error(err instanceof Error ? err.message : String(err));
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAccepting = token.isAcceptingMessages;
        session.user.username = token.username;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username;
      }
      return token;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
