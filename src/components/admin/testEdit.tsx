import { Test } from "@prisma/client"
import { Dispatch, SetStateAction, useRef } from "react";
import { AppRouter } from "../../server/trpc/router/_app";
import { toRoman } from "../../utils/functions";
import { AppRouterTypes, trpc } from "../../utils/trpc";

type TestEditStateBinding = {
    testId: number,
    setTestId: Dispatch<SetStateAction<number>>,
    testTime: number,
    setTestTime: Dispatch<SetStateAction<number>>,
    grammarA1Amount: number,
    setGrammarA1Amount: Dispatch<SetStateAction<number>>,
    grammarA2Amount: number,
    setGrammarA2Amount: Dispatch<SetStateAction<number>>,
    grammarB1Amount: number,
    setGrammarB1Amount: Dispatch<SetStateAction<number>>,
    grammarB2Amount: number,
    setGrammarB2Amount: Dispatch<SetStateAction<number>>,
    grammarC1Amount: number,
    setGrammarC1Amount: Dispatch<SetStateAction<number>>,
    grammarC2Amount: number,
    setGrammarC2Amount: Dispatch<SetStateAction<number>>,
    availableQuestions: number[],
    goBack: () => void,
}

export type TestEditProps = {
    binding: TestEditStateBinding,
};


export const TestEdit: React.FC<TestEditProps> = props => {
    const {
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
    } = props.binding;

    const questionSum = () => grammarA1Amount + grammarA2Amount + grammarB1Amount + grammarB2Amount + grammarC1Amount + grammarC2Amount;
    const otazka = (n: number) => {
        if (n == 1) return "gramatickou otázku"
        else if (n > 1 && n < 5) return "gramatické otázky"
        else return "gramatických otázek";
    }
    const minuta = (n: number) => {
        if (n < 5) return "minuty"
        else return "minut";
    }

    const avgTime = () => {
        if (questionSum() == 0) return 0;
        return testTime / questionSum();
    }

    // TODO: no UI here :(
    return (
        <div className="flex flex-col border-b-2 mb-10 w-full h-full bg-purple-100 rounded-3xl p-10 px-14">
            <p className="font-bold mb-4">Počty otázek podle obtížnosti</p>
            <div className="flex flex-row pb-6">
                <div className="mr-7">
                    <div className="flex flex-row">
                        <p className="font-semibold pr-3 my-auto">A1</p>
                        <input className="w-16 p-2 h-9 rounded-lg" type="number" step={1} min={0} max={availableQuestions[0]} value={grammarA1Amount} onChange={e => setGrammarA1Amount(parseInt(e.target.value))} placeholder="0"/>
                    </div>
                    <p className={`ml-8 ${grammarA1Amount > availableQuestions[0]! && "text-red-600"}`}>max: {availableQuestions[0]}</p>
                </div>
                <div className="mr-7">
                    <div className="flex flex-row">
                        <p className="font-semibold pr-3 my-auto">A2</p>
                        <input className="w-16 p-2 h-9 rounded-lg" type="number" step={1} min={0} max={availableQuestions[1]} value={grammarA2Amount} onChange={e => setGrammarA2Amount(parseInt(e.target.value))} placeholder="0"/>
                    </div>
                    <p className={`ml-8 ${grammarA2Amount > availableQuestions[1]! && "text-red-600"}`}>max: {availableQuestions[1]}</p>
                </div>
                <div className="mr-7">
                    <div className="flex flex-row">
                        <p className="font-semibold pr-3 my-auto">B1</p>
                        <input className="w-16 p-2 h-9 rounded-lg" type="number" step={1} min={0} max={availableQuestions[2]} value={grammarB1Amount} onChange={e => setGrammarB1Amount(parseInt(e.target.value))} placeholder="0"/>
                    </div>
                    <p className={`ml-8 ${grammarB1Amount > availableQuestions[2]! && "text-red-600"}`}>max: {availableQuestions[2]}</p>
                </div>
                <div className="mr-7">
                    <div className="flex flex-row">
                        <p className="font-semibold pr-3 my-auto">B2</p>
                        <input className="w-16 p-2 h-9 rounded-lg" type="number" step={1} min={0} max={availableQuestions[3]} value={grammarB2Amount} onChange={e => setGrammarB2Amount(parseInt(e.target.value))} placeholder="0"/>
                    </div>
                    <p className={`ml-8 ${grammarB2Amount > availableQuestions[3]! && "text-red-600"}`}>max: {availableQuestions[3]}</p>
                </div>
                <div className="mr-7">
                    <div className="flex flex-row">
                        <p className="font-semibold pr-3 my-auto">C1</p>
                        <input className="w-16 p-2 h-9 rounded-lg" type="number" step={1} min={0} max={availableQuestions[4]} value={grammarC1Amount} onChange={e => setGrammarC1Amount(parseInt(e.target.value))} placeholder="0"/>
                    </div>
                    <p className={`ml-8 ${grammarC1Amount > availableQuestions[4]! && "text-red-600"}`}>max: {availableQuestions[4]}</p>
                </div>
                <div className="mr-7">
                    <div className="flex flex-row">
                        <p className="font-semibold pr-3 my-auto">C2</p>
                        <input className="w-16 p-2 h-9 rounded-lg" type="number" step={1} min={0} max={availableQuestions[5]} value={grammarC2Amount} onChange={e => setGrammarC2Amount(parseInt(e.target.value))} placeholder="0"/>
                    </div>
                    <p className={`ml-8 ${grammarC2Amount > availableQuestions[5]! && "text-red-600"}`}>max: {availableQuestions[5]}</p>
                </div>
            </div>

            <p className="font-bold mb-4">Čas na test</p>
            <div className="flex flex-row pb-6">
                <input className="w-16 p-2 h-9 rounded-lg" type="number" step={1} min={0} value={testTime} onChange={e => setTestTime(parseInt(e.target.value))} placeholder="30"/>
                <p className="ml-3 my-auto">minut</p>
            </div>

            <div className="bg-purple-50 rounded-3xl mt-6 p-5">
                <p>Test obsahuje <b>{questionSum()}</b> {otazka(questionSum())} s průměrným časem <b>{avgTime().toFixed(1)}</b> {minuta(avgTime())} na odpověď.</p>
            </div>

            <button className="rounded-xl bg-green-400 p-4 mt-7"
                    onClick={goBack}>
                <p className="font-bold text-lg">Uložit</p>
            </button>
        </div>
    );
}