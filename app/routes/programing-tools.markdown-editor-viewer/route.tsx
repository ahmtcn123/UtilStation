import { LinksFunction, MetaFunction } from "@remix-run/cloudflare";
import clsx from "clsx";
//import DOMPurify from "dompurify";
//import { marked } from "marked";
import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";
import ToolArticleContainer from "~/components/ToolArticleContainer";
import ToolContainer from "~/components/ToolContainer";
import ToolPage from "~/components/ToolPage";
import useToolInfo from "~/hooks/useToolInfo";
import { CommonLinksGenerator, CommonMetaGenerator } from "~/utils/CommonCodeGenerators";
import theme from "../../../tailwind.config";

export const meta: MetaFunction = ({ location }) => {
    return [
        ...CommonMetaGenerator({
            title: "UtilStation - Markdown Editor&Viewer",
            description: "Easily edit and view markdown files with UtilStation Markdown Editor&Viewer.",
            extraKeywords: [
                "markdown", "markdown editor", "markdown viewer", "utilstation", "utilstation markdown editor", "utilstation markdown viewer"
            ],
            location
        }),
    ];
};

export const links: LinksFunction = () => {
    return [
        ...CommonLinksGenerator()
    ];
};

let editor: null | ReturnType<typeof import("ace-builds")["edit"]> = null;
let ace: null | typeof import("ace-builds") = null;
let hljs: null | typeof import("highlight.js")['default'] = null;
let marked: null | typeof import("marked")['marked'] = null;
let DOMPurify: null | typeof import("dompurify")['default'] = null;

export default function MarkdownEditorViewer() {
    //hooks
    const toolInfo = useToolInfo();
    const biggerThenXsm = useMediaQuery({
        query: `(min-width: ${theme.theme.screens.xsm})`,
    });
    ///

    //refs
    const editorRef = useRef(null);
    const inputRef
        = useRef<HTMLTextAreaElement | null>(null);
    //

    //states
    const [text, setText] = useState("");
    const [viewSelection, setViewSelection] = useState<"editor" | "viewer">("editor");
    //

    //useEffects
    useEffect(() => {
        //if we're in mobile, we don't need the editor
        if (!biggerThenXsm) {
            return;
        }

        const loadAce = async () => {
            if (!editorRef.current) return;
            ace = await import("ace-builds/src-noconflict/ace");
            marked = (await import("marked")).marked;
            DOMPurify = (await import("dompurify")).default;

            await import("ace-builds/src-noconflict/mode-markdown");
            const themeMonokai = await import("ace-builds/src-noconflict/theme-github_dark");

            editor = ace!.edit(editorRef.current);
            editor.setTheme(themeMonokai);
            editor.session.setUseWorker(false);

            //Set session mode to markdown
            editor.session.setMode("ace/mode/markdown");

            editor.session.on("change", () => {
                setText(editor!.getValue());
            });
        };
        loadAce();

        return () => {
            if (editor) {
                editor.destroy();
            }
        };
    }, []);

    useEffect(() => {
        async function renderMarkdown() {
            hljs = (await import("highlight.js")).default;
            const renderer = new marked!.Renderer();

            marked!.setOptions({
                renderer: renderer,
            });

            const editorText = getEditorText();

            let renderedHTML = "";


            const linkRenderer = renderer.link;
            renderer.link = function ({ href, title, text, ...oth }) {
                const html = linkRenderer.call(renderer, { href, title, text, ...oth });
                const oldHref = html.match(/href="([^"]*)"/);
                if (!oldHref) {
                    return "<p>broken link</p>";
                }

                //(?:<a [^>]+>)(.+)(?:<\/a>)
                const inside = html.match(/(?:<a [^>]+>)(.+)(?:<\/a>)/);
                if (!inside) {
                    return "<p>broken link</p>";
                }

                return `<a target="_blank" rel="nofollow" href="/leaving-utilstation?url=${oldHref[1]}">${inside[1]}</a>`;
            }

            renderer.code = function ({ text, lang }) {
                if (lang) {
                    const validLanguage = hljs?.getLanguage(lang) ? lang : "plaintext";
                    return `<pre><code class="hljs ${validLanguage}">${hljs!.highlight(text, {
                        language: validLanguage,
                    }).value}</code></pre>`;
                }
                return `<pre><code class="hljs">${hljs!.highlightAuto(text).value}</code></pre>`;
            }

            try {
                renderedHTML = await marked!(editorText);
                await import("highlight.js/styles/atom-one-dark-reasonable.min.css");
                //! TODO: This causes target="_blank" to be removed figure out why
                renderedHTML = DOMPurify!.sanitize(renderedHTML);
            } catch (e) {
                renderedHTML = `<pre>${e}</pre>`;
            }

            setText(
                renderedHTML
            );
        }

        //on switch, we need to render the markdown

        if (viewSelection === "viewer") {
            renderMarkdown();
        }
    }, [viewSelection]);
    //

    //utils
    const getEditorText = (): string => {
        const editor = editorRef.current;
        const textarea = inputRef.current;

        if (editor && biggerThenXsm && ace) {
            return ace.edit(editor).getValue();
        }
        if (textarea && !biggerThenXsm) {
            return textarea.value;
        }
        throw new Error("No editor or textarea found");
    }
    //

    //callbacks
    const onTabSwitch = (state: string) => {
        return (e: React.FormEvent<HTMLSpanElement>) => {
            e.preventDefault();
            setViewSelection(state as "editor" | "viewer");
        }
    }
    //

    return (
        <ToolPage toolProps={toolInfo}>
            <ToolContainer>
                <h2 className="text-2xl font-bold text-center">
                    Markdown <kbd className={clsx("kbd", {
                        "text-primary": viewSelection === "editor",
                        "text-secondary": viewSelection === "viewer"
                    })}>{viewSelection === "editor" ? "Editor" : "Viewer"}</kbd>
                </h2>
                <br />
                <div className="mockup-code w-full p-4 h-[600px]">
                    <div role="tablist" className="tabs tabs-lifted">
                        <button
                            onClick={onTabSwitch("editor")}
                            role="tab"
                            className={clsx("tab", {
                                "tab-active": viewSelection === "editor",
                                "text-primary": viewSelection === "editor",
                            })}
                        >
                            Edit
                        </button>
                        <button
                            onClick={onTabSwitch("viewer")}
                            role="tab"
                            className={clsx("tab", {
                                "tab-active": viewSelection === "viewer",
                                "text-primary": viewSelection === "viewer",
                            })}
                        >
                            Preview
                        </button>
                    </div>
                    <div className={clsx("h-full", {
                        "hidden": viewSelection === "viewer",
                        "block": viewSelection === "editor"
                    })}>
                        <div className="hidden xsm:flex flex-row items-center justify-center">
                            <div
                                ref={editorRef} // Ace Editor attaches to this div
                                style={{ width: "100%", height: "510px" }}
                            />
                        </div>
                        <div className="flex xsm:hidden flex-row justify-center mt-2">
                            <textarea
                                ref={inputRef}
                                className="input input-border w-full h-[500px] resize-none"
                                placeholder="Enter a markdown text here..."
                            />
                        </div>
                    </div>
                    {/* Preview Field */}
                    <div className={clsx("h-[510px] overflow-y-auto bg-[#24292e]", {
                        "hidden": viewSelection === "editor",
                        "block": viewSelection === "viewer"
                    })}>
                        <article className="prose">
                            <div className="markdown-body p-4" dangerouslySetInnerHTML={{ __html: text }} />
                        </article>
                    </div>
                </div>

            </ToolContainer>
            <ToolArticleContainer>
                <h3>What is a Markdown Editor?</h3>
                <p>
                    A <strong>Markdown Editor</strong> is a tool that allows you to write and format content using the simple, lightweight
                    <a href="https://en.wikipedia.org/wiki/Markdown" target="_blank" rel="noreferrer">Markdown syntax</a>. Markdown simplifies the process of creating structured text, such as headers, lists, links, and code blocks, without requiring complex formatting or coding skills.
                </p>
                <p>
                    Markdown editors often provide a real-time preview feature, allowing users to see how their content will look when rendered into HTML or other formats.
                </p>
                <p>
                    Originally created by John Gruber in 2004, Markdown has become a widely adopted standard for content creation due to its simplicity and portability. It&apos;s particularly popular in contexts like technical documentation, blogging, and collaborative text editing platforms like GitHub.
                </p>

                <h3>Why Use a Markdown Editor?</h3>
                <p>Using a Markdown editor can:</p>
                <ul>
                    <li><strong>Simplify Formatting:</strong> Markdown&apos;s syntax is straightforward, enabling you to add headers, lists, links, and more with minimal effort.</li>
                    <li><strong>Increase Productivity:</strong> Focus on writing content instead of worrying about formatting, as Markdown handles it efficiently.</li>
                    <li><strong>Ensure Compatibility:</strong> Markdown is widely supported across platforms and can be converted to formats like HTML, PDF, and more.</li>
                    <li><strong>Portability:</strong> Since Markdown files are plain text, they are lightweight and can be used across a variety of devices and platforms.</li>
                </ul>

                <h3>Features of Our Markdown Editor</h3>
                <p>Our <strong>Markdown Editor and Viewer</strong> provides everything you need to write, edit, and preview Markdown content effectively:</p>
                <ul>
                    <li><strong>Live Preview:</strong> View your formatted content as you write, ensuring accuracy and minimizing the need for corrections.</li>
                    <li><strong>Syntax Highlighting:</strong> Easily distinguish between text, code blocks, headers, and other elements with color-coded syntax using <a href="https://highlightjs.org/" target="_blank" rel="noreferrer">highlight.js</a>.</li>
                    <li><strong>Integrated Viewer:</strong> Seamlessly preview rendered Markdown without switching between tools.</li>
                    <li><strong>Enhanced Security:</strong> We use the <a href="https://github.com/cure53/DOMPurify" target="_blank" rel="noreferrer">DOMPurify</a> library to sanitize input, ensuring the editor remains secure and prevents malicious code execution.</li>
                    <li><strong>Export Options:</strong> Easily export your Markdown content to HTML, PDF, or other formats for sharing or publishing.</li>
                    <li><strong>Planned Export Options:</strong> Future updates will allow you to export your Markdown content to HTML, PDF, or other formats for sharing or publishing.</li>
                </ul>

                <h3>How to Use Our Markdown Editor</h3>
                <ol>
                    <li><strong>Start Writing:</strong> Use Markdown syntax to create your content. For instance, use <code>#</code> for headers, <code>**bold**</code> for bold text, and <code>`code`</code> for inline code.</li>
                    <li><strong>Preview Your Work:</strong> Toggle the live preview panel to see your content as it will appear when rendered.</li>
                    <li><strong>Enhance Content:</strong> Add code blocks, links, images, and lists with Markdown&apos;s intuitive syntax.</li>
                </ol>

                <h3>Markdown Syntax Overview</h3>
                <p>Markdown supports a wide variety of formatting options:</p>
                <ul>
                    <li><strong>Headers:</strong> Create headers using <code>#</code> (e.g., <code># Header 1</code>, <code>## Header 2</code>).</li>
                    <li><strong>Lists:</strong> Create ordered lists with numbers (<code>1.</code>, <code>2.</code>) and unordered lists with dashes (<code>-</code>).</li>
                    <li><strong>Links:</strong> Add links using <code>[text](URL)</code>.</li>
                    <li><strong>Images:</strong> Embed images using <code>![alt text](imageURL)</code>.</li>
                    <li><strong>Code Blocks:</strong> Use triple backticks (<code>```</code>) for block code and single backticks (<code>`</code>) for inline code.</li>
                    <li><strong>Emphasis:</strong> Use <code>*italic*</code> or <code>**bold**</code> for emphasis.</li>
                </ul>

                <h3>Benefits of Markdown</h3>
                <p>Markdown is popular for good reason. Some key benefits include:</p>
                <ul>
                    <li><strong>Ease of Use:</strong> Markdown&apos;s syntax is intuitive and minimalistic, making it easy to learn and use.</li>
                    <li><strong>Portability:</strong> Markdown files are plain text, ensuring they are small in size and compatible across systems.</li>
                    <li><strong>Extensibility:</strong> Advanced Markdown tools support plugins or extensions for tasks like diagram generation, mathematical formulas, and more.</li>
                </ul>

                <h3>Credits</h3>
                <p>This Markdown Editor utilizes several open-source libraries to deliver a secure, feature-rich, and user-friendly experience:</p>
                <ul>
                    <li>
                        <strong><a href="https://github.com/cure53/DOMPurify" target="_blank" rel="noreferrer">DOMPurify</a>:</strong> A highly regarded library for sanitizing HTML input, protecting against cross-site scripting (XSS) attacks and other security threats.
                    </li>
                    <li>
                        <strong><a href="https://highlightjs.org/" target="_blank" rel="noreferrer">highlight.js</a>:</strong> A fast and lightweight library for syntax highlighting, making code blocks visually appealing and easier to understand.
                    </li>
                    <li>
                        <strong><a href="https://marked.js.org/" target="_blank" rel="noreferrer">Marked</a>:</strong> A robust Markdown parser that efficiently converts Markdown content into HTML, ensuring a smooth editing and preview experience.
                    </li>
                </ul>

                <h3>Try Our Markdown Editor</h3>
                <p>
                    Start creating your content today with our powerful Markdown editor! Whether you are drafting documents, creating websites, or writing blog posts, our tool simplifies the process while delivering professional results.
                </p>
            </ToolArticleContainer>
        </ToolPage >
    );
}
