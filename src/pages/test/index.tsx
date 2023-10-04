import { RadioGroup } from "@headlessui/react";
import { intersperse } from "../../utils/functions";
import React, { Fragment, useState } from "react";
import { trpc } from "../../utils/trpc";
import { useRouter } from "next/router";
import { TestStatus } from "@prisma/client";


export const TestView: React.FC = () => {
    const submitAnswerMutation = trpc.user.submitAnswer.useMutation();
    const submitTestMutation = trpc.user.submitTest.useMutation();
    const getTestDataQuery = trpc.user.getTestData.useQuery();
    const router = useRouter();

    const [questions, setQuestions] = useState<{
        id: number,
        questionText: string,
        answers: string[],
        selected: string | undefined,
    }[] | undefined>(undefined);

    const [testSession, setTestSession] = useState<{
        id: number,
        startTime: Date,
        status: TestStatus,
        testId: number,
        userId: string,
        grammarQuestionsIds: number[],
        correctAnswers: number[],
        wrongAnswers: number[],
    } | undefined>(undefined);

    if (!questions || !testSession) {
        const testData = getTestDataQuery.data;
        if (!testData)
            return (
                <>
                    somethings happening...
                </>
            );

        // TODO: the filter here is kinda ugly
        const questions = testData.questions.map(q => ({
            id: q.id,
            questionText: q.questionText,
            answers: q.answers,
            selected: testData.submittedAnswers.filter(x => x.questionId == q.id)[0]?.answer,
        }));

        setQuestions(questions);
        setTestSession(testData.testSession);

        console.log({questions});
        console.log({testSession});

        return (
            <>
                somethings happening...
            </>
        );
    }

    const submitAnswer = async (id :number, answer: string, sessionId: number) => {
        await submitAnswerMutation.mutateAsync({
            questionId: id,
            answer: answer,
            testSessionId: sessionId,
        });
    };

    const submitTest = async () => {
        await submitTestMutation.mutateAsync();
        router.push('/');
    };

    return (
        <main className="purple-gradient bg-fixed h-auto min-h-screen bg-no-repeat overflow-auto">
            <div className="flex flex-col mx-auto h-auto p-7 max-w-5xl mb-5">
                {questions.map(q => (
                    <div className="w-full bg-slate-50 p-4 mb-5 rounded-lg shadow-md" key={q.id}>
                        <QuestionText questionText={q.questionText} id={q.id}/>
                        <Answers questionId={q.id} selectedAns={q.selected} answers={q.answers} testSessionId={testSession?.id} submitAnswer={submitAnswer} />
                    </div>
                ))}
            </div>
            <div className="flex flex-col mt-5 mb-20 mx-auto max-w-5xl">
                <button className="major-button mx-auto" onClick={async () => await submitTest()}>
                    ODEVZDAT TEST
                </button>
            </div>
        </main>
    );
}

type AnswersProps = {
    questionId: number,
    answers: string[],
    testSessionId: number,
    selectedAns: string | undefined,
    submitAnswer: (id :number, answer: string, sessionId: number) => Promise<void>,
}

const Answers: React.FC<AnswersProps> = (props) => {
    const {
        questionId,
        answers,
        testSessionId,
        selectedAns,
        submitAnswer,
    } = props;

    const [selected, setSelected] = useState<string | undefined>(selectedAns);

    return (
        <RadioGroup value={selected} onChange={setSelected}>
            {answers.map(a => (
                <RadioGroup.Option key={a} value={a} as={Fragment}>
                    {({ active, checked }) => (
                        <div className={`bg-slate-100 rounded-lg py-2 px-3 my-2 ${ checked && '!bg-purple-200 font-semibold'}`}
                            onClick={async () => await submitAnswer(questionId, a, testSessionId)}
                        >
                            {a}
                        </div>
                    )}
                </RadioGroup.Option>
            ))}
        </RadioGroup>
    )
}

type QuestionTextProps = {
    questionText: string,
    id: number,
}

const QuestionText: React.FC<QuestionTextProps> = (props) => {
    const {
        questionText,
        id,
    } = props;

    const ar = questionText.split("_");
    return(
        <div className="flex flex-row justify-between"> 
            <h3 className="font-bold text-lg mb-3 my-auto">
                {...intersperse(ar, (<span className="w-14 inline-block rounded-lg bg-purple-100 border-2 border-purple-200 mx-1 text-transparent">___</span>))}
            </h3>
            <p className="w-20 my-auto text-slate-300 hover:text-black hover:font-semibold mx-2">id: {id}</p>
        </div>
    )
}

export default TestView;