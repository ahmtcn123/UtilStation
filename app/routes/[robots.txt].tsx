
export const loader = () => {
    const robotText = `User-agent: *
Allow: /
Disallow: /leaving-utilstation
Sitemap: https://utilstation.com/sitemap.xml
`;

    return new Response(robotText, {
        status: 200,
        headers: {
            "Content-Type": "text/plain",
        },
    });
};
