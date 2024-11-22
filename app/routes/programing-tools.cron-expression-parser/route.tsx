import { ClipboardIcon } from "@heroicons/react/24/outline";
import { LinksFunction, MetaFunction } from "@remix-run/cloudflare";
import clsx from "clsx";
import parser from 'cron-parser';
import cronstrue from 'cronstrue';
import { useEffect, useState } from "react";
import ToolArticleContainer from "~/components/ToolArticleContainer";
import ToolContainer from "~/components/ToolContainer";
import ToolPage from "~/components/ToolPage";
import useToolInfo from "~/hooks/useToolInfo";
import { CommonLinksGenerator, CommonMetaGenerator } from "~/utils/CommonCodeGenerators";
import { event } from "~/utils/gtags.client";

export const meta: MetaFunction = ({ location }) => {
    return [
        ...CommonMetaGenerator({
            title: "UtilStation - Cron Parser",
            description: "Easily interpret and test cron schedules with UtilStation.",
            extraKeywords: ["Cron parser", "Cron expression", "Cron schedule", "Cron job", "Cron syntax", "Unix cron", "Cron pattern", "Linux cron", "Cron string"],
            location,
        }),
    ];
};

export const links: LinksFunction = () => {
    return [
        ...CommonLinksGenerator()
    ];
}

export default function CronParser() {
    const toolInfo = useToolInfo();

    //states
    const [cronExpression, setCronExpression] = useState([
        "*", "*", "*", "*", "*"
    ]);
    const [cronResult, setCronResult] = useState<string>("");
    const [erroredFieldIdx, setErroredFieldIdx] = useState<number | null>(null);
    const [debouncedValue, setDebouncedValue] = useState(["*", "*", "*", "*", "*"]);
    const [isCopied, setIsCopied] = useState(false);
    const [isError, setIsError] = useState(false);
    //

    //utils
    const colorsOfTextFields = [
        "border-orange-600",
        "border-green-600",
        "border-blue-600",
        "border-purple-600",
        "border-red-600",
    ];
    //

    //Callbacks
    const onCopyBtnClick = () => {
        navigator.clipboard.writeText(cronExpression.join(" "));
        setIsCopied(true);
        setTimeout(() => {
            setIsCopied(false);
        }, 1000);
    }

    const onPasteInput = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('Text');
        const newCronExpression = pastedData.trim().split(" ");
        if (newCronExpression.length > 5) {
            return;
        }
        setCronExpression(newCronExpression);
    }

    const onInputBoxesChange = (idx: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setCronExpression((prev) => {
            const newCronExpression = [...prev];
            newCronExpression[idx] = e.target.value;
            return newCronExpression;
        })
    }

    const onMobileInputChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newCronExpression = e.target.value.split(" ");
        if (newCronExpression.length > 5) {
            return;
        }
        setCronExpression(newCronExpression);
    };
    //

    //hooks
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(cronExpression);
        }, 500); // Delay of 500ms

        // Cleanup function to clear the timeout if inputValue changes before delay ends
        return () => {
            clearTimeout(handler);
        };
    }, [cronExpression]);

    useEffect(() => {
        try {
            parser.parseExpression(debouncedValue.join(" "));
            const humanReadable = cronstrue.toString(debouncedValue.join(" "), { verbose: true });
            setCronResult(humanReadable);
            setErroredFieldIdx(null);
            setIsError(false);
            event({
                action: "expressionParsed",
                category: "toolUse",
                label: "CronExpressionParser",
                value: "1",
            })
        } catch (e: unknown) {
            if (e instanceof Error) {
                setCronResult(e.message);
                const idxOfErr = debouncedValue.findIndex(expression => e.message.split(" ").includes(expression));
                if (idxOfErr != -1) {
                    setErroredFieldIdx(idxOfErr);
                }
            } else {
                setCronResult("Wrong expression");
            }
            setIsError(true);
        }
    }, [debouncedValue]);
    //

    return (
        <ToolPage toolProps={toolInfo}>
            <ToolContainer>
                <h2 className="text-2xl font-bold text-center">Cron Expression</h2>
                <br />
                <div className="flex-row mx-auto items-center justify-center hidden xsm:flex">
                    {[...Array(5)].map((_, index) => (
                        <div key={index} className="flex flex-row items-center">
                            <input
                                className={clsx('input basis-1/5 w-[75px] text-center', {
                                    'input-error': erroredFieldIdx === index,
                                    [`${colorsOfTextFields[index]}`]: true
                                })}
                                key={index}
                                type="text"
                                value={cronExpression[index]}
                                onPaste={onPasteInput}
                                onChange={onInputBoxesChange(index)}
                            />
                            {
                                index < 4 && <span className="text-xl mx-2">-</span>
                            }
                        </div>
                    ))}
                    <div className="flex flex-row items-center">
                        <div className="tooltip tooltip-right" data-tip={isError ? undefined : isCopied ? "Copied expression" : "Copy expression"}>
                            <button disabled={isError} aria-label="Copy Expression" className={clsx("btn btn-primary ml-3 w-[75px]", {
                                "btn-success": isCopied,
                                "text-white": isCopied
                            })} onClick={onCopyBtnClick}>
                                <ClipboardIcon className="size-6 currentColor" />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="flex flex-row mx-auto items-center justify-center xsm:hidden">
                    <input
                        className='input text-center input-bordered w-full'
                        type="text"
                        value={cronExpression.join(" ")}
                        onChange={onMobileInputChanged}
                    />
                </div>
                <br />
                <p className="text-center">{cronResult}</p>
                <div className="flex mx-auto items-center justify-center mt-3 xsm:hidden">
                    <button disabled={isError} aria-label="Copy Expression" className={clsx("btn btn-primary ml-3 w-[120px]", {
                        "btn-success": isCopied,
                        "text-white": isCopied
                    })} onClick={onCopyBtnClick}>
                        {isCopied ? "Copied" : "Copy"}
                        <ClipboardIcon className="size-6 currentColor" />
                    </button>
                </div>
            </ToolContainer>
            <ToolArticleContainer>
                <h3>What is Cron?</h3>
                <p>Cron is a time-based job scheduler commonly used in Unix-like operating systems. It allows you to schedule scripts or commands to run automatically at specified intervals. You can learn more about Cron’s history and usage on <a href="https://en.wikipedia.org/wiki/Cron" target="_blank" rel="noreferrer">Wikipedia</a>.</p>

                <h3>Understanding Cron Expressions</h3>
                <p>A cron expression is a string that represents a schedule. It typically has five fields, which represent:</p>
                <ul className="hidden xsm:block">
                    <li className="flex justify-start items-center"> <div className="mr-2 w-5 h-5 rounded bg-orange-600" /> <strong>Minute</strong>: The minute the job should run (0 - 59).</li>
                    <li className="flex justify-start items-center"> <div className="mr-2 w-5 h-5 rounded bg-green-600" /> <strong>Hour</strong>: The hour the job should run (0 - 23).</li>
                    <li className="flex justify-start items-center"> <div className="mr-2 w-5 h-5 rounded bg-blue-600" /> <strong>Day of Month</strong>: The day of the month to run the job (1 - 31).</li>
                    <li className="flex justify-start items-center"> <div className="mr-2 w-5 h-5 rounded bg-purple-600" /> <strong>Month</strong>: The month to run the job (1 - 12).</li>
                    <li className="flex justify-start items-center"> <div className="mr-2 w-5 h-5 rounded bg-red-600" /><strong>Day of Week</strong>: The day of the week to run the job (0 - 6, where 0 is Sunday).</li>
                </ul>
                <ul className="block xsm:hidden">
                    <li><strong>Minute</strong>: The minute the job should run (0 - 59).</li>
                    <li><strong>Hour</strong>: The hour the job should run (0 - 23).</li>
                    <li><strong>Day of Month</strong>: The day of the month to run the job (1 - 31).</li>
                    <li><strong>Month</strong>: The month to run the job (1 - 12).</li>
                    <li><strong>Day of Week</strong>: The day of the week to run the job (0 - 6, where 0 is Sunday).</li>
                </ul>

                <h3>Example Cron Expression</h3>
                <p>For example, the following cron expression:</p>
                <pre><code>0 12 * * MON</code></pre>
                <p>will run every Monday at 12:00 PM.</p>

                <h3>More Example Usages</h3>
                <ul>
                    <li><strong>Run a job every minute:</strong> <code>* * * * *</code> (This runs the job every minute of every hour, every day.)</li>
                    <li><strong>Run a job every day at 3 AM:</strong> <code>0 3 * * *</code> (This runs the job at 3:00 AM every day.)</li>
                    <li><strong>Run a job every Friday at 5 PM:</strong> <code>0 17 * * FRI</code> (This runs the job at 5:00 PM every Friday.)</li>
                    <li><strong>Run a job on the 1st of every month at midnight:</strong> <code>0 0 1 * *</code> (This runs the job at midnight on the first day of every month.)</li>
                    <li><strong>Run a job every hour at 15 minutes past the hour:</strong> <code>15 * * * *</code> (This runs the job at 15 minutes past every hour.)</li>
                </ul>

                <h3>Benefits of Using a Cron Parser Tool</h3>
                <p>Our Cron Parser Tool helps you easily interpret and verify cron expressions. It’s useful for:</p>
                <ul>
                    <li>Ensuring accuracy before applying a cron schedule.</li>
                    <li>Quickly testing cron expressions and adjusting them to fit your needs.</li>
                    <li>Learning cron syntax without memorizing complex rules.</li>
                </ul>

                <h3>How to Use the Cron Parser Tool</h3>
                <ol>
                    <li><strong>Enter Your Expression:</strong> Input your cron expression in the tool.</li>
                    <li><strong>View Parsed Schedule:</strong> Our tool will provide a plain English interpretation of your schedule.</li>
                    <li><strong>Test and Adjust:</strong> Experiment with different schedules to get exactly what you need.</li>
                </ol>

                <h3>Try Our Cron Parser Tool</h3>
                <p>Ready to simplify your cron schedules? Use our Cron Parser Tool to test and verify your cron expressions with ease.</p>
            </ToolArticleContainer>
        </ToolPage>
    )
}