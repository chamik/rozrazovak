import { GetServerSideProps, type NextPage } from "next";
import Link from "next/link";
import { NextPageWithLayout } from "../../_app";
import { AdminLayout } from "../../../components/admin/adminLayout";
import { trpc } from "../../../utils/trpc";
import { getServerAuthSession } from "../../../server/common/get-server-auth-session";
import { Question } from "@prisma/client";
import { QuestionEdit } from "../../../components/admin/grammarEdit";
import { Modal } from "../../../components/admin/modal";
import { useRouter, useSearchParams } from "next/navigation";
import { numToLevel } from "../../../utils/functions";

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
    const questions = questionsData.data?.questions.sort((a, b) => a.id - b.id);
    const utils = trpc.useContext();

    const router = useRouter();
    const params = useSearchParams();

    const newMutation = trpc.admin.newQuestion.useMutation({
        onSuccess() {
            utils.admin.getAllQuestions.invalidate()
        },
    });

    const newQuestion = () => {
        newMutation.mutate({
            questionText: "Text otázky",
            languageLevel: 0,
            pointAmount: 1,
            rightAnswer: "Správná odpověď",
            wrongAnswers: ["Špatná odpověď 1", "Špatná odpověď 2", "Špatná odpověď 3"],
        });
    }

    // TODO: disable view when test is ongoing

    return (
        <>
            <main className="flex-col w-full">
                {params.has("id") && <Modal onClose={() => {router.push('/admin/grammar')}}>
                    <QuestionEdit questionId={Number(params.get("id"))} />
                </Modal>}
                <div className="flex flex-col w-full m-6 rounded-3xl mx-auto">
                    <div className="flex justify-start px-8 py-2 bg-purple-200 rounded-3xl text-purple-800 mb-6 text-left font-semibold">
                        <p className="w-10 mr-4">ID</p>
                        <p className="w-80 mr-4">Otázka</p>
                        <p className="w-80 mr-4">Správná odpověď</p>
                        <p className="w-10 mr-4">Úroveň</p>
                    </div>
                    <QuestionsListing questions={questions}/>
                </div>
            </main>
        </>
    );
};

type QuestionsListingProps = {
    questions: Question[] | undefined
};

const QuestionsListing: React.FC<QuestionsListingProps> = (props) => {
    const {
        questions,
    } = props;

    if (!questions) return (
        <>
        </>
    );

    return (
        <>
            {questions.map(question => (
                <Link href={`/admin/grammar/?id=${question.id}`} as={`/admin/grammar/${question.id}`} key={question.id}>
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
