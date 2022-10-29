import { signOut, useSession } from "next-auth/react";

export const LoggedInView : React.FC = () => {
    const { data: session } = useSession()
    const year = new Date().getFullYear();

    return (
        <div className="bg-white rounded-xl flex flex-row w-[55rem] justify-between p-10 m-auto shadow">
            <div className="flex flex-col w-80 items-center gap-3">
                <div className="pb-6">
                    <img className="rounded-full w-40" src={session!.user!.image!} alt="User profile picture" />
                    <h3 className="text-3xl font-medium mt-4">{session!.user!.name!}</h3>
                </div>
                <button className="bg-slate-200 hover:bg-red-600 hover:text-white px-4 py-1 rounded shadow transition duration-100" onClick={() => signOut()}>Odhlásit se</button>
            </div>
            <div className="flex flex-col w-full px-6">
                <h1 className="text-5xl">Rozřazovací test AJ {year}</h1>
                <div className="py-6 text-xl">
                    <p>40 otázek</p>
                    <p>45 minut</p>
                </div>
                <button className="bg-green-200 hover:bg-green-500 hover:text-white rounded shadow transition duration-100">Začít test</button>
            </div>
        </div>
    );
}