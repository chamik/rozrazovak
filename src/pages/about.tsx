import type { NextPage } from "next";
import { env } from "../env/client.mjs";

const About: NextPage = () => {
    const REPO = env.NEXT_PUBLIC_REPOSITORY;
    const MAIL = env.NEXT_PUBLIC_CONTACT_EMAIL;
    
    // TODO: něco sem dej
    return (
        <main className="flex flex-col h-screen purple-gradient p-4">
            <div className="m-auto w-full max-w-3xl px-10 py-7 shadow-lg items-center rounded-2xl bg-purple-50">
                <h2 className="text-2xl font-bold text-center mb-5">O programu</h2>
                <p className="mb-3"><b>Rozřazovák</b> byl vytvořen Kubíkem Hamplem (stále ještě studentem GJP-ME) jakožto středoškolská odborná činnost. Vznikl pro usnadnění celého toho procesu – Tvoje výsledky se automaticky hned vyhodnotí, testy se vytváří docela jednoduše a vše je to přes školní účet.</p>
                <p className="mb-3">Neručím za kvalitu otázek!</p>
                <p className="mb-3">Pokud jsi měl při vyplňování nějaké potíže, napiš aktuálnímu správci: <span className="font-mono font-bold">{MAIL}</span></p>
                <p className="mb-3">Pokud máš nějaké připomínky k samotnému programu, jeho zdroj najdeš na <a href={REPO} className="text-purple-900 underline">{REPO}</a></p>
                <p className="mb-3">Hodně štěstí při vyplňování :)</p>
            </div>
        </main>
    );
};

export default About;