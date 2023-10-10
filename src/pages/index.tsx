import type { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import { LoggedInView } from "../components/loggedInView";
import { env } from "../env/client.mjs";
import Link from "next/link";

const Home: NextPage = () => {
    const { data: session } = useSession();
    const SUBTITLE = env.NEXT_PUBLIC_SUBTITLE;

    return (
        <main className="flex flex-col h-screen purple-gradient">
        {session ? (
            <div className="bg-slate-50 rounded-xl flex flex-col md:flex-row p-2 m-auto shadow w-5/6 max-w-3xl">
                <LoggedInView />
            </div>
        ) : (
            <div className="flex flex-col md:flex-row bg-slate-50 w-4/5 max-w-3xl rounded-md shadow-lg p-7 max-h-72 my-auto">
                <div className="flex flex-col my-auto md:ml-6">
                    <h1 className="font-extrabold text-2xl text-center">Rozřazovák</h1>
                    <h3 className="text-slate-600 font-semibold text-center">{SUBTITLE}</h3>
                </div>

                <div className="flex flex-col mt-8 md:mt-0 md:mx-auto">
                    <button className="major-button mx-auto" onClick={() => signIn('google')}>Přihlásit se</button>
                    <p className="mt-2 text-slate-600 font-semibold text-center">se školním Google účtem</p>
                </div>
            </div>
        )}
        <div className="pt-auto w-full">
            <Link href="/about">
                <p className="text-center mx-4 p-2 underline text-purple-900">O programu</p>
            </Link>
        </div>
        </main>
    );
};

export default Home;