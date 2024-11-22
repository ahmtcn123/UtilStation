import { json, LoaderFunction, MetaFunction } from "@remix-run/cloudflare";
import { useLocation } from "@remix-run/react";
import Header from "~/components/Header";

export const loader: LoaderFunction = ({ request }) => {
    const url = new URL(request.url);

    if (url.pathname.endsWith(".html")) {
        return json(null, { status: 410 });
    }

    return json(null, { status: 404 });
};

export const meta: MetaFunction = () => {
    return [
        { name: "robots", content: "noindex" }
    ]
}


export default function NotFound() {
    const location = useLocation();
    return (
        <main>
            <Header />
            <section className="container mx-auto text-center">
                <article className="prose mx-auto mt-4">
                    <h1 className="text-primary">{location.pathname.endsWith(".html") ? "410" : "404"}</h1>
                    <h2>Sorry, the page you are looking for cannot be found.!</h2>
                </article>
            </section>
        </main>
    );
}