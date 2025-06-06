// Type declarations 
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
    }
  }

  interface User {
    id: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
  }
}


import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { MongoClient } from "mongodb";
import bcrypt from 'bcryptjs';

//connect to MongoDB
const client = new MongoClient(process.env.MONGODB_URI!)
const clientPromise = client.connect()

//auth config 
const handler = NextAuth({
    adapter: MongoDBAdapter(clientPromise),
    providers :[
        CredentialsProvider({
            //set up credentials layout
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "text"},
                password: { label: "Password", type: "password"}
            },
            async authorize (credientials){
                if (!credientials?.email || !credientials?.password) return null

                const client = await clientPromise

                //find user collection
                const users = client.db().collection("users")
                //found user !!
                const user = await users.findOne({ email: credientials.email })

                if (user && await bcrypt.compare(credientials.password, user.password)) {
                    return {
                        id: user._id.toString(),
                        email: user.email,
                        name : user.name,
                    }
                }
                return null
            }
        })
    ],
    session: {strategy: "jwt"},
    pages: {
        signIn: "/auth/signin",

    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
            }
            return session
        }
    }
})

export { handler as GET, handler as POST }

