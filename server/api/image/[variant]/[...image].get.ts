const copyHeader = (event: any, res: Response, key: string) => {
    const value = res.headers.get(key);
    if (value) {
        setResponseHeader(event, key, value);
    }
};

export default defineEventHandler(async (event) => {
    const runtimeConfig = useRuntimeConfig(event);
    const variant = getRouterParam(event, "variant");
    const imageName = getRouterParam(event, "image");

    const { ...headers } = event.node.req.headers;

    const res = await fetch(`https://imagedelivery.net/${runtimeConfig.cfImages.accountHash}/${imageName}/${variant}`, {
        headers: headers as any,
    });
    const buffer = await res.arrayBuffer();
    copyHeader(event, res, "content-type");
    setResponseHeader(event, "cache-control", "public, max-age=3600");
    return Buffer.from(buffer);
});
