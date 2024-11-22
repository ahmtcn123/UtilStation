import { Location } from "@remix-run/react";

export function switchStateByCallback([state, setstate]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
]): () => void {
    return () => {
        setstate(!state);
    };
}


export function switchToggleComponentByCallback(
    [state, setState]: [
        boolean,
        React.Dispatch<React.SetStateAction<boolean>>
    ]
): React.InputHTMLAttributes<HTMLInputElement> {
    return {
        onChange: () => {
            setState(!state);
        },
        value: Number(state),
    };
}

export type CommonMetaGeneratorType = {
    title: string,
    description?: string,
    extraKeywords?: string[],
    location?: Location,
}

export function CommonMetaGenerator({
    title,
    description = "UtilStation offers a wide range of tools including JSON converters, unit converters, and more. Simplify your coding tasks with our user-friendly tools.",
    extraKeywords,
    location
}: CommonMetaGeneratorType) {
    let defaultKeywords = "UtilStation, tools, code tools, JSON converter, unit converter, online tools, coding tools, programming utilities, text utilities, web development tools, productivity tools";

    if (extraKeywords) {
        defaultKeywords += ", " + extraKeywords.join(", ");
    }

    const metas: { [key: string]: number | string }[]
        = [
            { title: title },
            {
                name: "description",
                content: description,
            },
            {
                name: "keywords",
                content: defaultKeywords,
            },
            {
                name: "author",
                content: "Behemehal",
            },
            {
                property: "og:title",
                content: title,
            },
            {
                property: "og:description",
                content: description,
            },
            {
                property: "og:image",
                content: "https://utilstation.com/UtilStation.png",
            },
            {
                property: "og:url",
                content: "https://utilstation.com",
            },
            {
                property: "og:type",
                content: "website",
            },
            {
                name: "twitter:card",
                content: "summary_large_image",
            },
            {
                name: "twitter:title",
                content: title,
            },
            {
                name: "twitter:description",
                content: description,
            },
            {
                name: "twitter:image",
                content: "https://utilstation.com/UtilStation.png",
            },
        ];

    if (location) {
        metas.push(
            {
                tagName: "link",
                rel: "canonical",
                href: "https://utilstation.com" + location.pathname,
            },
        )
    }

    return metas;
}

export function CommonLinksGenerator() {
    return [];
}
