import { ShieldExclamationIcon } from "@heroicons/react/24/outline";
import { MetaFunction } from "@remix-run/cloudflare"
import { useNavigate, useSearchParams } from "@remix-run/react";
import { useEffect } from "react";
import Header from "~/components/Header";


export const meta: MetaFunction = () => {
    return [
        { title: "Leaving UtilStation", content: "noindex" },
        { name: "robots", content: "noindex" }
    ]
}

export default function LeavingUtilStation() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    console.log(searchParams);


    const urlToRedirect = searchParams.get("url");

    const revert = () => {
        window.history.back();
    }

    const forward = () => {
        window.location.href = urlToRedirect!;
    }

    useEffect(() => {
        if (!urlToRedirect) {
            setTimeout(() => {
                navigate("/");
            }, 1500);
        }
    }, [urlToRedirect]);

    return (
        <main>
            <Header />
            <section className="container mx-auto text-center">
                <article className="prose mx-auto mt-4 text-center">
                    <ShieldExclamationIcon className="text-warning size-32 mx-auto" />
                    <br />
                    <h1 className="text-primary">You&apos;re leaving UtilStation</h1>
                    <h2>You&apos;re being redirected to a page outside of <span className="text-secondary">UtilStation</span>.</h2>
                    {
                        urlToRedirect &&
                        <>
                            <kbd className="kbd text-primary">URL: {urlToRedirect}</kbd>
                            <br />
                            <br />
                            <div className="flex flex-row gap-5 justify-around mt-4">
                                <button className="btn btn-primary" onClick={revert}>Go Back</button>
                                <button className="btn btn-error" onClick={forward}>Continue</button>
                            </div>
                        </>
                    }
                </article>
            </section>
        </main>
    );
}