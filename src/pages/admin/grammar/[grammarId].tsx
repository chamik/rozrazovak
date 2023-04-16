import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { AdminLayout } from "../../../components/admin/adminLayout";
import { QuestionEdit } from "../../../components/admin/grammarEdit";
import { router } from "../../../server/trpc/trpc";
import { NextPageWithLayout } from "../../_app";

const GrammarPage: NextPageWithLayout = () => {
    const router = useRouter()
    const { grammarId } = router.query
    const id = Number(grammarId)

    if (!id)
        return(
            <></>
        );

    return (
        <>
            <QuestionEdit questionId={id}/>
        </>
    )
}

GrammarPage.Layout = AdminLayout;

export default GrammarPage;