import { Test } from "@prisma/client"
import { useRef } from "react";
import { AppRouter } from "../../server/trpc/router/_app";
import { AppRouterTypes, trpc } from "../../utils/trpc";

export type TestEditProps = {
    test: Test
};


export const TestEdit: React.FC<TestEditProps> = props => {
    const {
        test,
    } = props;

    const utils = trpc.useContext();

    const saveMutation = trpc.admin.saveTest.useMutation();
    const deleteMutation = trpc.admin.deleteTest.useMutation({
        onSuccess() {
            utils.admin.getAllTests.invalidate();
        }
    });
    const startTestMutation = trpc.admin.startTest.useMutation({
        onSuccess() {
            utils.admin.getAllTests.invalidate();
        }
    });

    const testTimeRef = useRef<HTMLInputElement | null>(null);
    const testGrammarA2AmountRef = useRef<HTMLInputElement | null>(null);
    const testGrammarB1AmountRef = useRef<HTMLInputElement | null>(null);
    const testGrammarB2AmountRef = useRef<HTMLInputElement | null>(null);
    const testGrammarC1AmountRef = useRef<HTMLInputElement | null>(null);

    const saveTest = () => {
        saveMutation.mutate({
            id: test.id,
            timeLimit: parseInt(testTimeRef.current!.value),
            grammarA2Amount: parseInt(testGrammarA2AmountRef.current!.value),
            grammarB1Amount: parseInt(testGrammarB1AmountRef.current!.value),
            grammarB2Amount: parseInt(testGrammarB2AmountRef.current!.value),
            grammarC1Amount: parseInt(testGrammarC1AmountRef.current!.value),
        });
    }

    const deleteTest = () => {
        deleteMutation.mutate({testId: test.id});
    }

    const startTest = () => {
        startTestMutation.mutate({testId: test.id});
    }

    return (
        <div className="flex flex-col w-full mx-auto rounded-md py-8 pl-8 pr-16 bg-slate-300 shadow-md mb-8">
            <div className="flex flex-row justify-between">
                <h3 className="text-xl font-bold">Test pro třídu {toRoman(test.class)}.</h3>
                <button type="button" disabled={test.started} onClick={() => startTest()}>
                    spustit
                </button>
            </div>
            <div className="flex flex-col">
                <label className="rounded-xl text-lg font-bold my-auto">Čas pro testovaného</label>
                <div>    
                    <input type="number" disabled={test.started} ref={testTimeRef} name="pointAmount" className="p-3 rounded-xl mt-2 question-input" defaultValue={test.timeLimit}/>
                </div>
                <label className="rounded-xl text-lg font-bold my-auto mt-10">Počet otázek různých obtížností</label>
                <div className="flex flex-row">
                    <label className="rounded-xl text-lg font-bold my-auto mr-4">A2</label>
                    <input type="number" disabled={test.started} ref={testGrammarA2AmountRef} name="pointAmount" className="p-3 w-32 rounded-xl mt-2 mr-5 question-input" defaultValue={test.grammarA2Amount}/>

                    <label className="rounded-xl text-lg font-bold my-auto mr-4">B1</label>
                    <input type="number" disabled={test.started} ref={testGrammarB1AmountRef} name="pointAmount" className="p-3 w-32 rounded-xl mt-2 mr-5 question-input" defaultValue={test.grammarB1Amount}/>

                    <label className="rounded-xl text-lg font-bold my-auto mr-4">B2</label>
                    <input type="number" disabled={test.started} ref={testGrammarB2AmountRef} name="pointAmount" className="p-3 w-32 rounded-xl mt-2 mr-5 question-input" defaultValue={test.grammarB2Amount}/>

                    <label className="rounded-xl text-lg font-bold my-auto mr-4">C1</label>
                    <input type="number" disabled={test.started} ref={testGrammarC1AmountRef} name="pointAmount" className="p-3 w-32 rounded-xl mt-2 mr-5 question-input" defaultValue={test.grammarC1Amount}/>
                </div>
                <div>
                    <button disabled={test.started} className="p-3 rounded-xl w-full mt-10 question-input hover:bg-green-500" onClick={() => saveTest()}>uložit</button>
                    <button disabled={test.started} className="p-3 rounded-xl w-full mt-2 question-input hover:bg-red-600" onClick={() => deleteTest()}>smazat</button>
                </div>
            </div>
        </div>
    );
}

function toRoman(num: number | null): string {
    if (num == null) return "učitel";
    if (num >= 5) return "V" + toRoman(num - 5);
    if (num >= 4) return "IV" + toRoman(num - 4);
    if (num >= 1) return "I" + toRoman(num - 1);
    return "";
}