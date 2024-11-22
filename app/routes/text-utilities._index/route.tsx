import { LinksFunction, MetaFunction } from "@remix-run/cloudflare";
import { Link } from "@remix-run/react";
import UndrawTextUtilities from "~/assets/undraw_speech_to_text_re_8mtf.svg";
import ArticlePage from "~/components/ArticlePage";
import Undraw from "~/components/Undraw";
import { CommonLinksGenerator, CommonMetaGenerator } from "~/utils/CommonCodeGenerators";

export const meta: MetaFunction = ({ location }) => {
    return [
        ...CommonMetaGenerator({
            title: "UtilStation - Text Utilities",
            description: "Discover tools that make working with text easier at UtilStation.",
            extraKeywords: ["text utilities", "text manipulation", "text tools"],
            location,
        }),
    ];
};

export const links: LinksFunction = () => {
    return [
        ...CommonLinksGenerator()
    ];
}

export default function TextUtilities() {
    return (
        <ArticlePage>
            <Undraw src={UndrawTextUtilities} height="200px" className="mx-auto" />
            <br />
            <h3>Text Utilities for Everyday Tasks</h3>
            <p>Text utilities are essential tools designed to help users manipulate and enhance text efficiently. Whether you&apos;re a writer, developer, or simply someone who works with text daily, having the right utilities can streamline your processes and save you time.</p>

            <h3>Why Use Text Utilities?</h3>
            <p>Utilizing text utilities can:</p>
            <ul>
                <li><strong>Increase Efficiency</strong>: Automate repetitive text-related tasks, allowing you to focus on more important work.</li>
                <li><strong>Improve Accuracy</strong>: Tools for text formatting and validation help ensure your content is clean and error-free.</li>
                <li><strong>Enhance Creativity</strong>: Generate ideas and random content that can inspire and support your writing or coding projects.</li>
            </ul>

            <h3>Available Tools</h3>
            <p>Here are some of the text utilities currently available to assist you:</p>
            <ul>
                <li><Link to="./password-generator">Password Generator</Link>: Create strong, unique passwords with customizable criteria.</li>
                <li><Link to="./hidden-character-cleaner">Text Hidden Character Cleaner</Link>: Remove unwanted characters and spaces from your text quickly.</li>
                <li><Link to="./case-converter">Text Case Converter</Link>: Easily convert text to different case styles (uppercase, lowercase, etc.).</li>
            </ul>

            <h3>Coming Soon</h3>
            <p>We are continually enhancing our suite of text utilities. Here are some upcoming tools to look forward to:</p>
            <ul>
                <li><strong>Text Formatter</strong>: Format your text for easy readability in various styles like Markdown or HTML.</li>
                <li><strong>Character Counter</strong>: Quickly count the number of characters, words, and sentences in your text.</li>
                <li><strong>Random Text Generator</strong>: Generate random placeholder text for your projects.</li>
                <li><strong>Find and Replace Tool</strong>: Efficiently search for and replace text within documents.</li>
            </ul>

            <h3>Get Started with Our Text Utilities</h3>
            <p>With a range of tools designed to enhance your productivity and simplify text manipulation, you can tackle everyday tasks with ease. Stay tuned as we continue to expand our offerings to support all your text-related needs!</p>
        </ArticlePage>
    )
}