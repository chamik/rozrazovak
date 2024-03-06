import { AdminLayout } from "../../../components/admin/adminLayout";
import { trpc } from "../../../utils/trpc";
import { NextPageWithLayout } from "../../_app";
import { confirm } from "../../../components/admin/confirmModal";
import { useState } from "react";

const AdminBackup: NextPageWithLayout = () => {
    const downloadBackupMut = trpc.admin.downloadBackup.useMutation();
    const uploadBackupMut = trpc.admin.uploadBackup.useMutation();

    const areTestsRunning = trpc.admin.areTestsRunning.useQuery();
    const runningTests = areTestsRunning.data;

    const [file, setFile] = useState<File | undefined>(undefined);

    const downloadBackup = async () => {
        const data = await downloadBackupMut.mutateAsync();
        if (!data) return;

        const mediaType = "data:application/json;base64,";
        window.open(`${mediaType}${data}`, "_blank");
    }

    const uploadBackup = async () => {
        if (!file)
            return;

        const modalResult = await confirm({
            warningText: "TATO AKCE NENÁVRATNĚ NAHRADÍ CELOU DATABANKU OTÁZEK A NASTAVENÍ TESTŮ.",
            cancelText: "NEROZUMÍM NÁSLEDKŮM, CHCI ZPĚT",
            confirmText: "ROZUMÍM NÁSLEDKŮM, CHCI NAHRÁT ZÁLOHU",
        });

        if (!modalResult.status)
            return;

        const fbuf = await file.arrayBuffer();
        const base64 = Buffer.from(fbuf).toString("base64");
        if (!base64)
            return;

        await uploadBackupMut.mutateAsync({
            base64Backup: base64,
        })
    }

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) {
            return;
        }
      
        setFile(e.target.files[0]);
    }

    if (runningTests) return (
        <div className="w-full flex flex-col">
            <p className="text-center text-lg font-bold">Pro správu záloh musí mít všechny testy status <span className="text-red-700 font-extrabold">VYPNUTÝ</span></p>
        </div>
    )
    
    return (
        <div className="flex flex-col w-full">
            <p className="mb-4">Záloha je textový soubor, který obsahuje data o nastavení testů a všech otázkách v databance. Neobsahuje informace o odpovědích žáků (k tomu slouží excel tabulky, které si lze stáhnout po ukončení testu). Doporučuje se stáhnout si novou zálohu po každém větším zásahu do databanky/testů. Zálohy je ideální mít na <span>několika místech</span>, třeba na google disku a na flashce, kdyby se náhodou stala nějaká nehoda.</p>

            <button className="ml-0 mb-10 major-button text-purple-700" onClick={async () => await downloadBackup()}>
                Stáhnout zálohu
            </button>

            <input className="mb-2" type="file" accept="application/json" id="backupInput" onChange={onFileChange}/>
            <button className="ml-0 major-button text-purple-700" onClick={async () => await uploadBackup()} disabled={runningTests}>
                Nahrát zálohu
            </button>
        </div>
    );
}
    
AdminBackup.Layout = AdminLayout;
export default AdminBackup;