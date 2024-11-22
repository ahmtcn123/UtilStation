import { LinksFunction, MetaFunction } from "@remix-run/cloudflare";
import ToolArticleContainer from "~/components/ToolArticleContainer";
import ToolContainer from "~/components/ToolContainer";
import ToolPage from "~/components/ToolPage";
import useToolInfo from "~/hooks/useToolInfo";
import { CommonLinksGenerator, CommonMetaGenerator } from "~/utils/CommonCodeGenerators";

export const meta: MetaFunction = ({ location }) => {
    return [
        ...CommonMetaGenerator({
            title: "UtilStation - TOOL NAME",
            description: "TOOL DESCRIPTION",
            extraKeywords: [],
            location
        }),
    ];
};

export const links: LinksFunction = () => {
    return [
        ...CommonLinksGenerator()
    ];
};


export default function JsonFormatter() {
    //hooks
    const toolInfo = useToolInfo();
    ///

    //refs
    //

    //states
    //

    //useEffects
    //

    //utils
    //

    //callbacks
    //

    return (
        <ToolPage toolProps={toolInfo}>
            <ToolContainer>
                <h2 className="text-2xl font-bold text-center">TOOL NAME</h2>
                <br />
            </ToolContainer>
            <ToolArticleContainer>
               TOOL ARTICLE
            </ToolArticleContainer>
        </ToolPage>
    );
}
