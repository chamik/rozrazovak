import { ConfirmDialog, confirmable, createConfirmation } from "react-confirm";
import { Modal } from "./modal";

type ConfirmModalResult = {
    status: boolean;
};

type ConfirmModalProps = {
    warningText: string,
    confirmText: string,
    cancelText: string,
}

const ConfirmModalInner: ConfirmDialog<ConfirmModalProps, ConfirmModalResult> = (props) => {
    const { show, proceed, warningText, confirmText, cancelText } = props;

    if (!show)
        return null;

    return (
    <Modal onClose={() => proceed({status: false})}>
        <div className="flex flex-col border-b-2 mb-10 w-full h-full bg-purple-100 rounded-3xl p-10 px-14">
            <p className="font-bold text-lg text-center mb-2">{warningText}</p>

            <button className="text-xl w-auto text-slate-700 major-button my-3" onClick={() => proceed({status: false})}>{cancelText}</button>
            <button className="w-auto text-lg text-red-700 major-button" onClick={() => proceed({status: true})}>{confirmText}</button>
        </div>
    </Modal>
    );
};

export const ConfirmModal = confirmable(ConfirmModalInner);
export const confirm = createConfirmation(ConfirmModal);