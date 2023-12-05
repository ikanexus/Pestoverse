export default defineEventHandler(async (event) => {
    const variant = getRouterParam(event, "variant");
    const imageName = getRouterParam(event, "image");

    const obj = await event.context.cloudflare.env.IMAGES.get(`${variant}/${imageName}`);
    if (obj === null) {
        throw createError({ statusCode: 404, statusMessage: "Image not found" });
    }
    console.log(obj);
    return Buffer.from(obj.body);
});
