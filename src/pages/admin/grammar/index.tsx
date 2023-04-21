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
import { Dispatch, SetStateAction, useState } from "react";

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

        setQuestionId(id);
        setQuestionText(question.questionText);
        setQuestionLevel(question.languageLevel);
        setQuestionRightAnswer(question.rightAnswer);
        setQuestionWrongAnswers(question.wrongAnswers);
    }

    const saveMutation = trpc.admin.saveQuestion.useMutation();
    const saveQuestion = () => {
        saveMutation.mutate({
            questionId: questionId,
            questionText: questionText,
            languageLevel: questionLevel,
            pointAmount: 1,
            rightAnswer: questionRightAnswer,
            wrongAnswers: questionWrongAnswers,
        });
        utils.admin.getAllQuestions.invalidate();
    }

    if (!questions ) return (
        <>
            call to action
        </>
    )

    return (
        <>
            <main className="flex-col w-full">
                {params.has("id") && <Modal onClose={() => {
                    saveQuestion();
                    router.push('/admin/grammar');
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
                <div className="flex flex-col w-full m-6 rounded-3xl mx-auto">
                    <div className="flex justify-start px-8 py-2 bg-purple-200 rounded-3xl text-purple-800 mb-6 text-left font-semibold">
                        <p className="w-10 mr-4">ID</p>
                        <p className="w-80 mr-4">Otázka</p>
                        <p className="w-80 mr-4">Správná odpověď</p>
                        <p className="w-10 mr-4">Úroveň</p>
                    </div>
                    <QuestionsListing questions={questions} getQuestionDataCallback={(id) => getQuestionData(id)}/>
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
                        <p className="w-10 mr-4">{question.id}</p>
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
