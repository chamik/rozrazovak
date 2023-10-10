import type { NextPage } from "next";

const Begone: NextPage = () => {
    // TODO: něco sem dej
    return (
        <main className="flex flex-col h-screen purple-gradient">
            <div className="m-auto w-full max-w-md md:max-w-3xl px-10 py-7 shadow-lg items-center rounded-2xl bg-purple-50 flex flex-col md:flex-row">
                <div className="flex mb-4 md:mb-0 md:mr-4">
                    <img src="sumisplouchalik.png" alt="šumišplouchalík" />
                </div>
                <div className="flex flex-col w-full h-full p-2">
                    <p className="mb-3">koukni na něj {">:("}</p>
                    <p className="mb-3">zlobí se na tebe {">:("}</p>
                    <p className="mb-3">zlobí se na tebe, protože tu nemáš co dělat {">:("}</p>
                    <p className="mb-3">{">:("}</p>
                    <p className="mb-3">(zkus si zkontrolovat, zdali jsi nepoužil účet osobní, místo školního).</p>
                    <p className="mb-3"><a className="text-purple-900 underline" href="/">VRAŤ SE ZPĚT</a></p>
                </div>
            </div>
        </main>
    );
};

export default Begone;