import { signOut, useSession } from "next-auth/react";
import Link from 'next/link';
import { useRouter } from 'next/router';
import type React from 'react';

const ADMIN_TABS = [
    {
        name: 'Index',
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

    // TODO: userouter to color the currently used tab
    return (
        <div className="flex flex-row">
            <nav className="flex flex-col bg-blue-200 w-96 justify-between">
                <div className="flex flex-col gap-2 ml-8 pt-8 top-0 sticky">
                    {ADMIN_TABS.map(route => (
                        <Link
                            key={route.route}
                            href={route.route}
                        >
                            <a className="text-2xl font-semibold hover:bg-slate-200 rounded-l-md p-4">{route.name}</a>
                        </Link>
                    ))}
                </div>

                <div className="flex flex-col w-full pb-10 bottom-0 sticky">
                    <img className="rounded-full mx-auto" width={180} src={session!.user!.image!} alt="User profile picture" />
                    <h3 className="text-2xl font-medium mt-2 mx-auto">{session!.user!.name!}</h3>
                    <button className="bg-slate-100 hover:bg-red-600 hover:text-white px-4 py-1 rounded shadow transition duration-100 w-2/3 mx-auto mt-6" onClick={() => {
                        signOut();
                        router.replace('/');
                    }}>Odhlásit se</button>
                </div>
            </nav>
            {children}
        </div>
    )
};