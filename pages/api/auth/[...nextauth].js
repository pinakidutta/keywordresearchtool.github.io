import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "../../../lib/mongodb";
import bcrypt from "bcryptjs";

export default NextAuth({
    // Configure one or more authentication providers
    // Configure the session provider
     secret:'mysecret',
     pages:{
         signIn:'/login'
     },
    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. "Sign in with...")
            name: "Credentials",
            // The credentials is used to generate a suitable form on the sign in page.
            // You can specify whatever fields you are expecting to be submitted.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                email: { label: "Email", type: "email",name:'email', placeholder: "Admin" },
                password: { label: "Password", type: "password", name:'password' }
            },
            async authorize(credentials, req) {
                // check if email and password are found in database
                // return user if found, null if not
                let db = await connectToDatabase()
                let user = await db.db.collection('users').findOne({email:credentials.email})
                if(user){
                    // check if password is correct
               
                    let isPasswordCorrect = await bcrypt.compare(credentials.password,user.password)
                    if(isPasswordCorrect){
                        // User found we check his account status if banned 
                        if(user.status==='Banned'){
                            return null
                        }else{
                            return user
                        }
                    }
                }
                return null

            }
        }),
    ] ,
    // Configure callback
    callbacks: {
        
        session: async(session, user) => {

        
            return session;
        },
        signIn: async (user, account, profile, session, req, res) => {
           //  after sign in, redirect to dashboard
             
           
            return {redirect : '/dashboard'}
        },
        jwt: async ({ token, user }) => {
            if(user){
                token.verified = user.verified
                token.uid = user._id
                token.role =  user.role
            }

            return token
          }
    },
        

    session:{
        // The session provider is used to store the user in the session.
        jwt:true,
        
    }

})