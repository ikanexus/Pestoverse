type ImageResult = {
    placeholder: Buffer;
    shrunk: Buffer;
    original: Buffer;
    width: number;
    height: number;
};

const resizeImage = async (file: Buffer, tinifyToken: string): Promise<ImageResult> => {
    const headers = {
        Authorization: `Basic ${Buffer.from(`api:${tinifyToken}`).toString("base64")}`,
        "Content-Type": "application/json",
    };
    const res = await fetch(`https://api.tinify.com/shrink`, {
        method: "POST",
        headers,
        body: file,
    });
    const body = await res.json();
    const output = body.output.url;
    const width = body.output.width;
    const height = body.output.height;

    const shrunk = await fetch(output, {
        method: "POST",
        headers,
        body: JSON.stringify({
            convert: { type: "image/webp" },
            resize: { method: "fit", width: 800, height: 800 },
        }),
    });

    const placeholder = await fetch(output, {
        method: "POST",
        headers,
        body: JSON.stringify({
            convert: { type: "image/webp" },
            resize: { method: "fit", width: 20, height: 20 },
        }),
    });
    const shrunkImage = await shrunk.arrayBuffer();
    const placeholderImage = await placeholder.arrayBuffer();
    return { shrunk: Buffer.from(shrunkImage), placeholder: Buffer.from(placeholderImage), original: file, width, height };
};

export default defineEventHandler(async (event) => {
    const runtimeConfig = useRuntimeConfig(event);
    const formData = await readMultipartFormData(event);
    if (formData) {
        const file = formData[0];
        const result = await resizeImage(file.data, runtimeConfig.tinifyToken);
        const { shrunk, placeholder, original, width, height } = result;
        console.log("width", width, "height", height);
        return Buffer.from(placeholder);
    }
    return {};
});
