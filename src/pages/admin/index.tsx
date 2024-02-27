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
    const dashboardDataQuery = trpc.admin.getDashboardData.useQuery();
    const dashboardData = dashboardDataQuery.data;

    const currentlyTestedQuery = trpc.admin.getCurrentlyTested.useQuery();
    const currentlyTested = currentlyTestedQuery.data;

    if (!dashboardData || !currentlyTested)
        return (
            <>
                Data bohužel nejsou dostupná
            </>
        );

    return (
        <>
            <Head>
                <title>Rozřazovák | Admin panel</title>
            </Head>

            <main className="flex min-h-screen flex-col w-full">
                <div className="flex flex-row justify-around bg-gradient-to-br from-purple-400 to-purple-500 w-full h-34 rounded-3xl p-8 shadow-md">
                    <div className="flex flex-col">
                        <p className="font-semibold text-slate-200/[.8]">OTÁZKY V DATABANCE</p>
                        <p className="font-extrabold text-slate-100 text-4xl">{dashboardData.availableQuestions}</p>
                    </div>
                    <div className="flex flex-col">
                        <p className="font-semibold text-slate-200/[.8]">AKTUÁLNĚ TESTOVANÍ</p>
                        <p className="font-extrabold text-slate-100 text-4xl">{currentlyTested.length}</p>
                    </div>
                    <div className="flex flex-col">
                        <p className="font-semibold text-slate-200/[.8]">PROBÍHAJÍCÍ TESTY</p>
                        <p className="font-extrabold text-slate-100 text-4xl">{dashboardData.runningTests}</p>
                    </div>
                </div>

                
                <div className="flex flex-col w-full m-6 rounded-3xl mx-auto">
                    <p className="font-semibold text-slate-400 px-4 py-2">AKTUÁLNĚ TESTOVANÍ</p>
                    <div className="flex justify-start px-8 py-2 bg-purple-200 rounded-3xl text-purple-800 mb-6 text-left font-semibold">
                        {/* <p className="w-10 mr-4">ID</p> */}
                        <p className="w-96 mr-4">Jméno</p>
                        <p className="w-80 mr-4">Email</p>
                        <p className="w-40 mr-4">Ročník</p>
                    </div>
                    {/* <QuestionsListing questions={questions} getQuestionDataCallback={(id) => getQuestionData(id)}/> */}
                    <UserListing users={currentlyTested} />
                </div>
            </main>
        </>
    );
};

type UserListingProps = {
    users: {
        email: string | null;
        name: string | null;
        classYear: number;
    }[]
};

const UserListing: React.FC<UserListingProps> = (props) => {
    const {
        users
    } = props;

    if (!users) return (
        <>
        </>
    );

    return (
        <>
            {users.map(user => (
                <div key={user.email} className="flex justify-start px-8 py-2 mb-2 text-left text-slate-700 rounded-3xl font-extrabold">
                    <p className="w-96 mr-4 truncate">{user.name}</p>
                    <p className="w-80 mr-4 truncate">{user.email}</p>
                    <p className="w-40 mr-4">{user.classYear}</p>
                </div>
            ))}
        </>
    );
}

AdminHome.Layout = AdminLayout;

export default AdminHome;