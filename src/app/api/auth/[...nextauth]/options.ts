import bcrypt from 'bcryptjs';
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbConnect";
import { NextAuthOptions } from "next-auth";
import UserModel from "@/model/User.model";
import { rateLimitter } from '@/lib/ipRateLimiter';


export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "Enter you email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any, req: any) : Promise<any> {
                await dbConnect()

                const identifier = credentials.identifier.toLowerCase()

                const forwarded = req.headers["x-forwarded-for"]
                const ip = typeof forwarded === 'string' ? forwarded.split(",")[0]?.trim() : "unknown"

                const ipKey = `login:ip:${ip}`
                const userKey = `login:user:${identifier}`

                const ipLimit = await rateLimitter(ipKey)
                const userLimit = await rateLimitter(userKey)

                if (!ipLimit.success || !userLimit.success) {
                    throw new Error('Too many login attempts. Please try again later.')
                }

                    const user = await UserModel.findOne({
                        $or: [
                            {email: credentials.identifier},
                            {username: credentials.identifier},
                        ]
                    })

                    console.log(user)

                    if(!user) {
                        throw new Error('No user found with this email or username')
                    }

                    if(!user.isVerified) {
                        throw new Error('Please verify your account before login')
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)
                    if(isPasswordCorrect) {
                        return user
                    } else {
                        throw new Error('Incorrect Password')
                    }
                try {
                    
                } catch (err: any) {
                    throw new Error(err)
                }
            }
        })
    ],
    callbacks: {
        
        async jwt({ token, user }) {
            if(user) {
                token._id = user._id?.toString()
                token.isVerified = user.isVerified
                token.isAcceptingMessags = user.isAcceptingMessages
                token.username = user.username
            }
            return token
          },
        async session({ session, token }) {
            if(token) {
                session.user._id = token._id  
                session.user.isVerified = token.isVerified
                session.user.isAcceptingMessages = token.isAcceptingMessages
                session.user.username = token.username  
            }
            return session
          }
    },
    pages: {
        signIn: '/sign-in'
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET
}