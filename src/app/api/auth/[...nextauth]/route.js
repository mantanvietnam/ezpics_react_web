import axiosInstance from "@/api/axiosInstance";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        })
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account.provider === "google") {
                try {
                    const response = await axiosInstance.post('/checkLoginGoogleAPI', {
                        email: user.email,
                        id_google: user.id,
                        avatar: user.image,
                        name: user.name
                    });
                    account.token = response?.info_member?.token_web
                    account.user_login = response?.info_member
                } catch (error) {
                    console.error('Error saving user data to external API:', error);
                    return false;
                }
            }
            return true;
        },
        async jwt({ token, account }) {
            if (account?.token) {
                token.accessToken = account.token;
                token.user_login = account.user_login;
            }
            return token;
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken;
            session.user_login = token.user_login;
            return session;
        },
        async redirect({ url, baseUrl }) {
            return baseUrl;
        },
    },
    secret: process.env.GOOGLE_CLIENT_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

