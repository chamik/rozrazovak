import { Test, User } from "@prisma/client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { trpc } from "../utils/trpc";

export const LoggedInView: React.FC = () => {
    const { data: session } = useSession()
    const year = new Date().getFullYear();
    const userData = trpc.auth.getUserData.useQuery();

    if (!userData.data) return (
        <></>
    );

    const {
        user,
        activeTest
    } = userData?.data;

    return (
        <div className="bg-slate-50 rounded-xl flex flex-row w-[60rem] justify-between p-10 m-auto shadow">
            <div className="flex flex-col w-96 items-center gap-3 justify-between p-10">
                <div className="pb-6 text-center">
                    <img className="rounded-full w-40 mx-auto" src={session!.user!.image!} alt="User profile picture" />
                    <h3 className="text-2xl font-extrabold mt-4">{session!.user!.name!}</h3>
                    <p className="text-slate-700">{!user?.isTeacher ? toRoman(user.classYear) + ". ročník" : "Učitel"}</p>
                </div>

                <button className="text-slate-700 hover:bg-red-600 hover:text-white px-4 py-2 rounded-3xl font-semibold transition duration-100 w-2/3" onClick={() => signOut()}>Odhlásit se</button>
            </div>
            <div className="flex flex-col w-full px-8">
                {user.isTeacher ? (
                    <TeacherView />
                ) : (
                    <StudentView user={user} activeTest={activeTest}/>
                )}
            </div>
        </div>
    );
};

type StudentViewProps = {
    user: User,
    activeTest: Test | null,
};

const StudentView: React.FC<StudentViewProps> = (props) => {
    const {
        user,
        activeTest,
    } = props;

    if (!activeTest || !activeTest.started)
        return (
            <div className="flex flex-col border-2 rounded-xl shadow-lg h-full p-12">
                <p className="text-xl mx-6 my-auto text-center font-bold">Aktuálně pro tebe není zadaný žádný test.</p>
            </div>
        );

    return (
        <div className="flex flex-col border-2 rounded-xl shadow-lg h-full p-12">
            <div className="flex flex-col w-full h-full gap-6">
                <div className="flex flex-row">
                    <img src='/svg/hourglass-solid.svg' alt='aye' className="text-blue-200 w-5 opacity-50"/>
                    <p className="text-xl mx-6 my-auto"><span className="font-bold">45</span> minut</p>
                </div>
                <div className="flex flex-row">
                    <img src='/svg/question-solid.svg' alt='aye' className="text-blue-200 w-5 opacity-50"/>
                    <p className="text-xl mx-6 my-auto"><span className="font-bold">56</span> otázek</p>
                </div>
                <div className="flex flex-row">
                    <img src='/svg/bolt-solid.svg' alt='aye' className="text-blue-200 w-5 opacity-50"/>
                    <p className="text-xl mx-6 my-auto">obtížnost <span className="font-bold">B1</span> až <span className="font-bold">C1</span></p>
                </div>
            </div>

            <button className="major-button mt-6 mx-auto">
                Začít test
            </button>
        </div>
    );
}

const TeacherView: React.FC = () => {
    return (
        <div className="flex flex-col border-2 rounded-xl shadow-lg h-full p-12">
            <div className="py-6 text-xl text-center font-bold">
                <p>Vás už žádné testy nečekají :)</p>
            </div>
                        
            <div className="mx-auto mt-auto px-4 major-button"><Link href="/admin/"><p className="text-center">Přejít do administrace</p></Link></div>
        </div>
    );
}

function toRoman(num: number | null): string {
    if (num == null) return "učitel";
    if (num >= 5) return "V" + toRoman(num - 5);
    if (num >= 4) return "IV" + toRoman(num - 4);
    if (num >= 1) return "I" + toRoman(num - 1);
    return "";
}