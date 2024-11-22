import { ArrowPathRoundedSquareIcon } from "@heroicons/react/24/outline";
import { LinksFunction, MetaFunction } from "@remix-run/cloudflare";
import { useState } from "react";
import ToolArticleContainer from "~/components/ToolArticleContainer";
import ToolContainer from "~/components/ToolContainer";
import ToolPage from "~/components/ToolPage";
import useToolInfo from "~/hooks/useToolInfo";
import { CommonLinksGenerator, CommonMetaGenerator, switchToggleComponentByCallback } from "~/utils/CommonCodeGenerators";
import { event } from "~/utils/gtags.client";


export const meta: MetaFunction = ({ location }) => {
    return [
        ...CommonMetaGenerator({
            title: "UtilStation - Case Converter",
            description: "Quickly transform text into various formats with our Text Case Converter tool. Ideal for writing, coding, and more with UtilStation.",
            extraKeywords: ["text case converter", "text case formatter", "text case changer"],
            location
        }),
    ];
};

export const links: LinksFunction = () => {
    return [
        ...CommonLinksGenerator()
    ];
}

export enum CaseType {
    UpperCase,
    LowerCase,
    TitleCase,
    SentenceCase,
    CamelCase,
    PascalCase,
    SnakeCase,
    ScreamingSnakeCase,
    KebabCase,
    DotCase,
}

export default function TextCaseConverter() {
    const toolInfo = useToolInfo();

    //states
    const [text, setText] = useState("");
    const [selectedCase, setSelectedCase] = useState<CaseType>(CaseType.UpperCase);
    const autoSplitState = useState(true);

    //utils
    function convertText(_text: string, caseType: CaseType): string {

        console.log(_text, caseType, autoSplitState[0]);
        if (autoSplitState[0]) {
            _text = _text.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/([A-Z])([A-Z][a-z])/g, "$1 $2");
            _text = _text.replace(/_/g, " ").replace(/-/g, " ");
            _text = _text.replace(/\s-/g, " ");
        }
        const text = _text;

        switch (caseType) {
            case CaseType.UpperCase:
                return text.toUpperCase();
            case CaseType.LowerCase:
                return text.toLowerCase();
            case CaseType.TitleCase:
                return text.replace(/\b\w/g, (char) => char.toUpperCase());
            case CaseType.SentenceCase:
                return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
            case CaseType.CamelCase:
                return text.replace(/\b\w/g, (char, index) => index === 0 ? char.toLowerCase() : char.toUpperCase()).replace(/\s/g, "");
            case CaseType.PascalCase:
                return text.replace(/\b\w/g, (char) => char.toUpperCase()).replace(/\s/g, "");
            case CaseType.SnakeCase:
                return text.replace(/\s/g, "_").toLowerCase();
            case CaseType.ScreamingSnakeCase:
                return text.replace(/\s/g, "_").toUpperCase();
            case CaseType.KebabCase:
                return text.replace(/\s/g, "-").toLowerCase();
            case CaseType.DotCase:
                return text.replace(/\s/g, ".").toLowerCase();
            default:
                return text;
        }
    }
    //

    // Callbacks
    function handleTextChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        setText(event.target.value);
    }

    function handleCaseChange(caseType: CaseType) {
        return () => {
            setSelectedCase(caseType);
        }
    }

    function handleConvertButtonClick() {
        const convertedText = convertText(text, selectedCase);
        setText(convertedText);
        event({
            action: "textCleaned",
            category: "toolUse",
            label: "HiddenCharacterCleaner",
            value: "1",
        })
    }
    //

    //useEffects
    //

    return (
        <ToolPage toolProps={toolInfo}>
            <ToolContainer>
                <h2 className="text-2xl font-bold text-center">Case Converter</h2>
                <br />
                <div className="max-w-2xl mx-auto">
                    <div className="flex flex-col mx-auto items-center justify-center">
                        <textarea
                            className='input input-bordered w-full h-[200px] resize-none'
                            placeholder="Enter your text here..."
                            value={text}
                            onChange={handleTextChange}
                            autoComplete="off"
                        />
                    </div>
                    <br />
                    <div className="flex justify-center">
                        <button aria-label="Convert Selected Case Button" className="btn btn-primary" onClick={handleConvertButtonClick} disabled={!text.length}>
                            Convert
                            <ArrowPathRoundedSquareIcon className="size-6 currentColor" />
                        </button>
                    </div>
                    <br />
                    <div className="form-control">
                        <label className="label cursor-pointer">
                            <span className="label-text">Automatically split words by <kbd className="kbd">-</kbd>, <kbd className="kbd">_</kbd>, <kbd className="kbd">PascalCase</kbd> or <kbd className="kbd">camelCase</kbd></span>
                            <input type="checkbox" className="toggle toggle-primary" autoComplete="off" {...switchToggleComponentByCallback(autoSplitState)} />
                        </label>
                    </div>
                    <hr />
                    {[
                        { id: "upperCase", label: "Upper Case", type: CaseType.UpperCase },
                        { id: "lowerCase", label: "Lower Case", type: CaseType.LowerCase },
                        { id: "titleCase", label: "Title Case", type: CaseType.TitleCase },
                        { id: "sentenceCase", label: "Sentence Case", type: CaseType.SentenceCase },
                        { id: "camelCase", label: "Camel Case", type: CaseType.CamelCase },
                        { id: "pascalCase", label: "Pascal Case", type: CaseType.PascalCase },
                        { id: "snakeCase", label: "Snake Case", type: CaseType.SnakeCase },
                        { id: "screamingSnakeCase", label: "Screaming Snake Case", type: CaseType.ScreamingSnakeCase },
                        { id: "kebabCase", label: "Kebab Case", type: CaseType.KebabCase },
                        { id: "dotCase", label: "Dot Case", type: CaseType.DotCase },
                    ].map(({ id, label, type }) => (
                        <button
                            aria-label={`Select ${label} Case`}
                            className="form-control w-full mt-1"
                            key={id}
                            onClick={handleCaseChange(type)}
                        >
                            <label className="label cursor-pointer flex" htmlFor={id}>
                                <span className="label-text">{label}</span>
                                <input
                                    type="radio"
                                    id={id}
                                    name="caseType"
                                    className="radio radio-primary"
                                    checked={selectedCase === type}
                                    readOnly
                                    autoComplete="off"
                                />
                            </label>
                        </button>
                    ))}
                </div>
            </ToolContainer>
            <ToolArticleContainer>
                <h3>What is a Text Case Converter?</h3>
                <p>A Text Case Converter is a tool that quickly transforms text into various formats, making it ideal for writing, coding, and more. Here’s a rundown of the popular case types our tool supports:</p>

                <h3>Popular Text Case Formats</h3>
                <ul>
                    <li><strong>Uppercase</strong> - Converts all letters to uppercase. <em>Example:</em> &ldquo;HELLO WORLD&ldquo;</li>
                    <li><strong>Lowercase</strong> - Converts all letters to lowercase. <em>Example:</em> &ldquo;hello world&ldquo;</li>
                    <li><strong>Title Case</strong> - Capitalizes the first letter of each word. <em>Example:</em> &ldquo;Hello World&ldquo;</li>
                    <li><strong>Sentence Case</strong> - Capitalizes only the first letter of the sentence. <em>Example:</em> &ldquo;Hello world&ldquo;</li>
                    <li><strong>Camel Case</strong> - Joins words without spaces, capitalizing each word except the first. <em>Example:</em> &ldquo;helloWorld&ldquo;</li>
                    <li><strong>Pascal Case</strong> - Similar to camel case but capitalizes every word, including the first. <em>Example:</em> &ldquo;HelloWorld&ldquo;</li>
                    <li><strong>Snake Case</strong> - Replaces spaces with underscores, using lowercase letters. <em>Example:</em> &ldquo;hello_world&ldquo;</li>
                    <li><strong>Screaming Snake Case</strong> - Snake case but with all uppercase letters. <em>Example:</em> &ldquo;HELLO_WORLD&ldquo;</li>
                    <li><strong>Kebab Case</strong> - Replaces spaces with hyphens, using lowercase letters. <em>Example:</em> &ldquo;hello-world&ldquo;</li>
                    <li><strong>Dot Case</strong> - Replaces spaces with periods. <em>Example:</em> &ldquo;hello.world&ldquo;</li>
                </ul>

                <h3>How to Use the Text Case Converter Tool</h3>
                <ol>
                    <li><strong>Enter Your Text:</strong> Paste or type your text into the input field.</li>
                    <li><strong>Select the Desired Case:</strong> Choose the case style you want (e.g., uppercase, camel case, etc.).</li>
                    <li><strong>Convert and Copy:</strong> Click &ldquo;Convert&ldquo; to apply the change, then copy your formatted text.</li>
                </ol>

                <h3>Start Converting with Ease</h3>
                <p>Our Text Case Converter Tool is designed to make formatting easy. Try it out and keep your text clean, consistent, and ready for any purpose!</p>
            </ToolArticleContainer>
        </ToolPage>
    )
}