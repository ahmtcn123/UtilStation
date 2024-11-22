import { LinksFunction, MetaFunction } from "@remix-run/cloudflare";
import { Link } from "@remix-run/react";
import UndrawCodeThinking from "~/assets/undraw_code_thinking_re_gka2.svg";
import ArticlePage from "~/components/ArticlePage";
import Undraw from "~/components/Undraw";
import { CommonLinksGenerator, CommonMetaGenerator } from "~/utils/CommonCodeGenerators";

export const meta: MetaFunction = ({ location }) => {
    return [
        ...CommonMetaGenerator({
            title: "Code Formatters - Format, Beautify, and Minify Code Instantly",
            description: "Beautify, minify, and format your code with our suite of code tools. Make JSON, HTML, and other languages easier to read, debug, and optimize.",
            extraKeywords: ["code formatters", "code beautifier", "code minifier"],
            location
        }),
    ];
};

export const links: LinksFunction = () => {
    return [
        ...CommonLinksGenerator()
    ];
}

export default function CodeFormatters() {
    return (
        <ArticlePage>
            <Undraw src={UndrawCodeThinking} height="200px" className="mx-auto" />
            <br />
            <h3>Code Formatters for Clean, Readable Code</h3>
            <p>Code formatters are invaluable tools for developers, making code easier to read, debug, and share. Whether you’re working with JSON, HTML, or other languages, formatters structure your code to improve readability and maintain a consistent style. We also offer minification tools to optimize code size without sacrificing readability.</p>

            <h3>Why Use Code Formatters?</h3>
            <p>Using code formatters can:</p>
            <ul>
                <li><strong>Improve Readability</strong>: Well-formatted code is easier to understand and maintain.</li>
                <li><strong>Facilitate Collaboration</strong>: Consistent code formatting helps teams work more cohesively.</li>
                <li><strong>Enhance Debugging</strong>: Structured code makes it easier to spot errors and issues quickly.</li>
                <li><strong>Minimize File Size</strong>: Minified code reduces the size, improving performance without losing functionality.</li>
            </ul>

            <h3>Available Code Formatters</h3>
            <p>Our code formatters support a variety of languages and functionalities to meet your needs:</p>
            <ul>
                <li><Link to="./json-formatter">JSON Formatter</Link>: Beautify & Minify JSON for better readability and debugging, or minify it for optimized size.</li>
            </ul>

            <h3>Upcoming Code Formatters</h3>
            <p>We’re continuously expanding our suite of code formatters to support more languages and features. Here’s a preview of what’s coming soon:</p>
            <ul>
                <li><strong>HTML Formatter</strong>: Beautify and minify HTML code to ensure clean structure and optimize file size.</li>
                <li><strong>JavaScript Formatter</strong>: Tidy up and minify JavaScript code to improve readability and performance.</li>
                <li><strong>CSS Formatter</strong>: Organize and minify CSS code for better structure and smaller file size.</li>
            </ul>

            <h3>Get Started with Our Code Formatters</h3>
            <p>Experience the ease of reading well-formatted code with our beautification and minification tools. More tools are coming soon to support additional languages and formatting options. Stay tuned and streamline your coding experience!</p>
        </ArticlePage>
    )
}
