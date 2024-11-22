import { ArrowPathRoundedSquareIcon, ClipboardIcon } from "@heroicons/react/24/outline";
import { ActionFunction, json, LinksFunction, MetaFunction, unstable_createMemoryUploadHandler, unstable_parseMultipartFormData } from "@remix-run/cloudflare";
import clsx from "clsx";
import { Buffer } from 'node:buffer';
import { useEffect, useRef, useState } from "react";
import ToolArticleContainer from "~/components/ToolArticleContainer";
import ToolContainer from "~/components/ToolContainer";
import ToolPage from "~/components/ToolPage";
import useToolInfo from "~/hooks/useToolInfo";
import { CommonLinksGenerator, CommonMetaGenerator } from "~/utils/CommonCodeGenerators";
import { event } from "~/utils/gtags.client";

export const meta: MetaFunction = ({ location }) => {
    return [
        ...CommonMetaGenerator({
            title: "UtilStation - Base64 Converter",
            description: "Encode and decode data in Base64 format at UtilStation.",
            extraKeywords: ["Base64", "Base64 converter", "Base64 encoder", "Base64 decoder"],
            location
        }),
    ];
};

export const links: LinksFunction = () => {
    return [
        ...CommonLinksGenerator()
    ];
}

export interface ToolOptions {
    mode: 'encode' | 'decode';
    inputType: 'text' | 'file';
    livePreview: boolean;
}

export const action: ActionFunction = async ({ request }) => {
    let formData;
    try {
        const uploadHandler = unstable_createMemoryUploadHandler({
            maxPartSize: 1024 * 1024 * 5, // 5MB
        });
        formData = await unstable_parseMultipartFormData(request, uploadHandler);
    } catch (error) {
        if (error instanceof SyntaxError) {
            return json({ isError: true, message: "Invalid form data" }, { status: 400 });
        }

        if (error instanceof Error && error.message.includes("exceeded upload size of")) {
            return json({ isError: true, message: "File size exceeded the limit" }, { status: 400 });
        }

        return json({ isError: true, message: "An error occurred" }, { status: 400 });
    }

    const file = formData!.get("file") as (File | null);
    const action = formData!.get("action");

    if (!action || action !== "encode" && action !== "decode") {
        return json({ isError: true, message: "Invalid action" }, { status: 400 });
    }

    if (!file) {
        return json({ isError: true, message: "No input" }, { status: 400 });
    }

    try {
        if (action === "encode") {
            //@ts-expect-error - This is node tool
            const bytes = await file.bytes();
            const buffer = Buffer.from(bytes).toString("base64");

            return new Response(buffer, {
                headers: {
                    "Content-Type": "text/plain",
                    "Content-Disposition": `attachment; filename="${file.name}.base64.txt"`,
                },
            });
        } else if (action === "decode") {
            //@ts-expect-error - This is node tool
            const bytes = await file.bytes();
            const str = Buffer.from(bytes).toString("utf-8");
            const buffer = Buffer.from(str, "base64");
            return new Response(buffer, {
                headers: {
                    "Content-Type": "text/plain",
                    "Content-Disposition": `attachment; filename="${file.name}"`,
                },
            });
        } else {
            return json({ isError: true, message: "Invalid action" }, { status: 400 });
        }
    } catch (error) {
        console.error('error', error);
        return json({ isError: true, message: "Invalid Base64 file" }, { status: 400 });
    }
};

export default function Base64EncoderDecoder() {
    //hooks
    const toolInfo = useToolInfo();
    //

    //refs
    const inputFileRef = useRef<HTMLInputElement>(null);
    //

    //states
    const [loading, setLoading] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [toolOptions, setToolOptions] = useState<ToolOptions>({
        mode: 'encode',
        inputType: 'text',
        livePreview: false,
    });

    const [inputText, setInputText] = useState('');
    const [bouncedInputText, setBouncedInputText] = useState(inputText);
    const [outputText, setOutputText] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    //

    //utils
    function strToBase64(str: string) {
        function bytesToBase64(bytes: Uint8Array) {
            const binString = Array.from(bytes, (byte) =>
                String.fromCodePoint(byte),
            ).join("");
            return btoa(binString);
        }

        const encoder = new TextEncoder();
        const bytes = encoder.encode(str);
        return bytesToBase64(bytes);
    }

    function base64ToStr(base64: string) {
        function base64ToBytes(base64: string) {
            const binString = atob(base64);
            //@ts-expect-error - Uint8Array.from is recognized as node utility function, not a browser function
            return Uint8Array.from(binString, (m) => m.codePointAt(0));
        }

        const encoder = new TextDecoder();
        return encoder.decode(base64ToBytes(base64));
    }
    //

    //Callbacks
    function onInputChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        setBouncedInputText(e.target.value);
    }

    function onToolPropertyChanged(name: keyof typeof toolOptions, value: typeof toolOptions[keyof typeof toolOptions]) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return (e: React.ChangeEvent<HTMLInputElement>) => {
            setToolOptions({
                ...toolOptions,
                [name]: value
            });
        }
    }

    async function handleConvertButtonClick() {
        setErrorMessage('');
        if (toolOptions.inputType === 'text') {
            let resultStr = "";
            try {
                if (toolOptions.mode === 'encode') {
                    resultStr = strToBase64(bouncedInputText);
                    event({
                        action: "base64Encode",
                        category: "toolUse",
                        label: "Base64EncoderDecoder",
                        value: "1",
                    })
                } else {
                    resultStr = base64ToStr(bouncedInputText);
                    event({
                        action: "base64Decode",
                        category: "toolUse",
                        label: "Base64EncoderDecoder",
                        value: "1",
                    })
                }
            } catch (error) {
                resultStr = "Invalid input";
                return;
            }
            setOutputText(resultStr);
        } else {
            const formData = new FormData();
            formData.append("action", toolOptions.mode);
            const file = inputFileRef.current?.files?.[0];
            if (!file) {
                return;
            }
            formData.append("file", file!, file!.name);
            setLoading(true);
            const response = await fetch("/programing-tools/base64-encoder-decoder?_data=routes/programing-tools.base64-encoder-decoder", {
                method: "POST",
                body: formData,
            });

            setLoading(false);
            if (!response.ok) {
                const data: {
                    isError: boolean;
                    message: string;
                } = await response.json();
                setOutputText(data?.message || "An error occurred");
                setErrorMessage(data?.message || "An error occurred");
                return;
            }

            const data = await response.bytes();

            const blob = new Blob([data], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const filename = file.name.split('.').slice(0, -1).join('.');
            const a = document.createElement('a');
            event({
                action: `base64File${toolOptions.mode === 'encode' ? 'Encode' : 'Decode'}`,
                category: "toolUse",
                label: "Base64EncoderDecoder",
                value: "1",
            })
            a.href = url;
            a.download = `${filename}.${toolOptions.mode === 'encode' ? 'base64.txt' : file.name.split('.').pop()}`;
            a.click();
        }
    }

    async function handleCopyButtonClick() {
        try {
            await navigator.clipboard.writeText(outputText);
            setIsCopied(true);
            setTimeout(() => {
                setIsCopied(false);
            }, 1000);
        } catch (error) {
            console.error('error', error);
        }
    }
    //

    //useEffects
    useEffect(() => {
        const timeout = setTimeout(() => {
            setInputText(bouncedInputText);
            if (toolOptions.livePreview) {
                let resultStr = "";
                try {
                    if (toolOptions.mode === 'encode') {
                        resultStr = strToBase64(bouncedInputText);
                    } else {
                        resultStr = base64ToStr(bouncedInputText);
                    }
                } catch (error) {
                    resultStr = "Invalid input";
                    return;
                }
                setOutputText(resultStr);
            }
        }, 500);

        return () => {
            clearTimeout(timeout);
        }
    }, [bouncedInputText]);
    //

    return (
        <ToolPage toolProps={toolInfo}>
            <ToolContainer>
                <section className="container mx-auto max-w-2xl px-2 pt-6">
                    <h2 className="text-2xl font-bold text-center">Base64  {toolOptions.mode == "encode" ? "Encode" : "Decode"}</h2>
                    <br />
                    <div className={clsx("h-[200px]", {
                        hidden: toolOptions.inputType !== 'text'
                    })}>
                        <textarea
                            className="input input-bordered w-full h-[200px] resize-none"
                            value={bouncedInputText}
                            onChange={onInputChange}
                            placeholder="Enter text to encode/decode..."
                            autoComplete="off"
                        />
                    </div>
                    <div className={clsx("input input-bordered input-current h-[200px] rounded-lg flex flex-col justify-center", {
                        hidden: toolOptions.inputType !== 'file'
                    })}>
                        <input
                            type="file"
                            className="file-input file-input-bordered max-w-xs mx-auto"
                            ref={inputFileRef}
                            name="file"
                            disabled={loading}
                            autoComplete="off"
                        />
                    </div>
                    <div className="tooltip mt-10 " data-tip={toolOptions.livePreview && toolOptions.inputType === 'text' ? "Can't live preview for file input" : undefined}>
                        <div className="flex flex-row items-center w-full gap-3">
                            <label className="label w-[120px]" htmlFor="inputType">Input {toolOptions.mode == "encode" ? "Encode" : "Decode"}</label>
                            <input
                                className={clsx("toggle toggle-primary border-primary", {
                                    "bg-primary hover:bg-primary": toolOptions.inputType === 'text' && !toolOptions.livePreview,
                                })}
                                id="inputType"
                                type="checkbox"
                                checked={toolOptions.inputType === 'file'}
                                onChange={onToolPropertyChanged('inputType', toolOptions.inputType === 'text' ? 'file' : 'text')}
                                disabled={toolOptions.livePreview && toolOptions.inputType === 'text'}
                                autoComplete="off"
                            />
                            <label className="label" htmlFor="inputType">File {toolOptions.mode == "encode" ? "Encode" : "Decode"}</label>
                        </div>
                    </div>
                    <div className="flex flex-row items-center w-full gap-3">
                        <label className="label w-[120px]" htmlFor="mode">Decode</label>
                        <input
                            className="toggle toggle-primary border-primary bg-primary hover:bg-primary"
                            id="mode"
                            type="checkbox"
                            checked={toolOptions.mode === 'encode'}
                            onChange={onToolPropertyChanged('mode', toolOptions.mode === 'encode' ? 'decode' : 'encode')}
                            name="action"
                            value={toolOptions.mode === 'encode' ? 'encode' : 'decode'}
                            autoComplete="off"
                        />
                        <label className="label" htmlFor="mode">Encode</label>
                    </div>
                    <div className="tooltip" data-tip={toolOptions.inputType === 'file' ? "Live preview is disabled for file input" : undefined}>
                        <div className="flex flex-row items-center w-full gap-3">
                            <label className="label w-[120px]" htmlFor="livePreview">Live Preview</label>
                            <input
                                className="toggle toggle-primary"
                                id="livePreview"
                                type="checkbox"
                                checked={toolOptions.livePreview}
                                onChange={onToolPropertyChanged('livePreview', !toolOptions.livePreview)}
                                disabled={toolOptions.inputType === 'file'}
                                autoComplete="off"
                            />
                        </div>
                    </div>
                    <div className={clsx("text-error text-center min-h-[30px] my-2", { 'opacity-0': errorMessage == "" })}>
                        {errorMessage}
                    </div>
                    <div className="flex flex-row justify-center gap-2">
                        <div className="flex justify-center">
                            <button
                                aria-label="Convert Selected Case Button"
                                className="btn btn-primary"
                                onClick={handleConvertButtonClick}
                                type="submit"
                                disabled={loading}
                            >
                                Convert
                                {
                                    !loading &&
                                    <ArrowPathRoundedSquareIcon className="size-6 currentColor" />
                                }
                                {
                                    loading &&
                                    <span className="loading loading-spinner loading-xs"></span>
                                }

                            </button>
                        </div>
                        <div className={clsx("flex justify-center", {
                            hidden: toolOptions.inputType === 'file'
                        })}>
                            <button
                                aria-label="Convert Selected Case Button"
                                className={clsx("btn btn-secondary w-[220px]", {
                                    "btn-success": isCopied,
                                    "text-white": isCopied
                                })}
                                onClick={handleCopyButtonClick}
                                disabled={loading}
                            >
                                {isCopied ? "Copied" : "Copy"} to Clipboard
                                <ClipboardIcon className="size-6 currentColor" />
                            </button>
                        </div>
                    </div>
                    <br />
                    <div className={clsx("h-[200px]", {
                        hidden: toolOptions.inputType !== 'text'
                    })}>
                        <textarea
                            className="input input-bordered w-full h-[200px] resize-none"
                            value={outputText}
                            readOnly
                            placeholder="Result..."
                            autoComplete="off"
                        />
                    </div>
                </section>
            </ToolContainer>
            <ToolArticleContainer>
                <h3>What is a Base64 Encoder/Decoder?</h3>
                <p>A Base64 Encoder/Decoder is a tool that allows you to convert binary data, such as images or files, into a text format. Base64 encoding is commonly used to embed images in HTML, encode data for web APIs, or securely transfer information that might otherwise become corrupted during transmission. You can find more about Base64 on <a href="https://en.wikipedia.org/wiki/Base64" target="_blank" rel="noreferrer">Wikipedia</a>.</p>

                <h3>Why Use a Base64 Encoder/Decoder?</h3>
                <p>Using a Base64 encoder/decoder can:</p>
                <ul>
                    <li><strong>Ensure Data Integrity</strong>: Encodes binary data in a plain text format, preserving its structure during transmission.</li>
                    <li><strong>Embed Media Directly in HTML</strong>: Convert images and other media into text, making it easy to include them in HTML without needing separate files.</li>
                    <li><strong>Enhance Compatibility</strong>: Simplifies the transfer of binary data across systems that handle only text formats, such as JSON or XML.</li>
                </ul>

                <h3>Features of Our Base64 Encoder/Decoder Tool</h3>
                <p>Our Base64 Encoder/Decoder tool provides flexible options for encoding and decoding text and files:</p>
                <ul>
                    <li><strong>Text or File Input</strong>: Easily encode or decode both plain text and files. Upload a file or paste text directly into the input field.</li>
                    <li><strong>Real-Time Conversion</strong>: Instantly see encoded or decoded results as you type, streamlining the encoding or decoding process.</li>
                    <li><strong>One-Click Copy</strong>: Quickly copy the Base64 result to your clipboard for immediate use.</li>
                    <li><strong>Support for Multiple File Types</strong>: Upload images, documents, or other binary files to convert them to Base64 or back to their original format.</li>
                </ul>

                <h3>How the Base64 Encoding Process Works</h3>
                <p>Base64 encoding works by taking binary data and converting it into ASCII characters. Here&quot;s a brief overview of the process:</p>
                <ul>
                    <li><strong>Binary Conversion</strong>: The binary data is split into groups of six bits.</li>
                    <li><strong>Mapping to ASCII Characters</strong>: Each 6-bit group is mapped to a character in the Base64 index table, which contains 64 characters (A–Z, a–z, 0–9, +, and /).</li>
                    <li><strong>Padding</strong>: If the data doesn’t divide evenly into six bits, padding (using the &quot;=&quot; character) is added to make the output a multiple of four characters, ensuring compatibility across systems.</li>
                </ul>

                <h3>How to Use the Base64 Encoder/Decoder Tool</h3>
                <ol>
                    <li><strong>Select Your Input Type:</strong> Choose whether to upload a file or input text directly in the tool.</li>
                    <li><strong>Choose Real-Time Conversion:</strong> Toggle real-time encoding/decoding for instant feedback as you type.</li>
                    <li><strong>View or Copy the Result:</strong> After encoding or decoding, use the copy feature to save your result for easy pasting.</li>
                </ol>

                <h3>Try Our Base64 Encoder/Decoder Tool</h3>
                <p>Ready to streamline your data encoding needs? Use our Base64 Encoder/Decoder Tool to convert text or files into Base64 with ease, or decode Base64 back to its original format. Try it out today!</p>
            </ToolArticleContainer>
        </ToolPage >
    )
}