import type { NextPage } from "next";
import { env } from "../env/client.mjs";
import Link from "next/link";

const About: NextPage = () => {
    const REPO = env.NEXT_PUBLIC_REPOSITORY;
    const MAIL = env.NEXT_PUBLIC_CONTACT_EMAIL;
    
    return (
        <main className="flex flex-col h-screen purple-gradient p-4">
            <div className="m-auto w-full max-w-3xl px-10 py-7 shadow-lg items-center rounded-2xl bg-purple-50">
                <h2 className="text-2xl font-bold text-center mb-5">O programu</h2>
                <p className="mb-3"><b>Rozřazovák</b> byl vytvořen Kubíkem Hamplem (stále ještě studentem GJP-ME) jakožto středoškolská odborná činnost a maturitní práce. Vznikl pro usnadnění celého toho procesu. Tvoje výsledky se automaticky hned vyhodnotí, testy se vytváří docela jednoduše a vše je to přes školní účet.</p>
                <p className="mb-3 font-bold">Neručím za kvalitu otázek!</p>
                <p className="mb-3">Pokud jsi měl při vyplňování nějaké potíže, dej vědět svému učiteli jazyka, případně napiš aktuálnímu správci: <span className="font-mono font-bold">{MAIL}</span></p>
                <p>Pokud máš nějaké připomínky k samotnému programu, jeho zdroj najdeš na </p>
                <p className="mb-5"><a className="text-purple-900 underline" href={REPO}>{REPO}</a></p>
                <p className="mb-5">Hodně štěstí při vyplňování :)</p>
                <p className="mb-3"><Link className="text-purple-900 underline" href="/">VRAŤ SE ZPĚT</Link></p>
            </div>
        </main>
    );
};

export default About;