import { RadioGroup } from "@headlessui/react";
import { intersperse } from "../../utils/functions";
import React, { Fragment, useState } from "react";
import { trpc } from "../../utils/trpc";


export const TestView: React.FC = () => {
    const submitAnswerMutation = trpc.user.submitAnswer.useMutation();
    const getQuestionQuery = trpc.user.getQuestions.useQuery();

    const questions = getQuestionQuery.data;

    if (!questions) return (
        <>
            something's happening...
        </>
    )

    const submitAnswer = async (id :number, answer: string) => {
        await submitAnswerMutation.mutateAsync({
            questionId: id,
            answer: answer,
        });
    };

    // TODO: fix the gradient
    return (
        <main className="purple-gradient bg-fixed h-full bg-no-repeat">
            <div className="flex flex-col mx-auto h-screen p-7 max-w-5xl">
                {questions.map(q => (
                    <div className="w-full bg-slate-50 p-4 mb-5 rounded-lg shadow-md" key={q.id}>
                        <QuestionText questionText={q.questionText} id={q.id}/>
                        <Answers questionId={q.id} answers={q.answers} submitAnswer={submitAnswer} />
                    </div>
                ))}
            </div>
        </main>
    );
}

type AnswersProps = {
    questionId: number,
    answers: string[],
    submitAnswer: (id :number, answer: string) => Promise<void>,
}

const Answers: React.FC<AnswersProps> = (props) => {
    const {
        questionId,
        answers,
        submitAnswer,
    } = props;

    const [selected, setSelected] = useState<string | null>(null);

    return (
        <RadioGroup value={selected} onChange={setSelected}>
            {answers.map(a => (
                <RadioGroup.Option key={a} value={a} as={Fragment}>
                    {({ active, checked }) => (
                        <div className={`bg-slate-100 rounded-lg py-2 px-3 my-2 ${ checked && '!bg-purple-200 font-semibold'}`}
                            onClick={async () => await submitAnswer(questionId, a)}
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