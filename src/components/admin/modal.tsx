import { ReactNode, useRef } from "react";
import { Dialog } from "@headlessui/react";

export type ModalProps = {
    children: ReactNode,
    onClose: (value: boolean) => void,
}

export const Modal: React.FC<ModalProps> = (props) => {
    const {
        children,
        onClose
    } = props;

    let overlayRef = useRef<HTMLElement>();

    return (
        <Dialog
          static
          open={true}
          onClose={(value) => {
            console.log({overlayRef});
            onClose(value);
          }}
          //@ts-ignore
          initialFocus={overlayRef}
          className="fixed inset-0 z-10 flex items-center justify-center"
        >
          <Dialog.Overlay
          //@ts-ignore
            ref={overlayRef}
            className="fixed inset-0 bg-gray-800/60"
          />
          <div className="relative flex items-center justify-center w-1/2">
            {children}
          </div>
        </Dialog>
      );
}