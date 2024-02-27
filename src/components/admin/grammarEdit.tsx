import { RadioGroup } from "@headlessui/react";
import { Dispatch, SetStateAction } from "react";
import { languageLevels } from "../../utils/functions";
import Image from "next/image";

type GrammarEditStateBinding = {
    questionId: number,
    setQuestionId: Dispatch<SetStateAction<number>>,
    questionText: string,
    setQuestionText: Dispatch<SetStateAction<string>>,
    questionLevel: number,
    setQuestionLevel: Dispatch<SetStateAction<number>>,
    questionRightAnswer: string,
    setQuestionRightAnswer: Dispatch<SetStateAction<string>>,
    questionWrongAnswers: string[],
    setQuestionWrongAnswers: Dispatch<SetStateAction<string[]>>,
    deleteQuestion: () => void,
    goBack: () => void,
}

type GrammarEditProps = {
    binding: GrammarEditStateBinding,
}

export const GrammarEdit: React.FC<GrammarEditProps> = (props) => {
    const {
        questionId,
        questionText,
        setQuestionText,
        questionLevel,
        setQuestionLevel,
        questionRightAnswer,
        setQuestionRightAnswer,
        questionWrongAnswers,
        setQuestionWrongAnswers,
        deleteQuestion,
        goBack
    } = props.binding;

    const setWrongAnswer = (i: number, x: string) => {
        const e = [...questionWrongAnswers];
        e[i] = x;
        setQuestionWrongAnswers(e);
    }

    const isEmpty = (t: string) => t.length == 0;
    const isAnswerEmpty = (i: number) => questionWrongAnswers[i]?.length == 0;

    // budiž toto důkazem že bůh je mrtev
    return (
        <div className="flex flex-col w-full">
        <div className="flex flex-col border-b-2 mb-10 w-full h-full bg-purple-100 rounded-3xl p-10 px-14">
            <div className="flex flex-row mb-6">
                <p className="mx-auto text-xl font-bold">Gramatická otázka ID {questionId}</p>
                <img src='/svg/trash-solid.svg' alt='aye' className="rounded-full w-5 opacity-50 hover:ring-4 ring-red-600" onClick={deleteQuestion}/>
            </div>
            <div className="flex flex-col mb-6">
                <p className="ml-3 mb-1">Otázka</p>
                <input className={`rounded-3xl text-xl px-3 py-2 ${isEmpty(questionText) && "ring-2 ring-red-600"}`} type="text" placeholder="Text otázky" value={questionText} onChange={e => setQuestionText(e.target.value)}/>
                {isEmpty(questionText) &&
                <p className="ml-3 mt-1 text-red-600">Otázka nesmí být prázdná</p>
                }
            </div>
            <div className="flex flex-col mb-8">
                <p className="ml-3 mb-1">Správná odpověď</p>
                <input className={`rounded-3xl text-xl px-3 py-2 ${isEmpty(questionRightAnswer) && "ring-2 ring-red-600"}`} type="text" placeholder="Text správné odpovědi" value={questionRightAnswer} onChange={e => setQuestionRightAnswer(e.target.value)}/>
                {isEmpty(questionRightAnswer) &&
                <p className="ml-3 mt-1 text-red-600">Správná odpověď nesmí být prázdná</p>
                }
            </div>
            <div className="flex flex-col mb-8">
                <p className="ml-3 mb-1">Špatné odpovědi</p>
                <div className="mb-4 w-full">
                    <input className={`rounded-3xl text-xl px-3 py-2 w-full ${isAnswerEmpty(0) && "ring-2 ring-red-600"}`} type="text" placeholder="Text špatné odpovědi 1" value={questionWrongAnswers[0]} onChange={e => setWrongAnswer(0, e.target.value)}/>
                    {isAnswerEmpty(0) &&
                    <p className="ml-3 mt-1 text-red-600">Špatná odpověď nesmí být prázdná</p>
                    }
                    {(questionWrongAnswers[0] == questionRightAnswer && !isAnswerEmpty(0)) &&
                    <p className="ml-3 mt-1 text-red-600">Špatná odpověď nesmí být stejná jako správná odpověď</p>
                    }
                </div>
                <div className="mb-4 w-full">
                    <input className={`rounded-3xl text-xl px-3 py-2 w-full ${isAnswerEmpty(0) && "ring-2 ring-red-600"}`} type="text" placeholder="Text špatné odpovědi 2" value={questionWrongAnswers[1]} onChange={e => setWrongAnswer(1, e.target.value)}/>
                    {isAnswerEmpty(1) &&
                    <p className="ml-3 mt-1 text-red-600">Špatná odpověď nesmí být prázdná</p>
                    }
                    {(questionWrongAnswers[1] == questionRightAnswer && !isAnswerEmpty(1)) &&
                    <p className="ml-3 mt-1 text-red-600">Špatná odpověď nesmí být stejná jako správná odpověď</p>
                    }
                </div>
                <div className="mb-4 w-full">
                    <input className={`rounded-3xl text-xl px-3 py-2 w-full ${isAnswerEmpty(0) && "ring-2 ring-red-600"}`} type="text" placeholder="Text špatné odpovědi 3" value={questionWrongAnswers[2]} onChange={e => setWrongAnswer(2, e.target.value)}/>
                    {isAnswerEmpty(2) &&
                    <p className="ml-3 mt-1 text-red-600">Špatná odpověď nesmí být prázdná</p>
                    }
                    {(questionWrongAnswers[2] == questionRightAnswer && !isAnswerEmpty(2)) &&
                    <p className="ml-3 mt-1 text-red-600">Špatná odpověď nesmí být stejná jako správná odpověď</p>
                    }
                </div>
            </div>
            <div>
                <p className="mb-2">Jazyková úroveň</p>
                <RadioGroup value={questionLevel} onChange={setQuestionLevel}>
                    <div className="flex flex-row gap-2">
                    {languageLevels.map((level) => (
                        <RadioGroup.Option
                           key={level.id} 
                           value={level.id}
                           className={({ active, checked }) =>
                            `${
                                active
                                ? 'ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-sky-300'
                                : ''
                            }
                            ${
                                checked ? 'bg-purple-900 bg-opacity-75 text-white' : 'bg-white'
                            }
                                relative flex cursor-pointer rounded-lg px-4 py-4 shadow-md focus:outline-none w-full font-semibold`
                            }
                        >
                            {level.name}
                        </RadioGroup.Option>
                    ))}
                    </div>
                    
                </RadioGroup>
            </div>
            <button className="rounded-xl bg-green-400 p-4 mt-7"
                    onClick={goBack}>
                <p className="font-bold text-lg">Uložit</p>
            </button>
        </div>
        </div>
    );
}

