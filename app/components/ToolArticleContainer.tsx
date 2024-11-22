

export default function ToolArticleContainer({ children }: { children: React.ReactNode }) {
    return <>
        <br />
        <hr />
        <br />
        <section className="container mx-auto max-w-2xl px-2">
            <article className="prose">
                {children}
            </article>
        </section>
        <br />
    </>

}