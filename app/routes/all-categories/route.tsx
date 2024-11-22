import Header, { Category, Tool } from "../../components/Header";
import Undraw from "../../components/Undraw";

import UndrawVisionaryTechnology from "~/assets/undraw_visionary_technology_re_jfp7.svg";
import Footer from "~/components/Footer";
import { CommonLinksGenerator, CommonMetaGenerator } from "~/utils/CommonCodeGenerators";
import { Link } from "@remix-run/react";
import { toSnakeCase } from "~/utils";
import tools from "../_index/tools.json";
import { LinksFunction, MetaFunction } from "@remix-run/cloudflare";
import { useEffect, useState } from "react";

export const meta: MetaFunction = ({ location }) => {
    return [
        ...CommonMetaGenerator({
            title: "UtilStation - All Categories",
            description: "All Categories of tools available on UtilStation",
            location,
        }),
    ];
};

export const links: LinksFunction = () => {
    return [
        ...CommonLinksGenerator()
    ];
}



function ToolComponent({ tagColors, baseUrl, idx, tool }: { tagColors: { [key: string]: string }, baseUrl: string; idx: string; tool: Tool }) {
    return (
        <div key={idx} className="card bg-base-100 shadow-xl max-w-96">
            <div className="card-body md:text-start md:items-start items-center text-center">
                <h2 className="card-title text-primary">
                    <Link to={`${baseUrl}/${tool.urlName || toSnakeCase(tool.name)}`}>{tool.name}</Link>
                </h2>
                <h3>{tool.description}</h3>
                <div className="card-actions mt-2 justify-center xsm:justify-start">
                    {
                        tool.tags.map((tag, index) => (
                            <span key={`${tag}_${index}`} className={`badge ${tagColors[tag]}`}>{tag}</span>
                        ))
                    }
                </div>
            </div>
        </div>
    );
}

function CategoryComponent({ tagColors, baseUrl, idx, category }: {
    tagColors: { [key: string]: string };
    baseUrl: string;
    idx: string;
    category: CategoryType
}) {
    const newUrl = `${baseUrl}/${category.urlName || toSnakeCase(category.name)}`;
    return (
        <section key={idx} className={"mx-auto  w-full flex items-center lg:justify-between flex-col lg:flex-row border-b border-currentCollor p-5 mb-2"}>
            <div className="flex flex-col justify-center lg:text-start text-center">
                <Link to={newUrl}>
                    <h1 id={toSnakeCase(category.name)} className="text-4xl link">{category.name}</h1>
                </Link>
                <p className="text-1xl my-5">
                    {category.description}
                </p>
                <br />
                <br />
                <div className={"grid grid-cols-1 gap-4 xsm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 place-items-center xsm:place-items-start"}>
                    {
                        category.tools?.map((tool, index) => (
                            <ToolComponent tagColors={tagColors} baseUrl={newUrl} idx={`${tool.name}_${index}`} key={index} tool={tool} />
                        ))
                    }
                </div>
            </div>
        </section >
    )
}

export type CategoryType = Pick<Category, "name" | "tools" | "subCategories" | "urlName" | "description">;

function recursiveToolCollect(categories: Category[], baseUrl: string = "."): Tool[] {
    const tools: Tool[] = [];

    for (const category of categories) {
        if (category.enabled == false) {
            continue;
        }

        if (category.tools) {
            tools.push(...category.tools);
        }

        if (category.subCategories) {
            tools.push(...recursiveToolCollect(category.subCategories, `${baseUrl}/${category.urlName || toSnakeCase(category.name)}`));
        }
    }

    return tools;
}

function recursiveCategoryCollect(categories: Category[], baseUrl: string = ".") {
    const newCategories: CategoryType[] = [];

    for (const category of categories) {
        const newUrl = `${baseUrl}/${category.urlName || toSnakeCase(category.name)}`;
        if (category.enabled == false) {
            continue;
        }

        if (category.tools) {
            newCategories.push({
                name: category.name, tools: category.tools, urlName: newUrl, description: category.description
            });
        }

        if (category.subCategories) {
            newCategories.push(...recursiveCategoryCollect(category.subCategories, newUrl));
        }
    }

    return newCategories;
}

export default function AllCategories() {
    const allTools = recursiveToolCollect(tools.mainCategories as Category[]);
    const categories = recursiveCategoryCollect(tools.mainCategories as Category[]);
    const randomColor = () => {
        const colors = [
            "badge-neutral",
            "badge-primary",
            "badge-secondary",
            "badge-accent",
            "badge-success",
            "badge-warning",
            "badge-error",
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    const toolTags = allTools.map(tool => tool.tags).flat();
    const [tagColors, setTagColors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        toolTags.forEach(tag => {
            if (!tagColors[tag]) {
                setTagColors((prev) => {
                    return { ...prev, [tag]: randomColor() };
                });
            }
        });
    }, [tagColors, toolTags]);

    return (
        <main className="flex-grow">
            <Header />
            <section className="p-5 mx-auto w-full border-b border-currentCollor flex items-center lg:justify-between flex-col lg:flex-row">
                <div className="flex flex-col justify-center lg:text-start text-center">
                    <h1 className="text-5xl">All Categories</h1>
                </div>
                <div style={{ height: "200px" }}>
                    <Undraw src={UndrawVisionaryTechnology} height="200px" />
                </div>
            </section>
            <section className="">
                {
                    categories.map((category, index) => (
                        <CategoryComponent tagColors={tagColors} key={`${category.name}_${index}`} baseUrl={""} idx={`${category.name}_${index}`} category={category} />
                    ))
                }
            </section>
            <Footer notFixedToBottom />
        </main>
    );
}
