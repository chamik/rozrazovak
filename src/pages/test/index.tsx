import { RadioGroup } from "@headlessui/react";
import { intersperse } from "../../utils/functions";
import React, { Fragment, useState } from "react";


export const TestView: React.FC = () => {

    const questions = [
        {
            id: 1,
            questionText: "I should get _ now.",
            answers: ["away", "out", "going", "in"],
        },
        {
            id: 2,
            questionText: "How are you?",
            answers: ["Good.", "No.", "Enough.", "Important."],
        },
        {
            id: 666,
            questionText: "Testuju co se stane když to přeteče Testuju co se stane když to přetečeTestuju co se stane když to přetečeTestuju co se stane když to přetečeTestuju co se stane když to přeteče",
            answers: ["A co tohle A co tohleA co tohleA co tohleA co tohleA co tohleA co tohleA co tohleA co tohleA co tohleA co tohleA co tohleA co tohleA co tohleA co tohleA co tohleA co tohleA co tohleA co tohleA co tohleA co tohleA co tohleA co tohleA co tohleA co tohle", "No.", "Enough.", "Important."],
        },
        {
            id: 3,
            questionText: "How are you?",
            answers: ["Good.", "No.", "Enough.", "Important."],
        },
        {
            id: 4,
            questionText: "How are you?",
            answers: ["Good.", "No.", "Enough.", "Important."],
        },
        {
            id: 5,
            questionText: "How are you?",
            answers: ["Good.", "No.", "Enough.", "Important."],
        },
        {
            id: 6,
            questionText: "How are you?",
            answers: ["Good.", "No.", "Enough.", "Important."],
        },
    ]

    // TODO: fix the gradient
    return (
        <main className="purple-gradient bg-fixed h-full bg-no-repeat">
            <div className="flex flex-col mx-auto h-screen p-7 max-w-5xl">
                {questions.map(q => (
                    <div className="w-full bg-slate-50 p-4 mb-5 rounded-lg shadow-md" key={q.id}>
                        <QuestionText questionText={q.questionText} id={q.id}/>
                        <Answers answers={q.answers} />
                    </div>
                ))}
            </div>
        </main>
    );
}

type AnswersProps = {
    answers: string[],
}

const Answers: React.FC<AnswersProps> = (props) => {
    const {
        answers,
    } = props;

    const [selected, setSelected] = useState<string | null>(null);

    return (
        <RadioGroup value={selected} onChange={setSelected}>
            {answers.map(a => (
                <RadioGroup.Option key={a} value={a} as={Fragment}>
                    {({ active, checked }) => (
                        <div className={`bg-slate-100 rounded-lg py-2 px-3 my-2 ${ checked && '!bg-purple-200 font-semibold'}`}>
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