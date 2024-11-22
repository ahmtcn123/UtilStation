import Footer from "./Footer";
import Header from "./Header";


export type ArticlePageProps = {
    children: React.ReactNode;
}

export default function ArticlePage({ children }: ArticlePageProps) {
    return <main>
        <Header />
        <section className="container mx-auto max-w-2xl px-2 my-8">
            <article className="prose">
                {children}
            </article>
        </section>
        <section>
            <Footer notFixedToBottom />
        </section>
    </main>
}