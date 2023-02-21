import type { NextPage } from "next";
import Head from "next/head";
import { signIn, useSession } from "next-auth/react";
import { AdminLayout } from "../../components/admin/adminLayout";
import { NextPageWithLayout } from "../_app";

const AdminHome: NextPageWithLayout = () => {
    return (
        <>
            <Head>
                <title>Rozřazovák | Admin panel</title>
                <meta name="description" content="Admin panel" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="flex min-h-screen flex-col w-full p-16">
                <h1 className="text-4xl font-bold text-center">Administrátorský panel Rozřazováků</h1>
            </main>
        </>
    );
};

AdminHome.Layout = AdminLayout;

export default AdminHome;