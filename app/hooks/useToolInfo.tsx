import { useLocation } from "@remix-run/react";
import { Category, Tool } from "~/components/Header";
import Tools from "~/routes/_index/tools.json";

function snakeCaseToNormalCase(str: string): string {
    return str.split('-').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}


function searchInCategory(category: Category, path: string): Tool | undefined {
    const activePath = path.split('/')[0];

    for (const tool of category.tools || []) {
        if (tool.urlName ? tool.urlName == activePath : tool.name === snakeCaseToNormalCase(activePath)) {
            return tool;
        }
    }

    for (const subCategory of category.subCategories || []) {
        const foundTool = searchInCategory(subCategory, path.split('/').slice(1).join('/'));
        if (foundTool) {
            return foundTool;
        }
    }
    return undefined;
}

export default function useToolInfo(): Tool {
    const url = useLocation();
    const mainCategories = Tools.mainCategories as unknown as Category[];
    const pathDir = url.pathname.split('/').slice(1).join('/');
    const activePath = pathDir.split('/')[0];
    const baseName = snakeCaseToNormalCase(activePath);
    const foundBaseCategory = mainCategories.find((category) => category.name === baseName);

    const foundTool = searchInCategory(foundBaseCategory!, pathDir.split('/').slice(1).join('/'));

    if (!foundTool) {
        throw new Error('Tool not found');
    }

    return foundTool;
}
