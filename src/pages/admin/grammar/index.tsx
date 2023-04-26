import { GetServerSideProps, type NextPage } from "next";
import Link from "next/link";
import { NextPageWithLayout } from "../../_app";
import { AdminLayout } from "../../../components/admin/adminLayout";
import { trpc } from "../../../utils/trpc";
import { getServerAuthSession } from "../../../server/common/get-server-auth-session";
import { Question } from "@prisma/client";
import { GrammarEdit } from "../../../components/admin/grammarEdit";
import { Modal } from "../../../components/admin/modal";
import { useRouter, useSearchParams } from "next/navigation";
import { numToLevel } from "../../../utils/functions";
import { useState } from "react";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const session = await getServerAuthSession(ctx);

    if (!session) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    return {
        props: { session },
    };
};

const AdminQuestion: NextPageWithLayout = () => {
    const questionsData = trpc.admin.getAllQuestions.useQuery();
    const questionQuery = trpc.admin.getQuestionById.useMutation();
    const newQuestionMutation = trpc.admin.newQuestion.useMutation();
    const questions = questionsData.data?.questions.sort((a, b) => a.id - b.id);
    const utils = trpc.useContext();

    const router = useRouter();
    const params = useSearchParams();

    const [questionId, setQuestionId] = useState(0);
    const [questionText, setQuestionText] = useState("")
    const [questionLevel, setQuestionLevel] = useState(0)
    const [questionRightAnswer, setQuestionRightAnswer] = useState("")
    const [questionWrongAnswers, setQuestionWrongAnswers] = useState([""]);

    const getQuestionData = async (id: number) => {
        const question = await questionQuery.mutateAsync({questionId: id})
        // I think it's okay to use ! here because the data will be fetched based on ids that are listed
        
        if (!question)
            return;

        setQuestion(question);
    }

    const setQuestion = (question: Question) => {
        setQuestionId(question.id);
        setQuestionText(question.questionText);
        setQuestionLevel(question.languageLevel);
        setQuestionRightAnswer(question.rightAnswer);
        setQuestionWrongAnswers(question.wrongAnswers);
    }

    const saveMutation = trpc.admin.saveQuestion.useMutation();
    const saveQuestion = async () => {
        await saveMutation.mutateAsync({
            questionId: questionId,
            questionText: questionText,
            languageLevel: questionLevel,
            pointAmount: 1,
            rightAnswer: questionRightAnswer,
            wrongAnswers: questionWrongAnswers,
        });
    }

    const newQuestion = async () => {
        const question = await newQuestionMutation.mutateAsync({
            questionText: "",
            languageLevel: 0,
            pointAmount: 1,
            rightAnswer: "",
            wrongAnswers: ["", "", ""],
        });

        setQuestion(question);
        router.push(`/admin/grammar?id=${question.id}`)
    }

    if (!questions || questions.length == 0) return (
        <div className="w-full flex flex-col">
            <p className="text-center text-lg">V databázi zatím nejsou žádné otázky</p>
            <button className="mx-auto ml-auto my-3 bg-purple-800 shadow-sm font-extrabold py-2 px-5 rounded-3xl text-slate-200 hover:ring-2" onClick={() => {
                newQuestion();
                utils.admin.getAllQuestions.invalidate();
            }}>
                Vytvořit novou otázku
            </button>
        </div>
    )

    return (
        <>
            <main className="flex-col w-full">
                {params.has("id") && <Modal onClose={async () => {
                    await saveQuestion();
                    router.push('/admin/grammar');
                    utils.admin.getAllQuestions.invalidate();
                    }}>
                    <GrammarEdit binding={{
                        questionId,
                        setQuestionId,
                        questionText,
                        setQuestionText,
                        questionLevel,
                        setQuestionLevel,
                        questionRightAnswer,
                        setQuestionRightAnswer,
                        questionWrongAnswers,
                        setQuestionWrongAnswers,
                    }}/>
                </Modal>}
                <div className="flex flex-col w-full m-6 rounded-3xl mx-auto -mt-5">
                    <button className="ml-auto my-3 mx-0 bg-purple-800 shadow-sm font-extrabold py-2 px-5 rounded-3xl text-slate-200 hover:ring-2" onClick={() => {
                        newQuestion();
                    }}>
                        Vytvořit otázku
                    </button>
                    <div className="flex justify-start px-8 py-2 bg-purple-200 rounded-3xl text-purple-800 mb-6 text-left font-semibold">
                        {/* <p className="w-10 mr-4">ID</p> */}
                        <p className="w-80 mr-4">Otázka</p>
                        <p className="w-80 mr-4">Správná odpověď</p>
                        <p className="w-10 mr-4">Úroveň</p>
                    </div>
                    <QuestionsListing questions={questions} getQuestionDataCallback={(id) => getQuestionData(id)}/>
                    <button className="mt-4 mx-auto text-slate-500 hover:ring-2 ring-purple-600 rounded-3xl font-semibold py-2 px-5" onClick={() => newQuestion()}>
                        Vytvořit novou otázku
                    </button>
                </div>
            </main>
        </>
    );
};

type QuestionsListingProps = {
    questions: Question[] | undefined,
    getQuestionDataCallback: (id: number) => void,
};

const QuestionsListing: React.FC<QuestionsListingProps> = (props) => {
    const {
        questions,
        getQuestionDataCallback
    } = props;

    if (!questions) return (
        <>
        </>
    );

    return (
        <>
            {questions.map(question => (
                <Link href={`/admin/grammar/?id=${question.id}`} key={question.id} onClick={() => getQuestionDataCallback(question.id)}>
                    <div className="flex justify-start px-8 py-2 mb-2 text-left text-slate-700 hover:ring-2 ring-purple-600 rounded-3xl hover:cursor-pointer font-semibold">
                        {/* <p className="w-10 mr-4">{question.id}</p> */}
                        <p className="w-80 mr-4 truncate">{question.questionText}</p>
                        <p className="w-80 mr-4 truncate">{question.rightAnswer}</p>
                        <p className="w-10 mr-4">{numToLevel(question.languageLevel)}</p>
                    </div>
                </Link>
            ))}
        </>
    );
}

AdminQuestion.Layout = AdminLayout;

export default AdminQuestion;
