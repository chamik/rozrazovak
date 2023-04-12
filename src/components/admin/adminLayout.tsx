import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/dist/server/api-utils";
import Link from 'next/link';
import { useRouter } from 'next/router';
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
        name: 'Otázky',
        route: '/admin/questions',
    },
];

export const AdminLayout: React.FC<React.PropsWithChildren> = ({children}) => {
    const router = useRouter();
    const { data: session } = useSession();

    if (!session)
        router.push('/');

    const user = session?.user;

    // TODO: userouter to color the currently used tab
    return (
        <div className="flex flex-col purple-gradient">
            <nav className="border-b-2 mb-10 flex flex-row justify-around w-full h-24 bg-purple-100 rounded-b-3xl">
                <div className="flex flex-row h-full p-2 gap-6 ml-10">
                    {ADMIN_TABS.map(route => (
                        <Link
                            key={route.route}
                            href={route.route}
                        >
                            <a className="text-2xl my-auto">{route.name}</a>
                        </Link>
                    ))}
                </div>
                <div className="flex h-full ml-auto mr-20 p-2">
                    <img className="rounded-full w-16 my-auto" src={user?.image!} alt="User profile picture" />
                    <div className="p-3 my-auto mx-4">
                        <p className="font-extrabold text-lg">{user?.name}</p>
                        <button className="text-slate-500 hover:underline hover:font-semibold" onClick={() => signOut()}>
                            Odhlásit se
                        </button>
                    </div>
                </div>
            </nav>
            <div className="w-[70rem] bg-purple-100 mx-auto rounded-2xl shadow">
                {children}
            </div>
            <footer className="flex flex-row justify-start w-full h-14 px-8 gap-4">
                <p className="font-semibold my-auto">Rozřazovák 2023</p>
            </footer>
        </div>
    )
};