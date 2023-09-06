import { Test, User } from "@prisma/client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import test from "node:test";
import { toRoman } from "../utils/functions";
import { trpc } from "../utils/trpc";

export const LoggedInView: React.FC = () => {
    const { data: session } = useSession()
    const year = new Date().getFullYear();

    // TODO: refresh every n seconds
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
                    <img className="rounded-full w-44 mx-auto" src={session!.user!.image!} alt="User profile picture" />
                    <h3 className="text-2xl font-extrabold mt-4">{session!.user!.name!}</h3>
                    <p className="text-slate-700">{!user?.isTeacher ? toRoman(user.classYear) + ". ročník" : "Učitel"}</p>
                </div>

                <button className="text-slate-700 bg-purple-100 hover:bg-red-600 hover:text-white px-4 py-2 rounded-3xl font-semibold transition duration-100 w-2/3" onClick={() => signOut()}>Odhlásit se</button>
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

    const amount = activeTest?.grammarA1Amount + activeTest?.grammarA2Amount + activeTest?.grammarB1Amount + activeTest?.grammarB2Amount + activeTest?.grammarC1Amount + activeTest?.grammarC2Amount;
    const diff = getDifficulties(activeTest);

    //TODO: make that data actually accurate xd
    return (
        <div className="flex flex-col border-2 rounded-xl shadow-lg h-full p-12">
            <div className="flex flex-col w-full h-full gap-6">
                <div className="flex flex-row">
                    <img src='/svg/hourglass-solid.svg' alt='aye' className="text-blue-200 w-5 opacity-50"/>
                    <p className="text-xl mx-6 my-auto"><span className="font-bold">{activeTest.timeLimit}</span> minut</p>
                </div>
                <div className="flex flex-row">
                    <img src='/svg/question-solid.svg' alt='aye' className="text-blue-200 w-5 opacity-50"/>
                    <p className="text-xl mx-6 my-auto"><span className="font-bold">{amount}</span> gramatických otázek</p>
                </div>
                <div className="flex flex-row">
                    <img src='/svg/bolt-solid.svg' alt='aye' className="text-blue-200 w-5 opacity-50"/>
                    <p className="text-xl mx-6 my-auto">obtížnost <span className="font-bold">{diff[0]}</span> {diff[0] != diff[1] && (<>až <span className="font-bold">{diff[1]}</span></>)}</p>
                </div>
            </div>

            <button className="major-button mt-6 mx-auto">
                Začít test
            </button>
        </div>
    );
}

// God is dead
const getDifficulties = (test: Test): [string, string] => {
    const diff = [test.grammarA1Amount, test.grammarA2Amount, test.grammarB1Amount, test.grammarB2Amount, test.grammarC1Amount, test.grammarC2Amount];
    const text = ["A1", "A2", "B1", "B2", "C1", "C2"];

    const easiest = diff.findIndex(d => d != 0);
    const hardest = diff.findLastIndex(d => d != 0);

    if (easiest == -1 && hardest == -1)
        return ["není", "není"];

    //@ts-ignore
    return [text[easiest], text[hardest]];
}

const TeacherView: React.FC = () => {
    return (
        <div className="flex flex-col border-2 rounded-xl shadow-lg h-full p-12">
            <div className="py-6 text-xl text-center font-bold">
                <p>Vás už žádné testy nečekají :)</p>
            </div>
                        
            <div className="mx-auto mt-auto px-4 major-button cursor-pointer"><Link href="/admin/"><p className="text-center">Přejít do administrace</p></Link></div>
        </div>
    );
}