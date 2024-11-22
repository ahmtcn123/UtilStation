import { ClipboardIcon } from "@heroicons/react/24/outline";
import { LinksFunction, MetaFunction } from "@remix-run/cloudflare";
import clsx from "clsx";
import { useEffect, useState } from "react";
import ToolArticleContainer from "~/components/ToolArticleContainer";
import ToolContainer from "~/components/ToolContainer";
import ToolPage from "~/components/ToolPage";
import useToolInfo from "~/hooks/useToolInfo";
import { CommonLinksGenerator, CommonMetaGenerator } from "~/utils/CommonCodeGenerators";


export const meta: MetaFunction = ({ location }) => {
    return [
        ...CommonMetaGenerator({
            title: "UtilStation - Password Generator",
            description: "Generate strong and secure passwords with UtilStation.",
            extraKeywords: ["password generator", "password creator", "password maker", "random password generator"],
            location
        }),
    ];
};

export const links: LinksFunction = () => {
    return [
        ...CommonLinksGenerator()
    ];
}

export default function PasswordGenerator() {
    const toolInfo = useToolInfo();

    //states
    const [length, setLength] = useState(40);
    const [includeNumbers, setIncludeNumbers] = useState(true);
    const [includeUppercase, setIncludeUppercase] = useState(false);
    const [includeLowercase, setIncludeLowercase] = useState(true);
    const [includeSpecialCharacters, setIncludeSpecialCharacters] = useState(false);
    const [password, setPassword] = useState("pass");
    const [isCopied, setIsCopied] = useState(false);
    //

    //utils
    const lastTrueItem = () => Number(includeNumbers) + Number(includeUppercase) + Number(includeLowercase) + Number(includeSpecialCharacters) === 1;
    //

    // Callbacks
    const onLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLength(parseInt(e.target.value));
    };

    const onCaseChange = (caseType: "numbers" | "uppercase" | "lowercase" | "specialCharacters") => {
        return () => {
            switch (caseType) {
                case "numbers":
                    if (lastTrueItem())
                        setIncludeNumbers(true);
                    else
                        setIncludeNumbers(!includeNumbers);
                    break;
                case "uppercase":
                    if (lastTrueItem())
                        setIncludeUppercase(true);
                    else
                        setIncludeUppercase(!includeUppercase);
                    break;
                case "lowercase":
                    if (lastTrueItem())
                        setIncludeLowercase(true);
                    else
                        setIncludeLowercase(!includeLowercase);
                    break;
                case "specialCharacters":
                    if (lastTrueItem())
                        setIncludeSpecialCharacters(true);
                    else
                        setIncludeSpecialCharacters(!includeSpecialCharacters);
                    break;
            }
        };
    };

    const onCopyBtnClick = () => {
        navigator.clipboard.writeText(password);
        setIsCopied(true);
        setTimeout(() => {
            setIsCopied(false);
        }, 1000);
    }
    //

    //useEffects
    useEffect(() => {
        const charset = [
            "abcdefghijklmnopqrstuvwxyz",
            "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "0123456789",
            "!@#$%^&*()_+~`|}{[]:;?><,./-="
        ].filter((_, idx) => [includeLowercase, includeUppercase, includeNumbers, includeSpecialCharacters][idx]);

        let generatedPassword = "";
        for (let i = 0; i < length; i++) {
            const randomCharset = charset[Math.floor(Math.random() * charset.length)];
            generatedPassword += randomCharset[Math.floor(Math.random() * randomCharset.length)];
        }
        setPassword(generatedPassword);
    }, [
        length,
        includeNumbers,
        includeUppercase,
        includeLowercase,
        includeSpecialCharacters
    ]);
    //

    return (
        <ToolPage toolProps={toolInfo}>
            <ToolContainer>
                <h2 className="text-2xl font-bold text-center">Password Generator</h2>
                <br />
                <div className="flex flex-col mx-auto items-center justify-center max-w-xl">
                    <div className="join w-full">
                        <input
                            className={clsx('input text-center input-primary input-bordered w-full join-item', {
                                "input-success": isCopied
                            })}
                            type="text"
                            value={password}
                            readOnly
                        />
                        <button aria-label="Copy Generated Password Button" className={clsx("btn btn-primary join-item", {
                            "btn-success": isCopied,
                            "text-white": isCopied
                        })} onClick={onCopyBtnClick}>
                            <ClipboardIcon className="size-6 currentColor" />
                        </button>
                    </div>
                    <div className="flex flex-row items-center justify-between mt-10 w-full">
                        <label className="label w-1/2" htmlFor="length" >Password Length: {length}</label>
                        <input
                            className="range range-primary label"
                            id="length"
                            type="range"
                            min="0"
                            max="100"
                            value={length}
                            onChange={onLengthChange}
                        />
                    </div>
                    <div className="flex flex-row items-center justify-between mt-10 w-full">
                        <label className="label" htmlFor="numbers">Include Numbers</label>
                        <input
                            className="toggle toggle-primary"
                            id="numbers"
                            type="checkbox"
                            checked={includeNumbers}
                            onChange={onCaseChange("numbers")}

                        />
                    </div>
                    <div className="flex flex-row items-center justify-between mt-2 w-full">
                        <label className="label" htmlFor="uppercase">Include Uppercase</label>
                        <input
                            className="toggle toggle-primary"
                            id="uppercase"
                            type="checkbox"
                            checked={includeUppercase}
                            onChange={onCaseChange("uppercase")}
                        />
                    </div>
                    <div className="flex flex-row items-center justify-between mt-2 w-full">
                        <label className="label" htmlFor="lowercase">Include Lowercase</label>
                        <input
                            className="toggle toggle-primary"
                            id="lowercase"
                            type="checkbox"
                            checked={includeLowercase}
                            onChange={onCaseChange("lowercase")}
                        />
                    </div>
                    <div className="flex flex-row items-center justify-between mt-2 w-full">
                        <label className="label" htmlFor="specialCharacters">Include Special Characters</label>
                        <input
                            className="toggle toggle-primary"
                            id="specialCharacters"
                            type="checkbox"
                            checked={includeSpecialCharacters}
                            onChange={onCaseChange("specialCharacters")}
                        />
                    </div>
                </div>
            </ToolContainer>
            <ToolArticleContainer>
                <h3>What is a Password Generator?</h3>
                <p>A password generator is a tool that creates strong, random passwords to enhance security. In an age where online accounts are ubiquitous, having a unique and complex password for each account is essential to protect sensitive information from unauthorized access.</p>

                <p>Also check out Cisa(Cyber Security Infrastructure Security Agency)&apos;s article on using strong passwords <a href="https://www.cisa.gov/secure-our-world/use-strong-passwords" target="_blank" rel="noreferrer">https://www.cisa.gov/secure-our-world/use-strong-passwords</a> here</p>

                <h3>Why Use a Password Generator?</h3>
                <p>Using a password generator can:</p>
                <ul>
                    <li><strong>Enhance Security</strong>: Randomly generated passwords are harder to guess or crack compared to easily memorable ones.</li>
                    <li><strong>Prevent Reuse</strong>: Generate unique passwords for each of your accounts, minimizing the risk of a single compromised password leading to multiple breaches.</li>
                    <li><strong>Simplify Management</strong>: Save time by generating and storing complex passwords without the need to remember them all.</li>
                </ul>

                <h3>Features of Our Password Generator Tool</h3>
                <p>Our Password Generator Tool offers a variety of features to customize your passwords:</p>
                <ul>
                    <li><strong>Character Inclusion</strong>: Choose whether to include numbers, uppercase letters, lowercase letters, and special characters in your password.</li>
                    <li><strong>Custom Length</strong>: Input a desired length for your password, allowing for maximum flexibility from short and simple to long and complex.</li>
                    <li><strong>Preview Generated Password</strong>: See a preview of your generated password instantly to ensure it meets your needs.</li>
                    <li><strong>One-Click Copy</strong>: Easily copy your generated password to your clipboard for immediate use.</li>
                </ul>

                <h3>How to Use the Password Generator Tool</h3>
                <ol>
                    <li><strong>Set Your Preferences:</strong> Choose the desired length of your password and select the character types to include.</li>
                    <li><strong>Generate Your Password:</strong> Click the &quot;Generate&quot; button to create a strong, random password based on your preferences.</li>
                    <li><strong>Copy and Use:</strong> Use the copy function to save your password for your accounts.</li>
                </ol>

                <h3>Benefits of Using Strong Passwords</h3>
                <p>Creating strong passwords is vital for protecting your online accounts. Benefits include:</p>
                <ul>
                    <li><strong>Reduced Risk of Hacking:</strong> Strong passwords make it significantly harder for attackers to gain unauthorized access.</li>
                    <li><strong>Improved Compliance:</strong> Many industries have regulations requiring the use of secure passwords, and a generator can help you meet these standards.</li>
                    <li><strong>Peace of Mind:</strong> Knowing that you are using strong, unique passwords can alleviate worries about your online security.</li>
                </ul>

                <h3>Try Our Password Generator Tool</h3>
                <p>Ready to enhance your online security? Use our Password Generator Tool to create unique, strong passwords with ease. Protect your accounts today!</p>
            </ToolArticleContainer>
        </ToolPage>
    )
}