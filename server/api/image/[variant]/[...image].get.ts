export default defineEventHandler(async (event) => {
    const runtimeConfig = useRuntimeConfig(event);
    const variant = getRouterParam(event, "variant");
    const imageName = getRouterParam(event, "image");
    const blob = await fetch(`https://imagedelivery.net/${runtimeConfig.cfImages.accountHash}/${imageName}/${variant}`);
    const buffer = await blob.arrayBuffer();
    return Buffer.from(buffer);
});
