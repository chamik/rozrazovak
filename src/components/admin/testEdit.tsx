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
    } = props.binding;

    // TODO: no UI here :(
    return (
        <div className="flex flex-col w-full">
            {testId}
        </div>
    );
}