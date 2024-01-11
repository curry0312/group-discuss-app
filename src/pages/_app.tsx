import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "src/components/ui/toaster";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import NextTopLoader from "nextjs-toploader";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps}>
      <Toaster />
      <NextTopLoader />
      <Component {...pageProps} />
      <ReactQueryDevtools initialIsOpen={false} />
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
