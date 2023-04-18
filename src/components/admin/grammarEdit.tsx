import { Question } from "@prisma/client";
import { Dispatch, SetStateAction, useRef } from "react";
import { trpc } from "../../utils/trpc";

type GrammarEditProps = {
    text: string,
    setText: Dispatch<SetStateAction<string>>,
}

export const GrammarEdit: React.FC<GrammarEditProps> = (props) => {
    return (
        <div className="flex flex-col">
            <div>
            </div>
            <input type="text" value={props.text} onChange={e => props.setText(e.target.value)}/>
        </div>
    );
}

