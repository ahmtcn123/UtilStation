import Footer from "./Footer";
import Header, { Tool } from "./Header";
import Toolbar from "./Toolbar";


export type ToolPageProps = {
    children: React.ReactNode;
    toolProps: Tool;
}

export default function ToolPage({ children, toolProps }: ToolPageProps) {
    return <main>
        <Header />
        <Toolbar {...toolProps} />
        {children}
        <Footer notFixedToBottom />
    </main>
}