import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { NextPageWithLayout } from "../../_app";
import { AdminLayout } from "../../../components/admin/adminLayout";
import { TestEdit } from "../../../components/admin/testEdit";
import { Test } from "@prisma/client";
import { trpc } from "../../../utils/trpc";

const AdminQuestion: NextPageWithLayout = () => {
    const testsData = trpc.admin.getAllTests.useQuery();
    const tests = testsData.data?.tests;

    return (
        <>
            <Head>
                <title>Rozřazovák | Admin panel</title>
                <meta name="description" content="Admin panel" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="flex min-h-screen flex-col w-full p-16">
                <h1 className="text-4xl font-bold text-center pb-10">Testy</h1>

                <TestsListing tests={tests} />
            </main>
        </>
    );
};

type TestsListingProps = {
    tests: Test[] | undefined
};

const TestsListing: React.FC<TestsListingProps> = (props) => {
    const {
        tests,
    } = props;

    if (!tests) return (
        <>
            unable to load tests, call Kubík, something went wrong :p
        </>
    );

    return (
        <div className="flex flex-col ">
            {tests.map(test => (
                <TestEdit test={test}/>
            ))}
        </div>
    );
}

AdminQuestion.Layout = AdminLayout;

export default AdminQuestion;
