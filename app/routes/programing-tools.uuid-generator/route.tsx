import { ArrowPathIcon, ClipboardIcon } from "@heroicons/react/24/outline";
import { ActionFunction, json, LinksFunction, MetaFunction } from "@remix-run/cloudflare";
import { useFetcher } from "@remix-run/react";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { MAX, NIL, v1, v3, v4, v5, validate } from "uuid";
import ToolArticleContainer from "~/components/ToolArticleContainer";
import ToolContainer from "~/components/ToolContainer";
import ToolPage from "~/components/ToolPage";
import useToolInfo from "~/hooks/useToolInfo";
import { CommonLinksGenerator, CommonMetaGenerator } from "~/utils/CommonCodeGenerators";
import { CommonActionReturn, CommonActionReturnType } from "~/utils/CommonTypes";
import { event } from "~/utils/gtags.client";

export const meta: MetaFunction = ({ location }) => {
    return [
        ...CommonMetaGenerator({
            title: "UtilStation - UUID Generator",
            description: "Generate unique UUIDs with our UUID Generator tool. Ideal for creating unique identifiers for databases, APIs, and more with UtilStation.",
            extraKeywords: ["uuid generator", "uuid creator", "uuid maker", "uuid tool", "guid generator", "guid creator", "guid maker", "guid tool"],
            location
        }),
    ];
};

export const links: LinksFunction = () => {
    return [
        ...CommonLinksGenerator()
    ];
}

const uuidVersions = {
    v1: {
        name: "v1",
        description: "Time-based UUID",
        requiresExtraOptions: false,
    },
    v3: {
        name: "v3",
        description: "Name-based UUID",
        requiresExtraOptions: true,
    },
    v4: {
        name: "v4",
        description: "Random UUID (Most Common)",
        requiresExtraOptions: false,
    },
    v5: {
        name: "v5",
        description: "Name-based UUID",
        requiresExtraOptions: true,
    },
    NIL: {
        name: "NIL",
        description: "Nil UUID",
        requiresExtraOptions: false,
    },
    MAX: {
        name: "MAX",
        description: "Max UUID",
        requiresExtraOptions: false,
    }
}

const NamespaceTypes = {
    "DNS": v3.DNS,
    "URL": v3.URL,
    "Custom": NIL
}

type ActionReturn = CommonActionReturn<string>;

export const action: ActionFunction = async ({ request }): ActionReturn => {
    const formData = await request.formData();
    const version = formData.get("version");

    let generatedUUID;
    switch (version) {
        case "NIL":
            generatedUUID = NIL;
            break;
        case "MAX":
            generatedUUID = MAX;
            break;
        case "v1":
            generatedUUID = v1();
            break;
        case "v4":
            generatedUUID = v4();
            break;
        case "v3":
        case "v5": {
            const value = formData.get("value");
            if (!value) {
                return json({ isError: true, message: `Value is required for UUID ${version}` }, { status: 400 });
            }

            const namespace = formData.get("namespace");
            if (!namespace) {
                return json({
                    isError: true, message: `Namespace is required for UUID ${version}`
                },
                    { status: 400 }
                );
            }

            if (!validate(namespace)) {
                return json({
                    isError: true, message: `Invalid Namespace for UUID ${version}`
                },
                    { status: 400 }
                );
            }
            generatedUUID = (version == "v3" ? v3 : v5)(value as string, namespace as string);
            break;
        }
        default:
            return json({ isError: true, message: "Invalid or Unsupported UUID version" }, { status: 400 });
    }

    return json({
        isError: false,
        message: "UUID Generated Successfully",
        data: generatedUUID
    });
};

export default function UUIDGenerator() {
    const toolInfo = useToolInfo();
    const fetcher = useFetcher<CommonActionReturnType<string>>()

    //states
    const [selectedUUIDVersion, setSelectedUUIDVersion] = useState("v4");
    const [generatedUUID, setGeneratedUUID] = useState<string | null>(null);
    const [v5Namespace, setV5Namespace] = useState(NamespaceTypes.DNS);
    const [v5Value, setV5Value] = useState("");
    const [isCopied, setIsCopied] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [nameSpaceType, setNameSpaceType] = useState<"DNS" | "URL" | "Custom">("DNS");
    const [errorField, setErrorField] = useState<-1 | 0 | 1>(-1);
    const [isSuccess, setIsSuccess] = useState(false);
    //

    //utils
    //

    // Callbacks
    const onVersionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedUUIDVersion(e.target.value);
    };

    const generateUUID = () => {
        if (selectedUUIDVersion === "v3" || selectedUUIDVersion === "v5") {
            if (!v5Value) {
                setErrorField(0);
                return;
            }
            if (!v5Namespace) {
                setErrorField(1);
                return;
            }
        }
        setErrorField(-1);
        const formData = new FormData();
        formData.append("version", selectedUUIDVersion);
        if (selectedUUIDVersion === "v3" || selectedUUIDVersion === "v5") {
            formData.append("value", v5Value);
            formData.append("namespace", v5Namespace);
        }
        fetcher.submit(formData, { method: "post" });
    };

    const onCopyBtnClick = () => {
        navigator.clipboard.writeText(generatedUUID || "");
        setIsCopied(true);
        setTimeout(() => {
            setIsCopied(false);
        }, 2000);
    }

    const onValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setV5Value(e.target.value);
    };

    const onNamespaceTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setNameSpaceType(e.target.value as "DNS" | "URL" | "Custom");
        setV5Namespace(NamespaceTypes[e.target.value as "DNS" | "URL" | "Custom"]);
    };

    const onNamespaceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setV5Namespace(e.target.value);
    };
    //

    //useEffects
    useEffect(() => {
        if (fetcher.state === "idle") {
            setIsLoading(false);
        } else if (fetcher.state === "loading" || fetcher.state === "submitting") {
            setIsLoading(true);
        }

        if (fetcher.state == "idle" && fetcher.data?.data && fetcher.data.data !== generatedUUID) {
            setGeneratedUUID(fetcher.data.data);
            setIsSuccess(true);
            setTimeout(() => {
                setIsSuccess(false);
            }, 2000);
            event({
                action: "uuidGenerated",
                category: "toolUse",
                label: "UUIDGenerator",
                value: selectedUUIDVersion
            });
        }
    }, [fetcher.state]);
    //

    return (
        <ToolPage toolProps={toolInfo}>
            <ToolContainer>
                <h2 className="text-2xl font-bold text-center">UUID Generator</h2>
                <br />
                <div className="max-w-lg mx-auto">
                    <div className="join w-full">
                        <input
                            className={clsx("input input-primary text-center input-bordered w-full join-item", {
                                "input-success": isCopied,
                            })}
                            type="text"
                            value={generatedUUID || ""}
                            placeholder="Generated UUID will appear here..."
                            readOnly
                            autoComplete="off"
                        />
                        <button aria-label="Copy Generated UUID Button" className={clsx("btn btn-primary join-item", {
                            "btn-success": isCopied,
                            "text-white": isCopied
                        })} onClick={onCopyBtnClick}>
                            <ClipboardIcon className="size-6 currentColor" />
                        </button>
                    </div>
                    <label className="form-control w-full" aria-label="UUID Generator">
                        <div className="label">
                            <span className="label-text">Pick UUID Version</span>
                        </div>
                        <select
                            className="select select-bordered border-primary"
                            value={selectedUUIDVersion}
                            onChange={onVersionChange}
                            autoComplete="off"
                        >
                            {Object.entries(uuidVersions).map(([version, details]) => (
                                <option key={version} value={version}>
                                    {version} - {details.description}
                                </option>
                            ))}
                        </select>
                    </label>
                    {
                        (selectedUUIDVersion === "v5" || selectedUUIDVersion === "v3") && (
                            <>
                                <br />
                                <hr />
                                <br />
                                <h3>Extra Options for UUID {selectedUUIDVersion}</h3>
                                <br />
                                <div className="form-control">
                                    <label className="label" htmlFor="value">
                                        <span className="label-text">Value</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="value"
                                        placeholder="Value"
                                        className={clsx("input input-bordered", {
                                            "input-error": v5Value?.trim() === ""
                                        })}
                                        value={v5Value}
                                        onChange={onValueChange}
                                    />
                                </div>
                                <label className="form-control w-full" aria-label="UUID Generator">
                                    <div className="label">
                                        <span className="label-text">Namespace Type</span>
                                    </div>
                                    <select
                                        className="select select-bordered border-primary"
                                        value={nameSpaceType}
                                        onChange={onNamespaceTypeChange}
                                        autoComplete="off"
                                    >
                                        {Object.keys(NamespaceTypes).map((key) => (
                                            <option key={key} value={key}>
                                                {key}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                                <div className={clsx("form-control", {
                                    hidden: nameSpaceType !== "Custom"
                                })}>
                                    <label className="label" htmlFor="namespace">
                                        <span className="label-text">Namespace</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="namespace"
                                        placeholder="Namespace"
                                        className={clsx("input input-bordered", {
                                            "input-error": v5Namespace?.trim() === ""
                                        })}
                                        value={v5Namespace}
                                        onChange={onNamespaceChange}
                                    />
                                </div>
                                <br />
                                <hr />
                            </>
                        )
                    }
                </div>
                <div className="flex flex-col mx-auto items-center w-full justify-center">
                    <div className={clsx("min-h-[30px] my-2", {
                        "text-error": (fetcher.data && fetcher.data.isError) || errorField === 0 || errorField === 1,
                        "text-success": isSuccess
                    })}>
                        {(fetcher.data && fetcher.data.isError) ? fetcher.data.message : errorField === 0 ? "Value is required" : errorField === 1 ? "Namespace is required" : ""}
                        {isSuccess && "UUID Generated Successfully"}
                    </div>
                    <button
                        className={clsx("btn btn-primary", {
                            "btn-success": isSuccess,
                            "text-white": isSuccess
                        })}
                        onClick={generateUUID}
                        disabled={isLoading || isSuccess}
                    >
                        <ArrowPathIcon className="size-6 currentColor" />
                        Generate UUID
                    </button>
                </div>
            </ToolContainer>
            <ToolArticleContainer>
                <h3>What is a UUID Generator?</h3>
                <p>A UUID (Universally Unique Identifier) generator is a tool that creates unique strings used to identify objects or entities in computer systems. UUIDs are commonly used in databases, APIs, and distributed systems to provide unique references that minimize the risk of duplication.</p>

                <p>Learn more about UUIDs and their applications in data management and software development <a href="https://en.wikipedia.org/wiki/Universally_unique_identifier" target="_blank" rel="noreferrer">here</a>.</p>

                <h3>Why Use a UUID Generator?</h3>
                <p>Using a UUID generator can:</p>
                <ul>
                    <li><strong>Ensure Uniqueness:</strong> UUIDs are designed to be unique, reducing the chance of duplicate identifiers across systems.</li>
                    <li><strong>Improve Data Integrity:</strong> Unique IDs prevent conflicts and errors when referencing or storing data, particularly in distributed or multi-user environments.</li>
                    <li><strong>Simplify Identification:</strong> UUIDs provide a standardized, easily generated way to identify resources without requiring a centralized sequence.</li>
                </ul>

                <h3>Features of Our UUID Generator Tool</h3>
                <p>Our UUID Generator Tool offers flexible options to create the type of UUID that suits your needs:</p>
                <ul>
                    <li><strong>Version Selection:</strong> Choose from UUID versions (such as v1, v3, v4, and v5) to match your use case, whether it&apos;s time-based, name-based, or randomly generated.</li>
                    <li><strong>Preview Generated UUID:</strong> See a preview of your generated UUID instantly, ensuring it meets the format requirements for your application.</li>
                    <li><strong>One-Click Copy:</strong> Easily copy your generated UUID to your clipboard for immediate use in your projects.</li>
                </ul>

                <h3>How to Use the UUID Generator Tool</h3>
                <ol>
                    <li><strong>Select UUID Version:</strong> Choose the UUID version that best fits your needs. For instance, v4 is popular for generating random UUIDs.</li>
                    <li><strong>Generate Your UUID:</strong> Click the &quot;Generate&quot; button to create a new UUID based on your selected version.</li>
                    <li><strong>Copy and Use:</strong> Use the copy function to quickly save your UUID for use in your project.</li>
                </ol>

                <h3>Benefits of Using UUIDs</h3>
                <p>Using UUIDs offers several advantages, especially in distributed systems. Benefits include:</p>
                <ul>
                    <li><strong>Reduced Risk of Collisions:</strong> UUIDs are statistically unlikely to repeat, even across different systems or environments.</li>
                    <li><strong>Enhanced Scalability:</strong> UUIDs work well in distributed systems where unique identification without central coordination is required.</li>
                    <li><strong>Efficient Data Tracking:</strong> UUIDs can be assigned to records, making it easier to track and manage data across applications.</li>
                </ul>

                <h3>Try Our UUID Generator Tool</h3>
                <p>Ready to streamline your development? Use our UUID Generator Tool to quickly create unique identifiers for your projects. Generate secure, unique UUIDs with ease!</p>
            </ToolArticleContainer>
        </ToolPage>
    )
}