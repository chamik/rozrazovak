import { useRef } from "react";
import { trpc } from "../../utils/trpc";

export type QuestionEditProps = {
    questionId: number
};

export const QuestionEdit: React.FC<QuestionEditProps> = (props) => {
    const {
        questionId,
    } = props;

    const utils = trpc.useContext();

    const questionQuery = trpc.admin.getQuestionById.useQuery({questionId: questionId});
    const saveMutation = trpc.admin.saveQuestion.useMutation();
    const deleteMutation = trpc.admin.deleteQuestion.useMutation({
        onSuccess() {
            utils.admin.getAllQuestions.invalidate();
        }
    });
    
    const question = questionQuery.data;

    const questionTextRef = useRef<HTMLInputElement | null>(null);
    const languageLevelRef = useRef<HTMLSelectElement | null>(null);
    const pointAmountRef = useRef<HTMLInputElement | null>(null);
    const rightAnswerRef = useRef<HTMLInputElement | null>(null);
    // const wrongAnswersRefs = useRef<Array<HTMLInputElement | null>>([]);
    const wrongAnswersRefs = useRef<(HTMLInputElement | null)[]>([]);

    if (!question)
    return(
        <>
            something went wrong :(
        </>
    );

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
        <div>
            ID: {question.id}
        </div>
    );
}

