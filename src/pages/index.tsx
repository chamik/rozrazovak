import type { NextPage } from "next";
import Head from "next/head";
import { signIn, useSession } from "next-auth/react";
import { LoggedInView } from "../components/loggedInView";

const Home: NextPage = () => {
  const { data: session } = useSession()
  const year = new Date().getFullYear(); 

  return (
    <>
        <Head>
          <title>Rozřazovák {year}</title>
          <meta name="description" content="Rozřazovací testy pro GJP-ME." />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="flex flex-col items-center justify-center h-screen">
          {session ? (<LoggedInView/>)
          : (
            <div className="bg-white rounded-xl flex flex-col w-[55rem] justify-between p-10 m-auto shadow text-center">
              <h1 className="text-5xl">Rozřazovací test AJ {year}</h1>
              <button className="bg-slate-200 hover:bg-green-500 hover:text-white px-4 py-1 mt-6 rounded shadow transition duration-100 w-30 mx-auto" onClick={() => signIn('google')}>Přihlásit se</button>
            </div>
          )}
        </main>
    </>
  );
};

export default Home;