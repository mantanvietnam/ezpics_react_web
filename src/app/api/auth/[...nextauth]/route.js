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
            }
            return token;
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken;
            return session;
        },
        async redirect({ url, baseUrl }) {
            return baseUrl + '/test';
        },
    },
    secret: process.env.GOOGLE_CLIENT_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

