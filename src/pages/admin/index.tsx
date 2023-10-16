import type { GetServerSideProps } from "next";
import Head from "next/head";
import { AdminLayout } from "../../components/admin/adminLayout";
import { NextPageWithLayout } from "../_app";
import { getServerAuthSession } from "../../server/common/get-server-auth-session";
import { trpc } from "../../utils/trpc";
import { TestStatus } from "@prisma/client";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const session = await getServerAuthSession(ctx);

    if (!session) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    return {
        props: { session },
    };
};

const AdminHome: NextPageWithLayout = () => {
    const testsData = trpc.admin.getAllTests.useQuery();
    const tests = testsData.data?.tests;

    const testAmount = tests?.filter(x => x.status == TestStatus.ACTIVE).length || 0;

    return (
        <>
            <Head>
                <title>Rozřazovák | Admin panel</title>
            </Head>

            <main className="flex min-h-screen flex-col w-full">
                <div className="flex flex-row justify-around bg-gradient-to-br from-purple-400 to-purple-500 w-full h-34 rounded-3xl p-8 shadow-md">
                    <div className="flex flex-col">
                        <p className="font-semibold text-slate-200/[.8]">PROBÍHAJÍCÍCH TESTŮ</p>
                        <p className="font-extrabold text-slate-100 text-4xl">{testAmount}</p>
                    </div>
                    <div className="flex flex-col">
                        <p className="font-semibold text-slate-200/[.8]">TESTOVANÝCH</p>
                        <p className="font-extrabold text-slate-100 text-4xl">34</p>
                    </div>
                    <div className="flex flex-col">
                        <p className="font-semibold text-slate-200/[.8]">PROBÍHAJÍCÍCH TESTŮ</p>
                        <p className="font-extrabold text-slate-100 text-4xl">{testAmount}</p>
                    </div>
                </div>
            </main>
        </>
    );
};

AdminHome.Layout = AdminLayout;

export default AdminHome;