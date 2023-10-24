import { signOut, useSession } from "next-auth/react";
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import type React from 'react';

const ADMIN_TABS = [
    {
        name: 'Přehled',
        route: '/admin',
    },
    {
        name: 'Testy',
        route: '/admin/tests',
    },
    {
        name: 'Gramatika',
        route: '/admin/grammar',
    },
];

export const AdminLayout: React.FC<React.PropsWithChildren> = ({children}) => {
    const { data: session } = useSession();

    const user = session?.user;
    const pathname = usePathname();

    return (
        <div className="flex flex-col purple-gradient min-h-screen">
            <nav className="border-2 mb-10 mt-6 flex flex-row justify-around w-[70rem] mx-auto h-24 bg-purple-100 rounded-3xl">
                <div className="flex flex-row h-full p-2 gap-10 ml-10">
                    {ADMIN_TABS.map(route => (
                        <Link
                            key={route.route}
                            href={route.route}
                            className={`text-xl my-auto font-extrabold border-4 rounded-xl px-2 py-1 border-purple-200 ${pathname == route.route ? "font-black  border-purple-800" : ""}`}
                        >
                            {route.name}
                        </Link>
                    ))}
                </div>
                <div className="flex h-full ml-auto mr-20 p-2">
                    {user?.image && (
                        <img className="rounded-full w-16 my-auto" src={user.image} alt="User profile picture" />
                    )}
                    <div className="p-3 my-auto mx-4">
                        <p className="font-extrabold text-lg">{user?.name}</p>
                        <button className="text-slate-500 hover:underline hover:font-semibold" onClick={() => signOut()}>
                            Odhlásit se
                        </button>
                    </div>
                </div>
            </nav>
            <div className="w-[70rem] bg-purple-100 mx-auto rounded-2xl shadow p-12">
                {children}
            </div>
            <footer className="flex flex-row justify-start w-full h-14 px-8 gap-4 mt-auto">
                <p className="font-semibold my-auto">Rozřazovák 2023</p>
            </footer>
        </div>
    )
};