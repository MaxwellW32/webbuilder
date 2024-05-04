import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import config from "@/lib/config"

import { db } from "@/db"
import { pgDrizzleAdapter } from "@/drizzle-adapter"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"
import { NextAuthOptions, SessionStrategy } from "next-auth"

//if token exists then get user
//so a session can either contain a user or not, if it does then its the full type user

export const authOptions: NextAuthOptions = {
    adapter: pgDrizzleAdapter(db) as any,
    session: {
        strategy: 'jwt',
    },
    secret: config.NEXTAUTH_SECRET,
    providers: [
        GoogleProvider({
            clientId: config.GOOGLE_CLIENT_ID,
            clientSecret: config.GOOGLE_CLIENT_SECRET,
        }),
        GithubProvider({
            clientId: config.GITHUB_ID,
            clientSecret: config.GITHUB_SECRET
        })
    ],
    callbacks: {
        async session({ token, session }) {
            if (token.email) {
                //@ts-ignore
                session.user = token;
                // session.user.id = token.id;
                // session.user.name = token.name;
                // session.user.email = token.email;
                // session.user.image = token.image as string;
            }

            return session;
        },
        async jwt({ token, user }) {
            if (token.email) {
                const [seenUser] = await db.select().from(users).where(eq(users.email, token.email)).limit(1);
                return seenUser //this is the token
            }

            // if (user) {
            //     token.id = user?.id;
            // }

            return token
        },
    },
}