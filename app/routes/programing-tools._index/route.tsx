import { LinksFunction, MetaFunction } from "@remix-run/cloudflare";
import { Link } from "@remix-run/react";
import UndrawVisionaryTechnology from "~/assets/undraw_visionary_technology_re_jfp7.svg";
import ArticlePage from "~/components/ArticlePage";
import Undraw from "~/components/Undraw";
import { CommonLinksGenerator, CommonMetaGenerator } from "~/utils/CommonCodeGenerators";

export const meta: MetaFunction = ({ location }) => {
    return [
        ...CommonMetaGenerator({
            title: "UtilStation - Programming Tools for Developers",
            description: "Discover tools that make coding easier at UtilStation.",
            extraKeywords: ["programming tools", "developer tools", "coding tools"],
            location
        }),
    ];
};

export const links: LinksFunction = () => {
    return [
        ...CommonLinksGenerator()
    ];
}

export default function ProgramingTools() {
    return (
        <ArticlePage>
            <Undraw src={UndrawVisionaryTechnology} height="200px" className="mx-auto" />
            <br />
            <h3>Programming Tools for Developers</h3>
            <p>Programming tools are essential resources for developers to streamline their workflows, improve efficiency, and focus on building high-quality software. Whether you’re a beginner or an experienced programmer, having reliable tools can help you debug code, test expressions, and optimize your projects.</p>

            <h3>Why Use Programming Tools?</h3>
            <p>Using the right programming tools can:</p>
            <ul>
                <li><strong>Save Time</strong>: Automated tools handle repetitive tasks, freeing you to work on more critical problems.</li>
                <li><strong>Improve Code Quality</strong>: Tools for testing, formatting, and linting ensure that your code is clean and error-free.</li>
                <li><strong>Enhance Productivity</strong>: Debuggers, parsers, and converters simplify complex tasks, making them easier and faster to execute.</li>
            </ul>

            <h3>Available Tools</h3>
            <p>Here are some of the tools available to assist in your development process:</p>
            <ul>
                <li><Link to="./cron-expression-parser">Cron Expression Parser</Link>: Easily interpret and test cron schedules.</li>
                <li><Link to="./base64-encoder-decoder">Base64 Encoder/Decoder</Link>: Encode and decode data in Base64 format.</li>
                <li><Link to="./uuid-generator">UUID Generator</Link>: Create unique identifiers for your applications.</li>
            </ul>

            <h3>Coming Soon</h3>
            <p>We’re always working to add new tools to support your programming needs. Here are some upcoming tools:</p>
            <ul>
                <li><strong>Code Formatter</strong>: Clean and standardize code in languages like HTML, CSS, and JavaScript.</li>
                <li><strong>Unit Converter</strong>: Convert between units used in programming, such as bytes and pixels.</li>
                <li><strong>Regex Tester</strong>: Test and refine regular expressions to validate data or search patterns.</li>
            </ul>

            <h3>Get Started with Our Programming Tools</h3>
            <p>With a variety of tools designed to enhance productivity, you can simplify complex tasks and focus on creating great code. Check back soon as we continue to expand our offerings to make your development workflow even smoother and more efficient!</p>
        </ArticlePage>
    )
}