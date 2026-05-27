import { useEffect } from "react";
import { useRouter } from "next/router";
import "../styles/globals.css";
import ErrorBoundary from "../components/ErrorBoundary";
import { trackPageView } from "../utils/tracker";

export default function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    trackPageView();
    const handleRouteChange = () => trackPageView();
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => router.events.off("routeChangeComplete", handleRouteChange);
  }, [router.events]);

  return (
    <ErrorBoundary>
      <Component {...pageProps} />
    </ErrorBoundary>
  );
}
