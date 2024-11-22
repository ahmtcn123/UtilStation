import { LinksFunction, MetaFunction } from "@remix-run/cloudflare";
import { useEffect, useRef, useState } from "react";
import ToolArticleContainer from "~/components/ToolArticleContainer";
import ToolContainer from "~/components/ToolContainer";
import ToolPage from "~/components/ToolPage";
import useToolInfo from "~/hooks/useToolInfo";
import { CommonLinksGenerator, CommonMetaGenerator } from "~/utils/CommonCodeGenerators";
import theme from "../../../tailwind.config";
import { useMediaQuery } from "react-responsive";
import clsx from "clsx";
import { marked } from "marked";
import DOMPurify from "dompurify"
import hljs from "highlight.js";

//<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/styles/default.min.css">
import "highlight.js/styles/atom-one-dark-reasonable.min.css";

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

            await import("ace-builds/src-noconflict/mode-markdown");
            const themeMonokai = await import("ace-builds/src-noconflict/theme-monokai");

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
            const renderer = new marked.Renderer();

            renderer.options

            marked.setOptions({
                renderer: renderer,
            });

            /*             renderer.link = function ({ href, title, text }) {
                            console.log("link", href, title, text);
                            return `<a target="_blank" href="${href}">${text}</a>`;
                        } */

            const editorText = getEditorText();

            let renderedHTML = "";


            const linkRenderer = renderer.link;
            renderer.link = function ({ href, title, text, ...oth }) {
                console.log("link", href, title, text);
                const html = linkRenderer.call(renderer, { href, title, text, ...oth });
                const oldHref = html.match(/href="([^"]*)"/);
                console.log("oldHref", oldHref);
                if (!oldHref) {
                    return "<p>broken link</p>";
                }

                //(?:<a [^>]+>)(.+)(?:<\/a>)
                const inside = html.match(/(?:<a [^>]+>)(.+)(?:<\/a>)/);

                if (!inside) {
                    return "<p>broken link</p>";
                }

                return `<a target="_blank" rel="nofollow" href="/leaving-utilstation?url=${oldHref[1]}">${inside[1]}</a>`;


                //replace href with a new href, add target="_blank"

                //return `<a class="inline" target="_blank" href="./leaving-code-utils?url=${href}">${text_rendered}</a>`;


            }

            renderer.code = function ({ text, lang }) {
                console.log("code", text, lang);
                //use highlight.js to highlight the code
                if (lang) {
                    const validLanguage = hljs.getLanguage(lang) ? lang : "plaintext";
                    return `<pre><code class="hljs ${validLanguage}">${hljs.highlight(text, {
                        language: validLanguage,
                    }).value}</code></pre>`;
                }
                return `<pre><code class="hljs">${hljs.highlightAuto(text).value}</code></pre>`;
            }

            try {
                renderedHTML = await marked(editorText);
                //! TODO: This causes target="_blank" to be removed figure out why
                renderedHTML = DOMPurify.sanitize(renderedHTML);
            } catch (e) {
                console.error('error', e);
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
            console.log(state);
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
                                placeholder="Enter a non-formatted JSON here"
                            />
                        </div>
                    </div>
                    {/* Preview Field */}
                    <div className={clsx("h-[600px] overflow-y-auto", {
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
                Markdown <kbd className="kbd">{viewSelection === "editor" ? "Editor" : "Viewer"}</kbd>
            </ToolArticleContainer>
        </ToolPage >
    );
}
