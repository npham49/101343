import React from "react";
import "@/styles/globals.css";
import { GlobalContextProvider } from "@/context/state";
import { ClerkProvider } from "@clerk/nextjs";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import NavBar from "@/components/NavBar";

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = React.useState(() => new QueryClient());
  return (
    // Provide the client to your App
    <ClerkProvider {...pageProps}>
      <QueryClientProvider client={queryClient}>
        <GlobalContextProvider>
          <NavBar />
          <Component {...pageProps} />
        </GlobalContextProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ClerkProvider>
  );
}
