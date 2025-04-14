import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          await dbConnect();

          const { email, password } = credentials;
          // console.log(credentials)
          const user = await User.findOne({ email }).select("+password");
          // console.log(user);
          if (!user) {
            throw new Error("Invalid email or password");
          }

          const isMatch = await user.matchPassword(password);

          if (!isMatch) {
            throw new Error("Invalid email or password");
          }
          console.log(user);  
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            roomNumber: user.roomNumber,
            hostelBlock: user.hostelBlock,
          };
        } catch (error) {
          console.error("Auth error:", error);
          throw new Error(error.message || "Authentication failed");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        console.log("JWT callback - user data:", user);
        return {
          ...token,
          id: user.id,
          role: user.role,
          roomNumber: user.roomNumber,
          hostelBlock: user.hostelBlock,
        };
      }
      return token;
    },
    async session({ session, token }) {
      console.log("Session callback - token:", token);
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.roomNumber = token.roomNumber;
      session.user.hostelBlock = token.hostelBlock;

      console.log("Final session:", session);
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
