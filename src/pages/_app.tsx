// src/pages/_app.tsx
import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import type { AppProps, AppType } from "next/app";
import { trpc } from "../utils/trpc";
import { NextPage } from "next";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  // getLayout?: (page: ReactElement) => ReactNode,
  Layout?: typeof DefaultLayout,
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

const DefaultLayout: React.FC<React.PropsWithChildren> = ({children}) => {
  return (
      <>
          {children}
      </>
  );
};

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  /* @ts-ignore */
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) => {

  const Wrapper = Component.Layout ?? DefaultLayout;

  return (
    <SessionProvider session={session}>
      {/* @ts-ignore */}
      <Wrapper>
        <Component {...pageProps} />
      </Wrapper>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
