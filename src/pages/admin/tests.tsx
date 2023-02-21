import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { NextPageWithLayout } from "../_app";
import { AdminLayout } from "../../components/admin/adminLayout";

const AdminQuestion: NextPageWithLayout = () => {
    return (
        <>
            <Head>
                <title>Rozřazovák | Admin panel</title>
                <meta name="description" content="Admin panel" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="flex min-h-screen flex-col w-full p-16">
                <h1 className="text-4xl font-bold text-center">Testy</h1>
            </main>
        </>
    );
};

AdminQuestion.Layout = AdminLayout;

export default AdminQuestion;
