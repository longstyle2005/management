import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "~/lib/mongodb/mongodb";
import bcrypt from "bcryptjs";

export const authOptions = {
    providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			authorization: {
				params: {
					prompt: "select_account",
					display: "popup",
				},
			},
		}),
		// Sign in with Google account

		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email", placeholder: "you@example.com" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				const { email, password } = credentials;
				const client = await clientPromise;
				const db = client.db("Management");
				const admin = await db.collection("members").findOne({ email });
				if (!admin) throw new Error("admin not found");
		
				// Check password
				const isMatch = bcrypt.compareSync(password, admin.password);
				if (!isMatch) throw new Error("Invalid password");
		
				return { 
					id: admin._id, 
					nickname: admin.nickname, 
					email: admin.email, 
					role: admin.role
				};
			},
		}),
		// Sign in with email/Password
    ],
	adapter: MongoDBAdapter(clientPromise, { databaseName: "Management" }),
	session: {
		strategy: "jwt",
	},
	callbacks: {
		async signIn({ user }) {
		  	const email = user.email;
	
			if (!email?.endsWith("@gmail.com")) {
				console.log("Invalid email:", email);
				return false;
			}
	
			try {
				const client = await clientPromise;
				const db = client.db("Management");
				const userExists = await db.collection("members").findOne({ email });
	
				if (!userExists) {
					console.log("Account does not exist in database:", email);
					return false;
				}

				return true; 

			} catch (error) {
				console.error("Email check error:", error);
				return false;
			}
		},
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
				token.email = user.email;
				token.role = user.role;

				const client = await clientPromise;
				const db = client.db("Management");
				const member = await db.collection("members").findOne({ email: user.email });
		
				if (member) {
					token.nickname = member.nickname;
					token.role = member.role;
				}
			}
			return token;
		},
		async session({ session, token }) {
			session.user.id = token.id;
			session.user.nickname = token.nickname;
			session.user.role = token.role;
			return session;
		},
	},
	pages: {
		error: '/',
    	signOut: '/',
	},
	secret: process.env.NEXTAUTH_SECRET,
};