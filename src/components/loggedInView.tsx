import { Test, TestSession, TestStatus, User } from "@prisma/client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import test from "node:test";
import { minuta, otazka, toRoman } from "../utils/functions";
import { trpc } from "../utils/trpc";
import { useRouter } from "next/router";

export const LoggedInView: React.FC = () => {
    const { data: session } = useSession()
    const year = new Date().getFullYear();
    const router = useRouter();

    // TODO: refresh every n seconds
    const userData = trpc.user.getUserData.useQuery();
    const beginTestMut = trpc.user.beginTest.useMutation();

    if (!userData.data) return (
        <></>
    );

    const {
        user,
        test,
        testSession,
    } = userData?.data;

    const beginTest = async () => {
        if (!testSession)
            await beginTestMut.mutateAsync();
        router.push('/test');
    };

    return (
        <div className="flex flex-col md:flex-row w-full">
            <div className="flex flex-row md:flex-col mb-5 md:w-80 md:py-6 md:mx-10">
                <img className="rounded-full w-30 md:w-48 md:mx-auto my-auto p-4" src={session!.user!.image!} alt="User profile picture" />
                <div className="flex flex-col p-4 w-full">
                    <h3 className="text-2xl font-extrabold mt-4 mx-auto text-center">{session!.user!.name!}</h3>
                    <p className="text-slate-700 text-center">{!user?.isTeacher ? toRoman(user.classYear) + ". ročník" : "Učitel"}</p>

                    <button className="text-slate-700 bg-purple-100/[.5] hover:bg-red-600 hover:text-white py-2 mt-4 rounded-3xl font-semibold transition duration-100" onClick={() => signOut()}>
                        Odhlásit se
                    </button>
                </div>
            </div>
            <div className="flex flex-col w-full">
                {user.isTeacher ? (
                    <TeacherView />
                ) : (
                    <StudentView user={user} test={test} session={testSession} beginTest={beginTest}/>
                )}
            </div>
        </div>
    );
};

type StudentViewProps = {
    user: User,
    test: Test | null,
    session: TestSession | null,
    beginTest: () => Promise<void>,
};

const StudentView: React.FC<StudentViewProps> = (props) => {
    const {
        user,
        test,
        session,
        beginTest,
    } = props;

    const calcRemainingTime = (startingTime: Date, durationMinutes: number): number => {
        const currentTime = new Date();
        const elapsedTimeMillis = currentTime.getTime() - startingTime.getTime();
        const elapsedTimeMinutes = elapsedTimeMillis / (1000 * 60);
        const remainingTimeMinutes = durationMinutes - elapsedTimeMinutes;
        return Math.max(0, remainingTimeMinutes);
    }

    if (!test)
        return (
            <div className="flex flex-col border-2 rounded-xl shadow-lg h-full p-12">
                <p className="text-xl mx-6 my-auto text-center font-bold">Aktuálně pro tebe není zadaný žádný test.</p>
            </div>
        );

    if (session?.status == TestStatus.PENDING) return(
        <div className="flex flex-col border-2 rounded-xl shadow-lg h-full p-12">
            <p className="text-xl mx-6 my-auto text-center font-bold">Test je vyplněný!</p>
        </div>
    );

    const amount = test?.grammarA1Amount + test?.grammarA2Amount + test?.grammarB1Amount + test?.grammarB2Amount + test?.grammarC1Amount + test?.grammarC2Amount;
    const diff = getDifficulties(test);

    let remainingTime = "";
    if (session) {
        remainingTime = calcRemainingTime(session.startTime, test.timeLimit).toFixed(0);
    }

    return (
        <div className="flex flex-col border-2 rounded-xl shadow-lg h-full p-12 w-full">
            <div className="flex flex-col w-full h-full gap-6">
                <div className="flex flex-row">
                    <img src='/svg/hourglass-solid.svg' alt='aye' className="text-blue-200 w-5 opacity-50"/>
                    <p className="text-xl mx-6 my-auto"><span className="font-bold">{test.timeLimit}</span> {minuta(test.timeLimit)}</p>
                </div>
                <div className="flex flex-row">
                    <img src='/svg/question-solid.svg' alt='aye' className="text-blue-200 w-5 opacity-50"/>
                    <p className="text-xl mx-6 my-auto"><span className="font-bold">{amount}</span> {otazka(amount)}</p>
                </div>
                <div className="flex flex-row">
                    <img src='/svg/bolt-solid.svg' alt='aye' className="text-blue-200 w-5 opacity-50"/>
                    <p className="text-xl mx-6 my-auto">obtížnost <span className="font-bold">{diff[0]}</span> {diff[0] != diff[1] && (<>až <span className="font-bold">{diff[1]}</span></>)}</p>
                </div>
            </div>

            {!session ? (
                <button className="major-button mt-6 mx-auto" onClick={async () => await beginTest()}>
                    Začít test
                </button>
            ) : (
                <>
                    <button className="major-button mt-6 mx-auto" onClick={async () => await beginTest()}>
                        Pokračovat
                    </button>
                    <p className="mx-auto mt-2 -mb-4">Zbývá ti <b>{remainingTime}</b> minut</p>
                </>
            )}
            
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

    //@ts-expect-error This will always be defined
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