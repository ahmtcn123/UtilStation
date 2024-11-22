import { BackspaceIcon } from "@heroicons/react/24/outline";
import { LinksFunction, MetaFunction } from "@remix-run/cloudflare";
import { useEffect, useState } from "react";
import ToolArticleContainer from "~/components/ToolArticleContainer";
import ToolContainer from "~/components/ToolContainer";
import ToolPage from "~/components/ToolPage";
import useToolInfo from "~/hooks/useToolInfo";
import { CommonLinksGenerator, CommonMetaGenerator } from "~/utils/CommonCodeGenerators";
import { event } from "~/utils/gtags.client";
import { hiddenCharactersIndex, hiddenCharactersPreviews, viableCharacters } from "./hiddenCharactersIndex";


export const meta: MetaFunction = ({ location }) => {
    return [
        ...CommonMetaGenerator({
            title: "UtilStation - Hidden Characters Cleaner",
            description: "Discover hidden characters in your text and clean them up with UtilStation.",
            extraKeywords: ["hidden characters", "invisible characters", "text cleaner"],
            location
        }),
    ];
};

export const links: LinksFunction = () => {
    return [
        ...CommonLinksGenerator()
    ];
}

export default function TextHiddenCharacterCleaner() {
    const toolInfo = useToolInfo();

    //states
    const [debouncedValue, setDebouncedValue] = useState("");
    const [givenText, setGivenText] = useState("This text contains so many mysteries  …	or be​hind﻿­­­­d");
    const [charactersToRender, setCharactersToRender] = useState<{
        isHidden: boolean;
        character: string;
        codePoint: string;
        previewData?: {
            view: string;
            name: string;
        },
    }[]>([]);
    //

    //utils
    function detectHiddenCharactersByChar(text: string) {
        const charactersToRender: {
            isHidden: boolean;
            character: string;
            codePoint: string;
            previewData?: {
                view: string;
                name: string;
            },
        }[] = []

        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const codePoint = char.codePointAt(0);

            if (codePoint === undefined) {
                console.warn('Could not get code point for character:', char);
                continue;
            }

            charactersToRender.push({
                isHidden: hiddenCharactersIndex.has(codePoint),
                character: char,
                codePoint: codePoint.toString(16),
                //@ts-expect-error - Wont accept number somehow, maybe a compiler bug
                previewData: hiddenCharactersPreviews[codePoint],
            });
        }
        return charactersToRender;
    }

    //

    // Callbacks
    const onInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setGivenText(e.target.value);
    };

    const handleCleanHiddenCharacters = () => {
        const cleanedText = charactersToRender.map(char => {
            const isViable = viableCharacters.includes(parseInt(char.codePoint, 16));
            if (char.isHidden) {
                return isViable ? ' ' : '';
            } else {
                return char.character;
            }
        }).join('');
        event({
            action: "textCleaned",
            category: "toolUse",
            label: "HiddenCharacterCleaner",
            value: "1",
        })
        setGivenText(cleanedText);
    }
    //

    //useEffects
    useEffect(() => {
        const detected = detectHiddenCharactersByChar(debouncedValue);
        setCharactersToRender(detected);
    }, [debouncedValue]);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(givenText);
        }, 500); // Delay of 500ms

        // Cleanup function to clear the timeout if inputValue changes before delay ends
        return () => {
            clearTimeout(handler);
        };
    }, [givenText]);
    //

    return (
        <ToolPage toolProps={toolInfo}>
            <ToolContainer>
                <h2 className="text-2xl font-bold text-center">Hidden Character Cleaner</h2>
                <br />
                <div className="max-w-2xl mx-auto">
                    <div className="flex flex-col mx-auto items-center justify-center">
                        <textarea
                            className='input input-bordered w-full h-[200px] resize-none'
                            value={givenText}
                            onChange={onInputChange}
                        />
                    </div>
                    <br />
                    <div className="mx-auto input input-bordered rounded-lg p-4 h-[200px] overflow-y-auto">
                        {
                            charactersToRender.map((char, index) => {
                                if (char.isHidden) {
                                    return <div key={index} className="tooltip tooltip-bottom" data-tip={char.previewData ? `${char.previewData.name} - U+${char.codePoint.toString().toUpperCase()}` : undefined}>
                                        <span className="bg-secondary text-secondary-content ml-1 mr-1 min-w-4">{char.previewData ? char.previewData.view : `U + ${char.codePoint.toString().toUpperCase()} `}</span>
                                    </div>;
                                } else {
                                    return <span key={index} className="bg-primary text-primary-content">{char.character}</span>;
                                }
                            })
                        }
                    </div>
                </div>
                <br />
                <div className="flex justify-center">
                    <button aria-label="Clean Hidden Characters Button" className="btn btn-primary" onClick={handleCleanHiddenCharacters}>
                        Clean Hidden Characters
                        <BackspaceIcon className="size-6 currentColor" />
                    </button>
                </div>
            </ToolContainer>
            <ToolArticleContainer>
                <h3>What Are Hidden Characters in Text?</h3>
                <p>Hidden characters are characters in a string that may not be visible to the naked eye but can affect text formatting, data processing, and overall readability. These characters include whitespace, non-printable characters, zero-width spaces, and other symbols that may cause unexpected results if left unnoticed.</p>

                <h3>Understanding Hidden Characters</h3>
                <p>Hidden characters can fall into different categories, such as:</p>
                <ul className="hidden xsm:block">
                    <li><strong>Whitespace</strong>: Spaces, tabs, and line breaks that add formatting but aren’t visible.</li>
                    <li><strong>Control Characters</strong>: ASCII control characters like line feeds or carriage returns, often invisible but impactful.</li>
                    <li><strong>Zero-width Characters</strong>: Zero-width spaces or non-breaking spaces that may disrupt formatting.</li>
                    <li><strong>Special Symbols</strong>: Characters that look like spaces or regular letters but differ in Unicode values.</li>
                </ul>
                <ul className="block xsm:hidden">
                    <li><strong>Whitespace</strong>: Spaces, tabs, and line breaks that add formatting but aren’t visible.</li>
                    <li><strong>Control Characters</strong>: ASCII control characters like line feeds or carriage returns, often invisible but impactful.</li>
                    <li><strong>Zero-width Characters</strong>: Zero-width spaces or non-breaking spaces that may disrupt formatting.</li>
                    <li><strong>Special Symbols</strong>: Characters that look like spaces or regular letters but differ in Unicode values.</li>
                </ul>

                <h3>Example Hidden Characters</h3>
                <p>For example, a text string might contain hidden characters that are hard to spot:</p>
                <pre><code>This is a text&nbsp;&nbsp;&nbsp;with extra spaces.</code></pre>
                <p>With a hidden character viewer, you can easily see these invisible elements to manage them effectively.</p>

                <h3>More Example Usages</h3>
                <ul>
                    <li><strong>Find and Replace Spaces:</strong> Locate extra spaces or tabs and replace them with standard spaces.</li>
                    <li><strong>Remove Non-breaking Spaces:</strong> Convert non-breaking spaces to regular spaces for better formatting.</li>
                    <li><strong>Highlight Zero-width Characters:</strong> Detect zero-width characters that may interfere with processing.</li>
                    <li><strong>Inspect Control Characters:</strong> View non-printable ASCII characters like line feeds or carriage returns.</li>
                </ul>

                <h3>Benefits of Using a Hidden Characters Tool</h3>
                <p>This tool helps you uncover and manage hidden characters in your text, which is especially useful for:</p>
                <ul>
                    <li>Improving data formatting and preventing processing errors.</li>
                    <li>Detecting invisible characters that may disrupt layout or parsing.</li>
                    <li>Cleaning up text files, code, and input data for better consistency.</li>
                </ul>

                <h3>How to Use the Hidden Characters Tool</h3>
                <ol>
                    <li><strong>Enter Your Text:</strong> Paste or type the text you want to inspect into the tool.</li>
                    <li><strong>View Hidden Characters:</strong> The tool will highlight different types of hidden characters within the text.</li>
                    <li><strong>Adjust and Clean:</strong> Use options to replace, remove, or highlight specific hidden characters as needed.</li>
                </ol>

                <h3>Try Our Hidden Characters Tool</h3>
                <p>Ready to clean up your text? Use our Hidden Characters Tool to reveal and manage hidden elements with ease.</p>
            </ToolArticleContainer>
        </ToolPage >
    )
}