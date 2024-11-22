import clsx from "clsx";


export default function ToolContainer({ children, size }: { children: React.ReactNode, size?: string }) {
    return <section className={clsx("container mx-auto px-2 pt-6", {
        "max-w-2xl": size === "2xl",
        "max-w-4xl": !size
    })}>
        {children}
    </section>
}