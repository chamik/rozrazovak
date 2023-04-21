import { Question } from "@prisma/client";
import { Dispatch, SetStateAction, useRef } from "react";
import { trpc } from "../../utils/trpc";

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
}

type GrammarEditProps = {
    binding: GrammarEditStateBinding,
}

export const GrammarEdit: React.FC<GrammarEditProps> = (props) => {
    const {
        questionId,
        setQuestionId,
        questionText,
        setQuestionText,
        questionLevel,
        setQuestionLevel,
        questionRightAnswer,
        setQuestionRightAnswer,
        questionWrongAnswers,
        setQuestionWrongAnswers,
    } = props.binding;

    return (
        <div className="flex flex-col">
            <div>
            </div>
            <input type="text" value={questionText} onChange={e => setQuestionText(e.target.value)}/>
        </div>
    );
}

