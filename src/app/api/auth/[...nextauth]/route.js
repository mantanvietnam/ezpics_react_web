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
        async signIn({ user, account }) {
            if (account.provider === "google") {
                const newUser = {
                    email: user.email,
                    googleId: user.id,
                    avatar: user.image,
                    name: user.name
                };
                try {
                    console.log(newUser);
                } catch (error) {
                    console.error('Error saving user data to external API:', error);
                }
            }
            return true;
        },
        async redirect({ url, baseUrl }) {
            const urlNew = baseUrl + '/test'
            return urlNew;
        },
    },
    secret: process.env.GOOGLE_CLIENT_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

