import type { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import { LoggedInView } from "../components/loggedInView";

const Home: NextPage = () => {
    const { data: session } = useSession()
    const year = new Date().getFullYear();

    return (
        <>
            <main className="flex flex-col items-center justify-center h-screen purple-gradient">
                <div className="m-auto">
                    {/* <h1 className="text-2xl font-semibold mt-auto text-center mb-4">Rozřazovací test AJ {year}</h1> */}
                    {session ? (<LoggedInView />)
                    : (
                            <div className="bg-slate-50 rounded-xl flex flex-row w-[55rem] justify-between p-10 mx-auto shadow text-center">
                                <div className="w-1/3 flex flex-col h-full my-auto">
                                    <h1 className="font-extrabold text-2xl">Rozřazovák {year}</h1>
                                    <p className="mt-1 text-slate-600 font-semibold">rozřazovací test pro GJP-ME</p>
                                </div>
                                <div className="w-2/3 flex flex-col h-full m-auto">
                                    <button className="major-button" onClick={() => signIn('google')}>Přihlásit se</button>
                                    <p className="mt-2 text-slate-600 font-semibold">se školním Google účtem</p>
                                </div>
                            </div>
                    )}
                </div>
            </main>
        </>
    );
};

export default Home;