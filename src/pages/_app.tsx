// src/pages/_app.tsx
import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import type { AppProps, AppType } from "next/app";
import { trpc } from "../utils/trpc";
import { NextPage } from "next";
import Head from "next/head";

export type NextPageWithLayout<P = unknown, IP = P> = NextPage<P, IP> & {
    // getLayout?: (page: ReactElement) => ReactNode,
    Layout?: typeof DefaultLayout,
}

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout
}

const DefaultLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
        <>
            {children}
        </>
    );
};

const MyApp: AppType<{ session: Session | null }> = ({
    Component,
    pageProps: { session, ...pageProps },
}: AppPropsWithLayout) => {

    const Wrapper = Component.Layout ?? DefaultLayout;
    const year = new Date().getFullYear();

    return (
        <SessionProvider session={session}>
            <Wrapper>
                <Head>
                    <title>Rozřazovák {year}</title>
                    <meta name="description" content="Rozřazovací test pro GJP-ME" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <Component {...pageProps} />
            </Wrapper>
        </SessionProvider>
    );
};

export default trpc.withTRPC(MyApp);
