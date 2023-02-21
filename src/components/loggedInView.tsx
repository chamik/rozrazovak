import { User } from "@prisma/client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { trpc } from "../utils/trpc";

export const LoggedInView: React.FC = () => {
    const { data: session } = useSession()
    const year = new Date().getFullYear();
    const userData = trpc.auth.getUserData.useQuery();

    if (!userData.data) return (
        <>něco se pokazilo :/</>
    );

    const {
        user,
        activeTest
    } = userData?.data;

    return (
        <div className="bg-slate-50 rounded-xl flex flex-row w-[60rem] justify-between p-10 m-auto shadow">
            <div className="flex flex-col w-80 items-center gap-3 pr-3 justify-between">
                <div className="pb-6 text-center">
                    <img className="rounded-full w-40 mx-auto" src={session!.user!.image!} alt="User profile picture" />
                    <h3 className="text-3xl font-medium mt-4">{session!.user!.name!}</h3>
                    <p className="text-slate-500">{!user?.isTeacher ? "Ročník: " + toRoman(user.classYear) : "Učitel"}</p>
                </div>

                <button className="bg-slate-100 hover:bg-red-600 hover:text-white px-4 py-1 rounded shadow transition duration-100 w-2/3" onClick={() => signOut()}>Odhlásit se</button>
            </div>
            <div className="flex flex-col w-full px-8 justify-between">
                <h1 className="text-5xl font-semibold">Rozřazovací test AJ {year}</h1>
                {activeTest ? (
                    <>
                        <div className="py-6 text-xl">
                            <p>{activeTest.grammarA2Amount} otázek</p>
                            <p>{activeTest.timeLimit} minut</p>
                        </div>
                        <button className="bg-green-200 hover:bg-green-500 hover:text-white mx-auto px-4 py-1 rounded shadow transition duration-100 w-1/3">Začít test</button>
                    </>
                ) : (
                    <>
                        {user.isTeacher ? (
                            <>
                                <div className="py-6 text-xl text-center">
                                    <p>Vás už žádné testy nečekají :)</p>
                                </div>
                                <span className="bg-green-200 hover:bg-green-500 hover:text-white text-center mx-auto px-4 py-1 rounded shadow transition duration-100 w-1/3"><Link href="/admin/">Přejít do administrace</Link></span>
                            </>
                        ) : (
                            <>
                                <p className="text-center ">Právě pro tebe není zadaný žádný test :(</p>
                            </>
                        )}
                    </>
                )}
            </div>

        </div>
    );
};

type YearSubProps = {
    user: User,
};

const YearSub: React.FC<YearSubProps> = (props) => {
    const {
        user,
    } = props;

    return (
        <></>
    );
}

function toRoman(num: number | null): string {
    if (num == null) return "učitel";
    if (num >= 5) return "V" + toRoman(num - 5);
    if (num >= 4) return "IV" + toRoman(num - 4);
    if (num >= 1) return "I" + toRoman(num - 1);
    return "";
}