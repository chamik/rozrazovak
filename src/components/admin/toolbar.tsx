export type ToolbarProps = {
    addCallback: Function,
    saveCallback: Function,
};


export const Toolbar: React.FC<ToolbarProps> = props => {
    const {
        addCallback,
        saveCallback,
    } = props;

    return (
        <div className="w-full pb-10 fixed bottom-0">
            <div className="flex flex-col mt-7">
                <button className="bg-white w-[90px] h-[90px] rounded-full group hover:ring-4">
                    <img src='/svg/save.svg' alt='aye' className="text-blue-200 w-16 mx-auto opacity-50" onClick={() => saveCallback()}/>
                </button>
            </div>
            <div className="flex flex-col mt-7">
                <button className="bg-white w-[90px] h-[90px] rounded-full group hover:ring-4">
                    <img src='/svg/plus.svg' alt='aye' className="text-blue-200 w-16 mx-auto opacity-50" onClick={() => addCallback()}/>
                </button>
            </div>
        </div>
    );
}