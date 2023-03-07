import { Question } from "@prisma/client";
import { useRef } from "react";
import { trpc } from "../../utils/trpc";

export type QuestionEditProps = {
    question: Question
};

export const QuestionEdit: React.FC<QuestionEditProps> = (props) => {
    const {
        question,
    } = props;

    const utils = trpc.useContext();

    const saveMutation = trpc.admin.saveQuestion.useMutation();
    const deleteMutation = trpc.admin.deleteQuestion.useMutation({
        onSuccess() {
            utils.admin.getAllQuestions.invalidate();
        }
    });

    const questionTextRef = useRef<HTMLInputElement | null>(null);
    const languageLevelRef = useRef<HTMLSelectElement | null>(null);
    const pointAmountRef = useRef<HTMLInputElement | null>(null);
    const rightAnswerRef = useRef<HTMLInputElement | null>(null);
    // const wrongAnswersRefs = useRef<Array<HTMLInputElement | null>>([]);
    const wrongAnswersRefs = useRef<(HTMLInputElement | null)[]>([]);


    // const updateQuestion = async () => {
    //     const questionText = questionTextRef.current!.value;

    //     alert(questionText);
    // };

    const saveQuestion = () => {
        saveMutation.mutate({
            questionId: question.id,
            questionText: questionTextRef.current!.value,
            languageLevel: parseInt(languageLevelRef.current!.value),
            pointAmount: parseInt(pointAmountRef.current!.value),
            rightAnswer: rightAnswerRef.current!.value,
            wrongAnswers: wrongAnswersRefs.current.map(ref => ref?.value!),
        })
    }

    const deleteQuestion = () => {
        deleteMutation.mutate({
            id: question.id,
        })
    }

    return (
        <div className="flex flex-col w-full mx-auto rounded-md py-8 pl-8 pr-16 bg-slate-300 shadow-md mb-8" >
            <div className="flex flex-row mb-6">
                {/* <label className="rounded-xl text-2xl font-bold my-auto">{question.id}</label> */}
                <input type="text" ref={questionTextRef} defaultValue={question.questionText} className="question-input w-full font-bold"/>
            </div>
            <div className="flex flex-row">
                <div className="h-full mr-12 w-60 flex flex-col justify-between">
                
                    <label className="rounded-xl text-lg font-bold my-auto">Úroveň otázky:</label>
                    <select name="languageLevel" ref={languageLevelRef} className="p-3 rounded-xl w-full mt-2 mb-5 question-input">
                        <option value="0" selected={question.languageLevel == 0}>A2</option>
                        <option value="1" selected={question.languageLevel == 1}>B1</option>
                        <option value="2" selected={question.languageLevel == 2}>B2</option>
                        <option value="3" selected={question.languageLevel == 3}>C1</option>
                    </select>
                    <label className="rounded-xl text-lg font-bold my-auto">Počet bodů</label>
                    <input type="number" ref={pointAmountRef} name="pointAmount" className="p-3 rounded-xl w-full mt-2 question-input" defaultValue={question.pointAmount}/>
            
                    <p className="pt-auto">Id: {question.id}</p>
                    <button className="p-3 rounded-xl w-full mt-10 question-input hover:bg-green-500" onClick={() => saveQuestion()}>uložit</button>
                    <button className="p-3 rounded-xl w-full mt-2 question-input hover:bg-red-600" onClick={() => deleteQuestion()}>smazat</button>
                </div>
                <div className="w-full">
                    <div className="mb-5">
                        <label className="rounded-xl text-lg font-bold my-auto mb-2">Správná odpověď:</label>
                        <input type="text" ref={rightAnswerRef} defaultValue={question.rightAnswer} className="question-input w-full mt-2"/>
                    </div>
                    <div>
                        <label className="rounded-xl text-lg font-bold my-auto">Špatné odpovědi:</label>
                        <div className="flex flex-col">
                            {question.wrongAnswers.map((answer, i) => (
                                <input type="text" ref={el => wrongAnswersRefs.current[i] = el} defaultValue={answer} className="question-input w-full mt-2"/>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

