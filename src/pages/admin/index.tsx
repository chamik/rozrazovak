import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { signIn, useSession } from "next-auth/react";
import { AdminLayout } from "../../components/admin/adminLayout";
import { NextPageWithLayout } from "../_app";
import { getServerAuthSession } from "../../server/common/get-server-auth-session";

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
    return (
        <>
            <Head>
                <title>Rozřazovák | Admin panel</title>
            </Head>

            <main className="flex min-h-screen flex-col w-full p-16">
                <h1 className="text-4xl font-bold text-center">Administrátorský panel Rozřazováků</h1>
            </main>
        </>
    );
};

AdminHome.Layout = AdminLayout;

export default AdminHome;