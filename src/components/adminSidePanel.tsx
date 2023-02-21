import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { trpc } from "../utils/trpc";

export const AdminSidePanel: React.FC = () => {
    const { data: session } = useSession()
    const user = trpc.auth.getUserData.useQuery();
    //const tests = await prisma?.classroom.findMany();

    if (!user.data) return (
        <></>
    );
    return (
        <aside className="w-96 bg-gray-50 h-screen">
            <div className="flex flex-col justify-between h-screen">
                <div className="">
                    <h2>Testy</h2>
                    {/* {
                        tests!.map((item, i) => (
                            <div className="flex flex-row w-max h-20">

                            </div>
                        ))
                    } */}

                    {/* Dummy items */}
                    <div className="flex flex-row w-max h-20">
                        <h1>Ročník 7.</h1>
                    </div>
                </div>
                <div className="flex flex-row mt-auto">
                    <img className="rounded-full w-30" src={session!.user!.image!} alt="User profile picture" />
                    <div className="flex flex-col">
                        <h3 className="text-3xl font-medium mt-4">{session!.user!.name!}</h3>
                        <button className="bg-slate-100 hover:bg-red-600 hover:text-white px-4 py-1 rounded shadow transition duration-100 w-2/3" onClick={() => signOut()}>Odhlásit se</button>
                    </div>
                </div>
            </div>
        </aside>
    );
}