import { ConfirmDialog, confirmable, createConfirmation } from "react-confirm";
import { Modal } from "./modal";

type WarningModalResult = {
    status: boolean;
};

type WarningModalProps = {
    warningText: string,
    confirmText: string,
}

const WarningModalInner: ConfirmDialog<WarningModalProps, WarningModalResult> = (props) => {
    const { show, proceed, warningText, confirmText } = props;

    if (!show)
        return null;

    return (
    <Modal onClose={() => proceed({status: false})}>
        <div className="flex flex-col border-b-2 mb-10 w-full h-full bg-purple-100 rounded-3xl p-10 px-14">
            <p className="font-bold text-lg text-center mb-2">{warningText}</p>

            <button className="text-xl w-auto text-slate-700 major-button mt-3" onClick={() => proceed({status: false})}>{confirmText}</button>
        </div>
    </Modal>
    );
};

export const WarningModal = confirmable(WarningModalInner);
export const warning = createConfirmation(WarningModal);