import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../server/db/client";
import { env } from "../../../env/server.mjs";

export const authOptions: NextAuthOptions = {
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }

      // TODO: pozor, Marian
      const teacherEmails = env.TEACHER_EMAILS;

      if (teacherEmails.includes(user.email!)) {
        await prisma.user.update({
          where: {
            email: user.email!,
          },
          data: {
            classYear: 0,
            isTeacher: true,
          }
        });
      } else {
        const userClassYear = parseUserLevel(user.email!);

        await prisma.user.update({
          where: {
            email: user.email!,
          },
          data: {
            classYear: userClassYear,
            isTeacher: false,
          }
        })
      }

      return session;
    },
    async signIn({ account, user, profile }) {
      if (profile === undefined) return '/begone';

      // TODO: not redirecting unauthorized domain emails
      if (profile.email?.endsWith("@gjp-me.cz")) return true;
      if (env.TEACHER_EMAILS.includes(profile.email!)) return true;  // this is just so I can debug with my private email
      return '/begone'
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET
    })
  ],
};

export default NextAuth(authOptions);

// TODO: write a test for this or smth
function parseUserLevel(email: string) {
  const emailId = email.split('@')[0];

  const date = new Date()
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth();

  const userYear = 2000 + parseInt(emailId!.slice(0, 2)!);

  let level = 0
  if (emailId?.slice(2, 4) == '08')
    level = currentYear - userYear;
  else
    level = currentYear - userYear + 4;
  
  // školní roky :)
  // currentMonth se počítá od nuly, takže září je 8
  if (8 <= currentMonth && currentMonth <= 11 )
    level += 1;

  return level;
}