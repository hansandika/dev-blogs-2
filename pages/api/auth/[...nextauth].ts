import NextAuth, { NextAuthOptions } from "next-auth";
import GithubAuthProvider from "next-auth/providers/github";
import { dbConnect } from "../../../lib/dbConnect";
import User from "../../../models/User";
import { githubProvider, userRole } from "../../../utils/types";

const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GITHUB_CLIENT_ID_LOCAL, GITHUB_CLIENT_SECRET_LOCAL, MODE } = process.env

const GIT_CLIENT_ID = MODE === 'development' ? GITHUB_CLIENT_ID_LOCAL : GITHUB_CLIENT_ID
const GIT_CLIENT_SECRET = MODE === 'development' ? GITHUB_CLIENT_SECRET_LOCAL : GITHUB_CLIENT_SECRET

export const authOptions: NextAuthOptions = {
  providers: [
    GithubAuthProvider({
      clientId: GIT_CLIENT_ID as string,
      clientSecret: GIT_CLIENT_SECRET as string,
      async profile(profile) {
        await dbConnect()
        const { name, email, avatar_url, login } = profile
        const oldUser = await User.findOne({ email })

        const userProfile = {
          email,
          name: name || login,
          avatar: avatar_url,
          role: userRole
        }

        if (!oldUser) {
          const newUser = await User.create({
            ...userProfile,
            provider: githubProvider,
          })
        }

        userProfile.role = oldUser?.role || userRole

        return {
          id: profile.id,
          ...userProfile
        }
      },
    })
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.role = (user as any).role
      return token
    },
    async session({ session }) {
      await dbConnect()
      const user = await User.findOne({ email: session.user?.email })
      if (user) session.user = {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role
      } as any
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/404'
  }
}

export default NextAuth(authOptions)