import type { NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";

const Home: NextPage = () => {
  const { data: session } = useSession()
  const year = new Date().getFullYear(); 

  return (
    <div className="bg-slate-200">
      <Head>
        <title>Rozřazovák {year}</title>
        <meta name="description" content="Rozřazovací testy pro GJP-ME." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex mx-auto flex-col">
        <div className="mx-auto">
          <header className="text-6xl">
            <h1>Rozřazovák <span className="text-slate-800">{year}</span></h1>
          </header>
        </div>
      </main>
    </div>
  );
};

export default Home;