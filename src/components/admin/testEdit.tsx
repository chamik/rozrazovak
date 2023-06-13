import { Test } from "@prisma/client"
import { useRef } from "react";
import { AppRouter } from "../../server/trpc/router/_app";
import { toRoman } from "../../utils/functions";
import { AppRouterTypes, trpc } from "../../utils/trpc";

export type TestEditProps = {
    test: Test
};


export const TestEdit: React.FC<TestEditProps> = props => {
    const {
        test,
    } = props;

    return (
        <div className="flex flex-col w-full">
        <div>
            <img src='/svg/arrow-left-solid.svg' alt='aye' className="w-10"/>
        </div>
        <div className="flex flex-col border-b-2 mb-10 w-full h-full bg-purple-100 rounded-3xl p-10 px-14">
            <div className="flex flex-row mb-6">
                <p className="mx-auto text-xl font-bold">Test pro ročník {toRoman(3)}</p>
                <img src='/svg/trash-solid.svg' alt='aye' className="rounded-full w-5 opacity-50 hover:ring-4 ring-red-600"/>
            </div>
        </div>
        </div>
    );
}