import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { NextPageWithLayout } from "../../_app";
import { AdminLayout } from "../../../components/admin/adminLayout";
import { TestEdit } from "../../../components/admin/testEdit";
import { Test } from "@prisma/client";
import { trpc } from "../../../utils/trpc";
import { toRoman } from "../../../utils/functions";
import { useState } from "react";
import { Modal } from "../../../components/admin/modal";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";

const AdminQuestion: NextPageWithLayout = () => {
    const testsData = trpc.admin.getAllTests.useQuery();
    const testQuery = trpc.admin.getTestById.useMutation();
    const availQuery = trpc.admin.getQuestionLevels.useQuery();
    const testStartMut = trpc.admin.toggleTest.useMutation();

    const tests = testsData.data?.tests.sort((a, b) => a.class - b.class);
    const avail = availQuery.data!;

    const utils = trpc.useContext();
    const router = useRouter();
    const params = useSearchParams();

    const [testId, setTestId] = useState(0);
    const [testTime, setTestTime] = useState(0);
    const [grammarA1Amount, setGrammarA1Amount] = useState(0);
    const [grammarA2Amount, setGrammarA2Amount] = useState(0);
    const [grammarB1Amount, setGrammarB1Amount] = useState(0);
    const [grammarB2Amount, setGrammarB2Amount] = useState(0);
    const [grammarC1Amount, setGrammarC1Amount] = useState(0);
    const [grammarC2Amount, setGrammarC2Amount] = useState(0);
    const [availableQuestions, setAvailableQuestions] = useState([0, 0, 0, 0, 0, 0]);

    const goBack = async () => {
        try {
            await saveTest();
            router.push('/admin/tests');
            utils.admin.getAllTests.invalidate();
        } catch { }
    }

    const getTestData = async (id: number) => {
        const test = await testQuery.mutateAsync({testId: id});

        if (!test || !avail || avail.length < 6)
            return;

        setTest(test);
        setAvailableQuestions(avail);
    }

    const setTest = (test: Test) => {
        setTestId(test.id);
        setTestTime(test.timeLimit);
        setGrammarA1Amount(test.grammarA1Amount);
        setGrammarA2Amount(test.grammarA2Amount);
        setGrammarB1Amount(test.grammarB1Amount);
        setGrammarB2Amount(test.grammarB2Amount);
        setGrammarC1Amount(test.grammarC1Amount);
        setGrammarC2Amount(test.grammarC2Amount);
    }

    const toggleTest = async (testId: number) => {
        await testStartMut.mutateAsync({
            testId,
        });
        utils.admin.getAllTests.invalidate();
    };

    const saveMutation = trpc.admin.saveTest.useMutation();
    const saveTest = async () => {
        await saveMutation.mutateAsync({
            id: testId,
            timeLimit: testTime,
            grammarA1Amount: grammarA1Amount,
            grammarA2Amount: grammarA2Amount,
            grammarB1Amount: grammarB1Amount,
            grammarB2Amount: grammarB2Amount,
            grammarC1Amount: grammarC1Amount,
            grammarC2Amount: grammarC2Amount,
        });
    }

    //TODO: Call to action (not needed? if still at bottom of page :thonk:)
    if (!tests || tests.length == 0) return (
        <>
            nic :
        </>
    )

    return (
        <>
            <Head>
                <title>Rozřazovák | Admin panel</title>
                <meta name="description" content="Admin panel" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="flex min-h-screen flex-col w-full">
                {params.has("id") && <Modal onClose={async () => {
                        goBack();
                    }}>
                    <TestEdit binding={{
                        testId,
                        setTestId,
                        testTime,
                        setTestTime,
                        grammarA1Amount,
                        setGrammarA1Amount,
                        grammarA2Amount,
                        setGrammarA2Amount,
                        grammarB1Amount,
                        setGrammarB1Amount,
                        grammarB2Amount,
                        setGrammarB2Amount,
                        grammarC1Amount,
                        setGrammarC1Amount,
                        grammarC2Amount,
                        setGrammarC2Amount,
                        availableQuestions,
                        goBack,
                    }} />
                </Modal>}
                <TestsListing tests={tests} getTestDataCallback={(id) => getTestData(id)} toggleTest={toggleTest} />
            </main>
        </>
    );
};

type TestsListingProps = {
    tests: Test[] | undefined
    getTestDataCallback: (id: number) => void,
    toggleTest: (testId:number) => void,
};

const TestsListing: React.FC<TestsListingProps> = (props) => {
    const {
        tests,
        getTestDataCallback,
        toggleTest,
    } = props;

    if (!tests) return (
        <>
            unable to load tests, call Kubík, something went wrong :p
        </>
    );

    return (
        <div className="flex flex-col ">
            {tests.map(test => (
                <div className="flex flex-row w-full border-2 border-purple-300 shadow h-40 rounded-md mb-10">
                    <div className="flex flex-col bg-purple-200 p-4 rounded-r-md">
                        <h2 className="font-semibold text-3xl">{toRoman(test.class)}. ročník</h2>
                        <div className="mt-8 text-slate-500">
                            <p>Status:</p>
                            <p className={`text-2xl font-bold ${test.started ? "text-green-600" : "text-red-600"}`}>
                                {test.started ? "AKTIVNÍ" : "VYPNUTÝ"}
                            </p>
                        </div>
                    </div>
                    <div className="ml-10 flex flex-col bg-purple-100 p-4">
                        <h3 className="font-semibold text-slate-500 mt-1 mb-2 text-center">Gramatika</h3>
                        <div className="flex flex-row">
                            <div className="flex flex-col my-auto text-xl text-slate-500 mr-7">
                                <p>A1 <span className="ml-2 font-bold text-slate-700">{test.grammarA1Amount}</span></p>
                                <p>B1 <span className="ml-2 font-bold text-slate-700">{test.grammarB1Amount}</span></p>
                                <p>C1 <span className="ml-2 font-bold text-slate-700">{test.grammarC1Amount}</span></p>
                            </div>
                            <div className="flex flex-col my-auto text-xl text-slate-500">
                                <p>A2 <span className="ml-2 font-bold text-slate-700">{test.grammarA2Amount}</span></p>
                                <p>B2 <span className="ml-2 font-bold text-slate-700">{test.grammarB2Amount}</span></p>
                                <p>C2 <span className="ml-2 font-bold text-slate-700">{test.grammarC2Amount}</span></p>
                            </div>
                        </div>
                        
                    </div>
                    <div className="ml-10 flex flex-col bg-purple-100 p-4">
                        <h3 className="font-semibold text-slate-500 mt-1 mb-2 text-center">Čas testu</h3>
                        <div className="flex flex-col text-xl text-slate-500">
                            <p><span className="ml-2 font-bold text-slate-700">{test.timeLimit}</span> min.</p>
                        </div>
                    </div>
                    <div className="flex flex-col justify-evenly ml-auto mr-4">
                        {!test.started && (
                            <Link href={`/admin/tests/?id=${test.id}`} key={test.id} onClick={() => getTestDataCallback(test.id)} className="mx-auto text-slate-500 hover:ring-2 ring-purple-600 rounded-3xl font-semibold py-2 px-5">
                                Nastavení
                            </Link>
                        )}
                        
                        <button className="major-button" onClick={async () => await toggleTest(test.id)}>
                            {test.started ? "ZASTAVIT" : "SPUSTIT"}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

AdminQuestion.Layout = AdminLayout;

export default AdminQuestion;
