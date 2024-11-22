import { ArrowDownOnSquareIcon, Bars3BottomRightIcon } from "@heroicons/react/24/outline";
import { LinksFunction, MetaFunction } from "@remix-run/cloudflare";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";
import ToolArticleContainer from "~/components/ToolArticleContainer";
import ToolContainer from "~/components/ToolContainer";
import ToolPage from "~/components/ToolPage";
import useToolInfo from "~/hooks/useToolInfo";
import { CommonLinksGenerator, CommonMetaGenerator } from "~/utils/CommonCodeGenerators";
import { event } from "~/utils/gtags.client";
import theme from "../../../tailwind.config";

export const meta: MetaFunction = ({ location }) => {
    return [
        ...CommonMetaGenerator({
            title: "UtilStation - JSON Formatter",
            description: "Easily beautify & minify JSON data with our JSON Formatter tool. Perfect for developers working with JSON data.",
            extraKeywords: ["JSON formatter", "JSON beautifier", "JSON minifier", "JSON formatting tool"],
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

export default function JsonFormatter() {
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
    const [isError, setIsError] = useState(false);
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

            await import("ace-builds/src-noconflict/mode-json");
            const themeMonokai = await import("ace-builds/src-noconflict/theme-monokai");

            editor = ace!.edit(editorRef.current);
            editor.setTheme(themeMonokai);
            editor.session.setUseWorker(false);
            editor.session.setMode("ace/mode/json");
            editor.setValue(text, 1); // Moves cursor to the start
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

    const setEditorText = (text: string) => {
        if (editorRef.current && biggerThenXsm && ace) {
            ace.edit(editorRef.current).setValue(text, 1); // Re-set the text in the editor
        }
        if (inputRef.current && !biggerThenXsm) {
            inputRef.current.value = text;
        }
    };
    //

    //callbacks
    const handleBeautifyButtonClick = () => {
        try {
            setIsError(false);
            const text = getEditorText();
            const formattedText = JSON.stringify(JSON.parse(text), null, 2);
            if (!editorRef.current) return;
            setEditorText(formattedText);
            event({
                action: "jsonBeautified",
                category: "toolUse",
                label: "JsonFormatter",
                value: "1",
            })
        } catch (e) {
            setIsError(true);
        }
    };

    const handleMinifyButtonClick = () => {
        try {
            setIsError(false);
            const text = getEditorText();
            const formattedText = JSON.stringify(JSON.parse(text));
            if (!editorRef.current) return;
            setEditorText(formattedText);
            event({
                action: "jsonMinified",
                category: "toolUse",
                label: "JsonFormatter",
                value: "1",
            })
        } catch (e) {
            setIsError(true);
        }
    }
    //

    return (
        <ToolPage toolProps={toolInfo}>
            <ToolContainer>
                <h2 className="text-2xl font-bold text-center">JSON Formatter</h2>
                <br />
                <div className="flex-col items-center justify-center hidden xsm:flex">
                    <div className="mockup-code w-full p-4">
                        <div
                            ref={editorRef} // Ace Editor attaches to this div
                            style={{ width: "100%", height: "600px", marginTop: "20px" }}
                        />
                    </div>
                </div>
                <div className="flex flex-row items-center justify-center xsm:hidden">
                    <textarea
                        ref={inputRef}
                        className="input input-bordered w-full h-[400px] resize-none"
                        placeholder="Enter a non-formatted JSON here"
                    />
                </div>
                <div className={clsx("text-error text-center min-h-[30px] my-2", { 'opacity-0': !isError })}>
                    Invalid JSON. Please check your input.
                </div>
                <div className="flex justify-center gap-3">
                    <button
                        aria-label="Beautify JSON Button"
                        className="btn btn-primary"
                        onClick={handleBeautifyButtonClick}
                    >
                        Beautify JSON
                        <Bars3BottomRightIcon className="size-6 currentColor" />
                    </button>
                    <button
                        aria-label="Beautify JSON Button"
                        className="btn btn-primary"
                        onClick={handleMinifyButtonClick}
                    >
                        Minify JSON
                        <ArrowDownOnSquareIcon className="size-6 currentColor" />
                    </button>
                </div>
            </ToolContainer>
            <ToolArticleContainer>
                <h3>What is a JSON Formatter?</h3>
                <p>A JSON Formatter is a tool that makes working with JSON data more manageable by providing options to beautify (format for readability) or minify (compress for efficiency) JSON. JSON, or JavaScript Object Notation, is a popular data-interchange format that&apos;s easy for humans to read and write and easy for machines to parse and generate. You can learn more about JSON on <a href="https://en.wikipedia.org/wiki/JSON" target="_blank" rel="noreferrer">Wikipedia</a>.</p>

                <h3>Why Use a JSON Formatter?</h3>
                <p>Using a JSON formatter can:</p>
                <ul>
                    <li><strong>Improve Readability</strong>: Beautifies JSON data, making it easier to read and understand, especially when working with complex nested structures.</li>
                    <li><strong>Optimize for Performance</strong>: Minifies JSON data by removing unnecessary whitespace, making it smaller and faster to transfer over networks.</li>
                    <li><strong>Debugging Aid</strong>: Makes JSON easier to inspect, helping you quickly spot any formatting issues or errors.</li>
                </ul>

                <h3>Features of Our JSON Formatter Tool</h3>
                <p>Our JSON Formatter tool provides flexible options for managing JSON data:</p>
                <ul>
                    <li><strong>Minify and Beautify Options</strong>: Easily switch between minified and beautified views of your JSON data to suit your needs.</li>
                    <li><strong>Real-Time Formatting</strong>: Instantly format JSON as you paste or type it, streamlining the process.</li>
                    <li><strong>One-Click Copy</strong>: Quickly copy the formatted or minified JSON to your clipboard for immediate use.</li>
                    <li><strong>Syntax Highlighting</strong>: Helps you easily distinguish different JSON components, making it simpler to read and understand.</li>
                </ul>

                <h3>How JSON Formatting Works</h3>
                <p>JSON formatting improves readability by adding spaces, tabs, and line breaks, or removes them to create a minified version. Here’s a quick breakdown:</p>
                <ul>
                    <li><strong>Beautification</strong>: Adds indentation and newlines to make JSON more readable, helping you understand data structure at a glance.</li>
                    <li><strong>Minification</strong>: Removes all unnecessary whitespace, making the JSON as compact as possible for efficient storage and transmission.</li>
                    <li><strong>Syntax Validation</strong>: Validates your JSON to ensure it adheres to the correct syntax, preventing errors in JSON parsing.</li>
                </ul>

                <h3>How to Use the JSON Formatter Tool</h3>
                <ol>
                    <li><strong>Paste or Type Your JSON:</strong> Input JSON data directly into the tool to start formatting.</li>
                    <li><strong>Select Beautify or Minify:</strong> Choose to format your JSON for readability or minify it for compact storage.</li>
                    <li><strong>View or Copy the Result:</strong> Once formatted, use the copy feature to save your beautified or minified JSON for further use.</li>
                </ol>

                <h3>Try Our JSON Formatter Tool</h3>
                <p>Ready to simplify your JSON handling? Use our JSON Formatter Tool to beautify or minify JSON data with ease. Try it out today to make your JSON work faster and more efficient!</p>
            </ToolArticleContainer>
        </ToolPage>
    );
}
