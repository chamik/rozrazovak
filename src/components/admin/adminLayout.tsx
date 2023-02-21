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
    const { data: session } = useSession()

    if (!session) {
        router.replace('/')
    }

    return (
        <div className="flex flex-row">
            <nav className="flex flex-col bg-blue-200 w-96">
                <div className="flex flex-col gap-2 ml-5 mt-8">
                    {ADMIN_TABS.map(route => (
                        <Link
                            key={route.route}
                            href={route.route}
                            className={"text-2xl"}
                        >
                            <a>{route.name}</a>
                        </Link>
                    ))}
                </div>

                <div className="flex flex-col mt-auto w-full mb-10">
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