import type { NextPage } from "next";
import Head from "next/head";
import { signIn, useSession } from "next-auth/react";
import { AdminSidePanel } from "../../components/adminSidePanel";

const Home: NextPage = () => {
  const { data: session } = useSession()
  const year = new Date().getFullYear(); 

  return (
    <>
        <Head>
          <title>Rozřazovák {year} | Učitel</title>
          <meta name="description" content="Rozřazovací testy pro GJP-ME." />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main>
          <AdminSidePanel />
          <div>

          </div>
        </main>
    </>
  );
};

export default Home;