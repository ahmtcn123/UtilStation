import clsx from "clsx";


export interface FooterProperties {
    notFixedToBottom?: boolean;
}

export default function Footer(props: FooterProperties) {

    const footerClass = clsx(
        "footer bg-neutral text-neutral-content items-center p-4 mt-4",
        {
            "fixed bottom-0 w-full": !props.notFixedToBottom
        }
    )

    return (
        <footer className={footerClass}>
            <aside className="grid-flow-col items-center">
                <img src="/behemehalLogoMini.webp" alt="behemehalLogo" width={36} height={36} />
                <p><a href="https://behemehal.org" target="_blank" rel="noreferrer">Behemehal</a> {new Date().getFullYear()} - All right reserved</p>
            </aside>
        </footer>
    );
}