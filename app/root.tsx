import { json, LoaderFunction } from "@remix-run/cloudflare";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation,
  useRouteError
} from "@remix-run/react";
import { useEffect } from "react";
import * as gtag from "~/utils/gtags.client";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { themeCookie } from "./cookies/themeCookie";
import "./tailwind.css";
import { ThemeProvider } from "./utils/themeController";

export const loader: LoaderFunction = async ({ request }) => {
  const theme = (await themeCookie.parse(request.headers.get("Cookie"))) || "light";
  return json({ theme });
}

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const loaderData = useLoaderData<{ theme: "light" | "dark" }>();
  const theme = loaderData?.theme;

  useEffect(() => {
    gtag.pageview(location.pathname, "G-6KYTN9KQ0D");
  }, [location]);


  return (
    <html lang="en" className="h-full" data-theme={theme}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="apple-mobile-web-app-title" content="UtilStation" />
        <meta name="google-adsense-account" content="ca-pub-9072743301348476"></meta>
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/png" href="/favicon-48x48.png" sizes="48x48" />
        <link rel="icon" type="image/png" href="/favicon-16x16.png" sizes="16x16" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preload" href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" as="style" />
        {process.env.NODE_ENV === "development" ? null : (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=G-6KYTN9KQ0D`}
            />
            <script
              async
              id="gtag-init"
              dangerouslySetInnerHTML={{
                __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('config', 'G-6KYTN9KQ0D', {
                  page_path: window.location.pathname,
                });
              `,
              }}
            />
            <script
              async
              src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9072743301348476`}
              crossOrigin="anonymous"
            />
          </>
        )}
        <Meta />
        <Links />
      </head>
      <body className="antialiased text-base-content h-full flex flex-col">
        <ThemeProvider initialTheme={theme}>
          {children}
        </ThemeProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html >
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  return (
    <main className="flex-grow">
      <Header />
      <section className="container mx-auto text-center">
        <article className="prose mx-auto mt-4">
          <h1 className="text-primary">Something went wrong</h1>
          <h2>{isRouteErrorResponse(error) ? error.status : "500"}</h2>
        </article >
      </section >
      <Footer />
    </main >
  )
}
export default function App() {
  return <Outlet />;
}
