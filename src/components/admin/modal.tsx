import { ReactNode, useRef } from "react";
import { Dialog } from "@headlessui/react";

export type ModalProps = {
    children: ReactNode
    onClose: Function
}

export const Modal: React.FC<ModalProps> = (props) => {
    const {
        children,
        onClose
    } = props;

    let overlayRef = useRef();

    return (
        <Dialog
          static
          open={true}
          onClose={onClose}
          initialFocus={overlayRef}
          className="fixed inset-0 z-10 flex items-center justify-center"
        >
          <Dialog.Overlay
            ref={overlayRef}
            className="fixed inset-0 bg-gray-800/60"
          />
          <div className="relative flex items-center justify-center w-1/2">
            {children}
          </div>
        </Dialog>
      );
}