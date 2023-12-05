export default defineEventHandler(async (event) => {
    const variant = getRouterParam(event, "variant");
    const imageName = getRouterParam(event, "image");

    const obj = await event.context.cloudflare.env.IMAGES.get(`${variant}/${imageName}`);
    if (obj === null) {
        return new Response("Not found", { status: 404 });
    }
    return Buffer.from(obj);
});
